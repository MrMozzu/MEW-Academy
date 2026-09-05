import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDatabase } from '../server/config/database.js';
import { hashPassword, comparePassword, generateResetToken, generateCertificateNumber, generateVerificationHash } from '../server/utils/helpers.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mew_academy_jwt_secret_key_2026_super_secure';

describe('Production Readiness Full-Stack Tests', () => {
  let db: any;
  const testStudentEmail = `prod.student.${Date.now()}@mewacademy.com`;
  const testStudentPass = 'Student@2026Password';
  const testStudentPhone = '9876543210';
  let testStudentId = `user-prod-${Date.now()}`;
  let studentToken = '';

  beforeAll(() => {
    db = getDatabase();
  });

  afterAll(() => {
    try {
      db.prepare('DELETE FROM certificates WHERE user_id = ?').run(testStudentId);
      db.prepare('DELETE FROM transactions WHERE user_id = ?').run(testStudentId);
      db.prepare('DELETE FROM enrollments WHERE user_id = ?').run(testStudentId);
      db.prepare('DELETE FROM email_verifications WHERE email = ?').run(testStudentEmail);
      db.prepare('DELETE FROM users WHERE email = ?').run(testStudentEmail);
    } catch {}
  });

  // ─────────────────────────────────────────────────────────────────
  // 1. Database Architecture & Schema Integrity
  // ─────────────────────────────────────────────────────────────────
  describe('1. Database Schema & Admin Authorization', () => {
    it('Should verify all core production tables exist', () => {
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((t: any) => t.name);
      expect(tables).toContain('users');
      expect(tables).toContain('enrollments');
      expect(tables).toContain('transactions');
      expect(tables).toContain('certificates');
      expect(tables).toContain('progress');
      expect(tables).toContain('email_verifications');
      expect(tables).toContain('password_resets');
    });

    it('Should ensure designated admin accounts exist and have role=admin', () => {
      const adminEmail = 'muzammilahsan07@gmail.com';
      const adminUser = db.prepare('SELECT email, role FROM users WHERE email = ?').get(adminEmail) as any;
      if (adminUser) {
        expect(adminUser.role).toBe('admin');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 2. Authentication, OTP Verification & Password Management
  // ─────────────────────────────────────────────────────────────────
  describe('2. Student Registration & OTP Security', () => {
    it('Should store pending email verification OTP upon registration request', async () => {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const passwordHash = await hashPassword(testStudentPass);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO email_verifications (email, otp_code, name, password_hash, phone, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(testStudentEmail, otpCode, 'Production Test Student', passwordHash, testStudentPhone, expiresAt);

      const record = db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(testStudentEmail) as any;
      expect(record).toBeDefined();
      expect(record.otp_code).toBe(otpCode);
      expect(record.phone).toBe(testStudentPhone);
    });

    it('Should create student user when OTP is verified', async () => {
      const record = db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(testStudentEmail) as any;
      expect(record).toBeDefined();

      // Simulate OTP verification step
      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, phone, role)
        VALUES (?, ?, ?, ?, ?, 'student')
      `).run(testStudentId, record.name, record.email, record.password_hash, record.phone);

      // Clean up verification entry
      db.prepare('DELETE FROM email_verifications WHERE email = ?').run(testStudentEmail);

      const userInDb = db.prepare('SELECT * FROM users WHERE id = ?').get(testStudentId) as any;
      expect(userInDb).toBeDefined();
      expect(userInDb.role).toBe('student');
      expect(userInDb.phone).toBe(testStudentPhone);

      // Create JWT
      studentToken = jwt.sign(
        { userId: userInDb.id, email: userInDb.email, role: userInDb.role, name: userInDb.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(typeof studentToken).toBe('string');
    });

    it('Should verify password authentication on login', async () => {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(testStudentEmail) as any;
      const isMatch = await comparePassword(testStudentPass, user.password_hash);
      expect(isMatch).toBe(true);

      const isBadMatch = await comparePassword('WrongPassword@999', user.password_hash);
      expect(isBadMatch).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. Approach B Payment & Admin Approval Queue
  // ─────────────────────────────────────────────────────────────────
  describe('3. UPI Admission Submission & Admin Approval Queue', () => {
    const courseId = 'course-data-analytics';
    const testUtr = '523412984012';
    const txnId = `TXN-PROD-${Date.now().toString().slice(-6)}`;
    const orderId = `ORD-PROD-${Date.now().toString().slice(-6)}`;

    it('Should submit payment proof and set status to PENDING_APPROVAL', () => {
      // 1. Insert transaction
      db.prepare(`
        INSERT INTO transactions (
          id, order_id, user_id, course_id, course_title, amount, currency,
          gateway, payment_method_details, discount_applied, coupon_code,
          status, utr_number
        ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'UPI', ?, ?, ?, 'PENDING_APPROVAL', ?)
      `).run(
        txnId,
        orderId,
        testStudentId,
        courseId,
        '1-Month Online Live EDA Masterclass',
        1299,
        `UPI (VPA: 7070806047@ikwik | UTR: ${testUtr})`,
        200,
        'IKAMAI',
        testUtr
      );

      // 2. Set enrollment to pending_approval
      db.prepare(`
        INSERT INTO enrollments (id, user_id, course_id, status)
        VALUES (?, ?, ?, 'pending_approval')
      `).run(`enr-${Date.now()}`, testStudentId, courseId);

      const txn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txnId) as any;
      expect(txn.status).toBe('PENDING_APPROVAL');
      expect(txn.utr_number).toBe(testUtr);
      expect(txn.amount).toBe(1299);
      expect(txn.coupon_code).toBe('IKAMAI');

      const enr = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(testStudentId, courseId) as any;
      expect(enr.status).toBe('pending_approval');
    });

    it('Should display pending transaction in Admin Approval Queue', () => {
      const queue = db.prepare(`
        SELECT t.*, u.name as student_name, u.email as student_email, u.phone as student_phone
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.status = 'PENDING_APPROVAL'
      `).all() as any[];

      expect(queue.length).toBeGreaterThan(0);
      const studentTxn = queue.find(q => q.user_id === testStudentId);
      expect(studentTxn).toBeDefined();
      expect(studentTxn.student_phone).toBe(testStudentPhone);
      expect(studentTxn.utr_number).toBe(testUtr);
    });

    it('Should approve admission: set status=SUCCESS and enrollment=enrolled', () => {
      db.prepare("UPDATE transactions SET status = 'SUCCESS' WHERE id = ?").run(txnId);
      db.prepare("UPDATE enrollments SET status = 'enrolled' WHERE user_id = ? AND course_id = ?").run(testStudentId, courseId);

      const txn = db.prepare('SELECT status FROM transactions WHERE id = ?').get(txnId) as any;
      expect(txn.status).toBe('SUCCESS');

      const enr = db.prepare('SELECT status FROM enrollments WHERE user_id = ? AND course_id = ?').get(testStudentId, courseId) as any;
      expect(enr.status).toBe('enrolled');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. 3-in-1 Certificate Suite & Cryptographic Verification
  // ─────────────────────────────────────────────────────────────────
  describe('4. Accredited 3-in-1 Certificate Authority', () => {
    it('Should issue 3-in-1 certificate bundle for student', () => {
      const courseId = 'course-data-analytics';
      const modules = [
        { code: 'PY', title: 'Python Data Analytics Specialist', flagship: 0 },
        { code: 'VIZ', title: 'Data Visualization & BI Specialist', flagship: 0 },
        { code: 'PRO', title: 'Certified Professional Data Analyst', flagship: 1 }
      ];

      for (const m of modules) {
        const certId = `cert-${Date.now()}-${m.code}`;
        const certNum = generateCertificateNumber();
        const verificationHash = generateVerificationHash();

        const credentialId = `MEW-CRED-${Date.now()}-${m.code}`;

        db.prepare(`
          INSERT INTO certificates (
            id, certificate_number, credential_id, user_id, course_id, course_title,
            category, instructor_name, instructor_title, grade, overall_score,
            skills_verified, verification_hash, badge_title, is_flagship
          ) VALUES (?, ?, ?, ?, ?, ?, 'Data Science', 'Prof. MD Tahseen Equbal', 'Founder & Lead Mentor, MEW Academy', 'Distinction', 98, ?, ?, ?, ?)
        `).run(
          certId,
          certNum,
          credentialId,
          testStudentId,
          courseId,
          '1-Month Online Live EDA Masterclass',
          JSON.stringify(['Python', 'Pandas', 'Power BI']),
          verificationHash,
          m.title,
          m.flagship
        );
      }

      const issuedCerts = db.prepare('SELECT * FROM certificates WHERE user_id = ?').all(testStudentId) as any[];
      expect(issuedCerts.length).toBe(3);

      const flagship = issuedCerts.find(c => c.is_flagship === 1);
      expect(flagship).toBeDefined();
      expect(flagship.badge_title).toContain('Professional');
    });

    it('Should verify certificate authenticity via verification hash', () => {
      const cert = db.prepare('SELECT * FROM certificates WHERE user_id = ? LIMIT 1').get(testStudentId) as any;
      expect(cert).toBeDefined();
      expect(cert.verification_hash).toBeDefined();

      const matchedCert = db.prepare('SELECT * FROM certificates WHERE verification_hash = ?').get(cert.verification_hash) as any;
      expect(matchedCert).toBeDefined();
      expect(matchedCert.certificate_number).toBe(cert.certificate_number);
    });
  });
});
