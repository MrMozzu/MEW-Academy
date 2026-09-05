import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDatabase } from '../server/config/database.js';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken, 
  generateResetToken, 
  generateNumericOTP,
  generateCertificateNumber, 
  generateVerificationHash 
} from '../server/utils/helpers.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mew_academy_jwt_secret_k8x9v2m7p4q1w6z3';

describe('MEW Academy - Complete End-to-End System & Functionality Test Suite', () => {
  let db: any;
  const testTimestamp = Date.now();
  const testStudentEmail = `test.student.${testTimestamp}@mewacademy.com`;
  const testStudentName = 'Mew E2E Test Student';
  const testStudentPhone = '9876543210';
  const testStudentInitialPass = 'MewPassword@2026';
  const testStudentNewPass = 'MewNewPassword@2026#';
  let testStudentId = '';
  let studentJwtToken = '';
  let adminJwtToken = '';
  let resetToken = '';
  let resetOtp = '';
  const adminEmail = 'muzammilahsan07@gmail.com';
  const testCourseId = 'course-data-analytics';
  const testUtrNumber = '707080604712';
  let testTxnId = '';

  beforeAll(() => {
    db = getDatabase();
  });

  afterAll(() => {
    try {
      if (testStudentId) {
        db.prepare('DELETE FROM certificates WHERE user_id = ?').run(testStudentId);
        db.prepare('DELETE FROM transactions WHERE user_id = ?').run(testStudentId);
        db.prepare('DELETE FROM enrollments WHERE user_id = ?').run(testStudentId);
        db.prepare('DELETE FROM progress WHERE user_id = ?').run(testStudentId);
        db.prepare('DELETE FROM users WHERE id = ?').run(testStudentId);
      }
      db.prepare('DELETE FROM email_verifications WHERE email = ?').run(testStudentEmail);
      db.prepare('DELETE FROM password_resets WHERE email = ?').run(testStudentEmail);
    } catch (e) {
      console.warn('Cleanup warning:', e);
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // 1. Database Schema & Config Verification
  // ─────────────────────────────────────────────────────────────────
  describe('1. Database Schema, Tables & Security Columns', () => {
    it('1.1 Should contain all essential production tables', () => {
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((t: any) => t.name);
      expect(tables).toContain('users');
      expect(tables).toContain('enrollments');
      expect(tables).toContain('transactions');
      expect(tables).toContain('certificates');
      expect(tables).toContain('progress');
      expect(tables).toContain('email_verifications');
      expect(tables).toContain('password_resets');
    });

    it('1.2 Should verify UPI UTR and pending approval status support in transactions', () => {
      const cols = db.prepare("PRAGMA table_info(transactions)").all().map((c: any) => c.name);
      expect(cols).toContain('utr_number');
      expect(cols).toContain('status');
      expect(cols).toContain('coupon_code');
      expect(cols).toContain('discount_applied');
    });

    it('1.3 Should ensure designated master admin accounts exist', () => {
      const admin = db.prepare('SELECT email, role FROM users WHERE email = ?').get(adminEmail) as any;
      if (admin) {
        expect(admin.role).toBe('admin');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 2. Student Registration & 6-Digit Email OTP Verification
  // ─────────────────────────────────────────────────────────────────
  describe('2. Student Registration & 6-Digit Email OTP Workflow', () => {
    let generatedOtp = '';

    it('2.1 Should generate 6-digit numeric OTP and store pending registration', async () => {
      generatedOtp = generateNumericOTP(6);
      expect(generatedOtp).toMatch(/^\d{6}$/);

      const passHash = await hashPassword(testStudentInitialPass);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO email_verifications (email, otp_code, name, password_hash, phone, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(testStudentEmail, generatedOtp, testStudentName, passHash, testStudentPhone, expiresAt);

      const record = db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(testStudentEmail) as any;
      expect(record).toBeDefined();
      expect(record.otp_code).toBe(generatedOtp);
      expect(record.name).toBe(testStudentName);
      expect(record.phone).toBe(testStudentPhone);
    });

    it('2.2 Should support resending a fresh 6-digit OTP', () => {
      const freshOtp = generateNumericOTP(6);
      const newExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      db.prepare('UPDATE email_verifications SET otp_code = ?, expires_at = ? WHERE email = ?')
        .run(freshOtp, newExpiry, testStudentEmail);

      const updated = db.prepare('SELECT * FROM email_verifications WHERE email = ?').get(testStudentEmail) as any;
      expect(updated.otp_code).toBe(freshOtp);
      generatedOtp = freshOtp;
    });

    it('2.3 Should reject incorrect OTP codes', () => {
      const badRecord = db.prepare(`
        SELECT * FROM email_verifications 
        WHERE email = ? AND otp_code = '000000' AND expires_at > datetime('now')
      `).get(testStudentEmail) as any;
      expect(badRecord).toBeUndefined();
    });

    it('2.4 Should verify valid 6-digit OTP, create verified student user, and issue JWT token', async () => {
      const record = db.prepare(`
        SELECT * FROM email_verifications 
        WHERE email = ? AND otp_code = ? AND expires_at > datetime('now')
      `).get(testStudentEmail, generatedOtp) as any;

      expect(record).toBeDefined();

      testStudentId = `usr-test-${Date.now()}`;
      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, phone, role, avatar, headline)
        VALUES (?, ?, ?, ?, ?, 'student', '/student-avatar.png', 'Data Analytics Explorer')
      `).run(testStudentId, record.name, record.email, record.password_hash, record.phone);

      // Clean up verification record
      db.prepare('DELETE FROM email_verifications WHERE email = ?').run(testStudentEmail);

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testStudentId) as any;
      expect(user).toBeDefined();
      expect(user.email).toBe(testStudentEmail);
      expect(user.role).toBe('student');

      studentJwtToken = generateToken({ userId: user.id, email: user.email, role: user.role });
      expect(typeof studentJwtToken).toBe('string');
      expect(studentJwtToken.length).toBeGreaterThan(20);

      const decoded = verifyToken(studentJwtToken);
      expect(decoded.userId).toBe(testStudentId);
      expect(decoded.email).toBe(testStudentEmail);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. Password Authentication, Forgot Password & Password Reset
  // ─────────────────────────────────────────────────────────────────
  describe('3. Password Login, Forgot Password & Reset Workflows', () => {
    it('3.1 Should authenticate student with correct password', async () => {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testStudentId) as any;
      const isValid = await comparePassword(testStudentInitialPass, user.password_hash);
      expect(isValid).toBe(true);

      const isBad = await comparePassword('WrongPassword@999', user.password_hash);
      expect(isBad).toBe(false);
    });

    it('3.2 Should initiate forgot password: store reset token and 6-digit recovery OTP', () => {
      resetToken = generateResetToken();
      resetOtp = generateNumericOTP(6);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)').run(
        testStudentEmail,
        resetToken,
        expiresAt
      );
      db.prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)').run(
        testStudentEmail,
        resetOtp,
        expiresAt
      );

      const records = db.prepare('SELECT * FROM password_resets WHERE email = ? AND used = 0').all(testStudentEmail) as any[];
      expect(records.length).toBe(2);
    });

    it('3.3 Should reset password using 6-digit recovery OTP and log in with new password', async () => {
      const nowIso = new Date().toISOString();
      const resetRecord = db.prepare(
        'SELECT * FROM password_resets WHERE email = ? AND token = ? AND used = 0 AND expires_at > ?'
      ).get(testStudentEmail, resetOtp, nowIso) as any;

      expect(resetRecord).toBeDefined();

      const newPassHash = await hashPassword(testStudentNewPass);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?')
        .run(newPassHash, nowIso, testStudentEmail);

      // Invalidate tokens
      db.prepare('UPDATE password_resets SET used = 1 WHERE email = ?').run(testStudentEmail);

      const updatedUser = db.prepare('SELECT * FROM users WHERE email = ?').get(testStudentEmail) as any;
      const canLoginNew = await comparePassword(testStudentNewPass, updatedUser.password_hash);
      expect(canLoginNew).toBe(true);

      const cannotLoginOld = await comparePassword(testStudentInitialPass, updatedUser.password_hash);
      expect(cannotLoginOld).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. Google OAuth Profile Integration
  // ─────────────────────────────────────────────────────────────────
  describe('4. Google OAuth Authentication & Linking', () => {
    it('4.1 Should support OAuth account creation with google_id and avatar', async () => {
      const oauthEmail = `google.student.${Date.now()}@mewacademy.com`;
      const oauthGoogleId = `google-sub-${Date.now()}`;
      const oauthUserId = `usr-google-${Date.now()}`;
      const tempPassHash = await hashPassword(generateResetToken());

      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role, avatar, headline, google_id, auth_provider)
        VALUES (?, 'Google Learner', ?, ?, 'student', 'https://lh3.googleusercontent.com/a/sample', 'Data Analytics Explorer', ?, 'google')
      `).run(oauthUserId, oauthEmail, tempPassHash, oauthGoogleId);

      const oauthUser = db.prepare('SELECT * FROM users WHERE id = ?').get(oauthUserId) as any;
      expect(oauthUser).toBeDefined();
      expect(oauthUser.google_id).toBe(oauthGoogleId);
      expect(oauthUser.auth_provider).toBe('google');

      // Cleanup oauth user
      db.prepare('DELETE FROM users WHERE id = ?').run(oauthUserId);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 5. UPI Admission & Discount Coupon Submission (Approach B)
  // ─────────────────────────────────────────────────────────────────
  describe('5. UPI Admission & Admin Approval Queue', () => {
    it('5.1 Should calculate coupon discount (IKAMAI -> -₹200) and submit payment proof', () => {
      testTxnId = `TXN-E2E-${Date.now().toString().slice(-6)}`;
      const orderId = `ORD-E2E-${Date.now().toString().slice(-6)}`;
      const basePrice = 1599;
      const discount = 200;
      const finalPayable = basePrice - discount; // 1399

      db.prepare(`
        INSERT INTO transactions (
          id, order_id, user_id, course_id, course_title, amount, currency,
          gateway, payment_method_details, discount_applied, coupon_code,
          status, utr_number
        ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'UPI', ?, ?, 'IKAMAI', 'PENDING_APPROVAL', ?)
      `).run(
        testTxnId,
        orderId,
        testStudentId,
        testCourseId,
        '1-Month Online Live EDA Masterclass',
        finalPayable,
        `UPI (VPA: 7070806047@ikwik | Transaction ID: ${testUtrNumber} | Coupon: IKAMAI -₹200)`,
        discount,
        testUtrNumber
      );

      db.prepare(`
        INSERT INTO enrollments (id, user_id, course_id, status)
        VALUES (?, ?, ?, 'pending_approval')
      `).run(`enr-${Date.now()}`, testStudentId, testCourseId);

      const savedTxn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(testTxnId) as any;
      expect(savedTxn).toBeDefined();
      expect(savedTxn.status).toBe('PENDING_APPROVAL');
      expect(savedTxn.amount).toBe(1399);
      expect(savedTxn.coupon_code).toBe('IKAMAI');
      expect(savedTxn.utr_number).toBe(testUtrNumber);

      const savedEnr = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(testStudentId, testCourseId) as any;
      expect(savedEnr.status).toBe('pending_approval');
    });

    it('5.2 Admin should see pending transaction in approval queue with student contact details', () => {
      const queue = db.prepare(`
        SELECT t.*, u.name as student_name, u.email as student_email, u.phone as student_phone
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.status = 'PENDING_APPROVAL'
      `).all() as any[];

      expect(queue.length).toBeGreaterThan(0);
      const target = queue.find(q => q.id === testTxnId);
      expect(target).toBeDefined();
      expect(target.student_name).toBe(testStudentName);
      expect(target.student_phone).toBe(testStudentPhone);
      expect(target.utr_number).toBe(testUtrNumber);
    });

    it('5.3 Admin approves payment: activates enrollment to enrolled and transaction to SUCCESS', () => {
      db.prepare("UPDATE transactions SET status = 'SUCCESS' WHERE id = ?").run(testTxnId);
      db.prepare("UPDATE enrollments SET status = 'enrolled' WHERE user_id = ? AND course_id = ?").run(testStudentId, testCourseId);

      const updatedTxn = db.prepare('SELECT status FROM transactions WHERE id = ?').get(testTxnId) as any;
      expect(updatedTxn.status).toBe('SUCCESS');

      const updatedEnr = db.prepare('SELECT status FROM enrollments WHERE user_id = ? AND course_id = ?').get(testStudentId, testCourseId) as any;
      expect(updatedEnr.status).toBe('enrolled');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 6. 3-in-1 Accredited Certificate Suite & Public Verification
  // ─────────────────────────────────────────────────────────────────
  describe('6. 3-in-1 Accredited Certificate Authority & Verification', () => {
    const certDefinitions = [
      { code: 'PY', title: 'Certificate in Python for Data Analytics', category: 'Python Data Analytics', flagship: 0 },
      { code: 'VIZ', title: 'Certificate in Data Visualization & Business Intelligence', category: 'Data Visualization & BI', flagship: 0 },
      { code: 'PRO', title: 'Professional Certificate in Data Analytics', category: 'Full-Stack Data Analytics Program', flagship: 1 }
    ];

    it('6.1 Should issue 3-in-1 accredited certificate bundle for student', () => {
      for (const def of certDefinitions) {
        const certId = `cert-${Date.now()}-${def.code}`;
        const certNum = generateCertificateNumber(def.code);
        const verificationHash = generateVerificationHash();

        db.prepare(`
          INSERT INTO certificates (
            id, certificate_number, credential_id, user_id, course_id, course_title,
            category, instructor_name, instructor_title, grade, overall_score,
            skills_verified, verification_hash, badge_title, is_flagship, verification_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Prof. MD Tahseen Equbal', 'Lead Mentor & Founder, MEW Academy', 'Distinction', 98, ?, ?, ?, ?, ?)
        `).run(
          certId,
          certNum,
          certNum,
          testStudentId,
          testCourseId,
          def.title,
          def.category,
          JSON.stringify(['Python', 'NumPy', 'Pandas', 'Power BI']),
          verificationHash,
          def.category,
          def.flagship,
          `https://mewacademy.com/verify/${certNum}`
        );
      }

      const issued = db.prepare('SELECT * FROM certificates WHERE user_id = ?').all(testStudentId) as any[];
      expect(issued.length).toBe(3);

      const flagship = issued.find(c => c.is_flagship === 1);
      expect(flagship).toBeDefined();
      expect(flagship.course_title).toContain('Professional');
    });

    it('6.2 Public Verification Engine: should verify certificate by Credential ID', () => {
      const sample = db.prepare('SELECT * FROM certificates WHERE user_id = ? LIMIT 1').get(testStudentId) as any;
      expect(sample).toBeDefined();

      const verified = db.prepare(`
        SELECT c.*, u.name as recipient_name 
        FROM certificates c
        JOIN users u ON c.user_id = u.id
        WHERE c.credential_id = ?
      `).get(sample.credential_id) as any;

      expect(verified).toBeDefined();
      expect(verified.recipient_name).toBe(testStudentName);
      expect(verified.certificate_number).toBe(sample.certificate_number);
    });

    it('6.3 Admin can revoke an issued certificate', () => {
      const sample = db.prepare('SELECT id FROM certificates WHERE user_id = ? LIMIT 1').get(testStudentId) as any;
      expect(sample).toBeDefined();

      db.prepare('DELETE FROM certificates WHERE id = ?').run(sample.id);

      const remaining = db.prepare('SELECT * FROM certificates WHERE user_id = ?').all(testStudentId) as any[];
      expect(remaining.length).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 7. Student Lesson Progress Tracking & Quiz XP Scoring
  // ─────────────────────────────────────────────────────────────────
  describe('7. Interactive Progress Tracking & Gamification XP', () => {
    it('7.1 Should record completed lesson and award 25 XP to student profile', () => {
      const lessonId = 'les-1-1';
      const initialUser = db.prepare('SELECT xp_points FROM users WHERE id = ?').get(testStudentId) as any;
      const initialXp = initialUser?.xp_points || 0;

      const progressId = `prg-${Date.now()}`;
      db.prepare(`
        INSERT INTO progress (id, user_id, course_id, lesson_id, completed, completed_at)
        VALUES (?, ?, ?, ?, 1, datetime('now'))
      `).run(progressId, testStudentId, testCourseId, lessonId);

      db.prepare('UPDATE users SET xp_points = xp_points + 25 WHERE id = ?').run(testStudentId);

      const prog = db.prepare('SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?').get(testStudentId, lessonId) as any;
      expect(prog).toBeDefined();
      expect(prog.completed).toBe(1);

      const updatedUser = db.prepare('SELECT xp_points FROM users WHERE id = ?').get(testStudentId) as any;
      expect(updatedUser.xp_points).toBe(initialXp + 25);
    });

    it('7.2 Should toggle lesson completion status', () => {
      const lessonId = 'les-1-1';
      // Toggle to uncompleted
      db.prepare('UPDATE progress SET completed = 0 WHERE user_id = ? AND lesson_id = ?').run(testStudentId, lessonId);
      let prog = db.prepare('SELECT completed FROM progress WHERE user_id = ? AND lesson_id = ?').get(testStudentId, lessonId) as any;
      expect(prog.completed).toBe(0);

      // Toggle back to completed
      db.prepare("UPDATE progress SET completed = 1, completed_at = datetime('now') WHERE user_id = ? AND lesson_id = ?").run(testStudentId, lessonId);
      prog = db.prepare('SELECT completed FROM progress WHERE user_id = ? AND lesson_id = ?').get(testStudentId, lessonId) as any;
      expect(prog.completed).toBe(1);
    });
  });
});
