import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateId, generateCertificateNumber, generateVerificationHash } from '../utils/helpers.js';

const router = Router();

/**
 * GET /api/certificates
 * Get certificates:
 * - Admin gets all certificates issued across the academy.
 * - Students ONLY get certificates explicitly issued to their account.
 */
router.get('/', authenticate, (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const db = getDatabase();

    let certs: any[];
    if (role === 'admin') {
      certs = db.prepare(`
        SELECT c.*, u.name as recipient_name, u.email as recipient_email
        FROM certificates c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.issued_at DESC
      `).all() as any[];
    } else {
      certs = db.prepare(`
        SELECT c.*, u.name as recipient_name, u.email as recipient_email
        FROM certificates c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = ?
        ORDER BY c.issued_at DESC
      `).all(userId) as any[];
    }

    res.json({
      success: true,
      certificates: certs.map(c => ({
        id: c.id,
        certificateNumber: c.certificate_number,
        recipientName: c.recipient_name,
        recipientEmail: c.recipient_email,
        courseId: c.course_id,
        courseTitle: c.course_title,
        category: c.category,
        instructorName: c.instructor_name,
        instructorTitle: c.instructor_title,
        grade: c.grade,
        overallScore: c.overall_score,
        skillsVerified: JSON.parse(c.skills_verified || '[]'),
        verificationUrl: c.verification_url,
        credentialId: c.credential_id,
        verificationHash: c.verification_hash,
        badgeTitle: c.badge_title,
        covers: c.covers,
        isFlagship: !!c.is_flagship,
        issuedAt: c.issued_at,
      })),
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/certificates/issue
 * STRICT ADMIN RBAC: Only administrators can issue certificates.
 * Students CANNOT call this endpoint.
 */
router.post('/issue', authenticate, authorize('admin'), (req: Request, res: Response) => {
  try {
    const { 
      studentId, 
      studentEmail, 
      courseId, 
      courseTitle, 
      category, 
      instructorName, 
      instructorTitle, 
      overallScore, 
      skillsVerified, 
      grade 
    } = req.body;

    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required.' });
      return;
    }

    const db = getDatabase();

    // 1. Locate student by ID or email
    let student: any = null;
    if (studentId) {
      student = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(studentId);
    } else if (studentEmail) {
      student = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(studentEmail.trim().toLowerCase());
    }

    if (!student) {
      res.status(404).json({ error: 'Student not found in registry.' });
      return;
    }

    // 2. Determine certificates to issue (3-in-1 suite or individual module)
    const { moduleType = 'all' } = req.body;

    const allDefinitions = [
      {
        code: 'PY',
        title: 'Certificate in Python for Data Analytics',
        category: 'Python Data Analytics',
        badge: 'Python Data Analytics',
        covers: 'Python • NumPy • Pandas',
        isFlagship: 0,
        skills: ['Python 3 Programming', 'NumPy Vectorized Ops', 'Pandas Data Wrangling', 'Missing Value Imputation', 'Data Structuring & Lambdas']
      },
      {
        code: 'VIZ',
        title: 'Certificate in Data Visualization & Business Intelligence',
        category: 'Data Visualization & BI',
        badge: 'Data Visualization & Business Intelligence',
        covers: 'Matplotlib • Seaborn • Excel • Power BI',
        isFlagship: 0,
        skills: ['Matplotlib Storytelling', 'Seaborn Statistical Plots', 'Excel Modeling', 'Power BI Interactive Dashboards', 'DAX Measures & KPIs']
      },
      {
        code: 'PRO',
        title: 'Professional Certificate in Data Analytics',
        category: 'Full-Stack Data Analytics Program',
        badge: 'Flagship Program',
        covers: 'Python • NumPy • Pandas • Visualization • Excel • Power BI • Projects',
        isFlagship: 1,
        skills: ['Full-Stack Data Analytics', 'Python & NumPy Engine', 'Pandas Data Wrangling', 'Matplotlib & Seaborn Visuals', 'Advanced Business Excel', 'Power BI Dashboards', 'Industrial Capstone Projects']
      }
    ];

    const targetDefs = moduleType === 'all' 
      ? allDefinitions 
      : allDefinitions.filter(d => d.code.toLowerCase() === moduleType.toLowerCase());

    // 3. Ensure student is enrolled in this course
    const enrollment = db.prepare(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?'
    ).get(student.id, courseId);

    if (!enrollment) {
      db.prepare(
        'INSERT OR IGNORE INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)'
      ).run(generateId('enr'), student.id, courseId);
    }

    const scoreNum = Number(overallScore) || 98;
    let certGrade = grade || 'Passed';
    if (!grade) {
      if (scoreNum >= 95) certGrade = 'Distinction';
      else if (scoreNum >= 85) certGrade = 'High Honors';
      else if (scoreNum >= 75) certGrade = 'Excellence';
    }

    const mentor = instructorName || 'Prof. MD Tahseen Equbal';
    const mentorTitle = instructorTitle || 'Lead Data Science Mentor & Founder, MEW Academy';

    const createdCertificates: any[] = [];

    for (const def of targetDefs) {
      // Check if already issued for this student & module
      const existing = db.prepare(
        'SELECT id, certificate_number FROM certificates WHERE user_id = ? AND (badge_title = ? OR category = ?)'
      ).get(student.id, def.badge, def.category) as any;

      if (existing) {
        continue; // already issued, skip
      }

      const certId = generateId('cert');
      const certNumber = generateCertificateNumber(def.code);
      const verificationHash = generateVerificationHash();

      db.prepare(`
        INSERT INTO certificates (
          id, certificate_number, user_id, course_id, course_title, category,
          instructor_name, instructor_title, grade, overall_score, skills_verified,
          verification_url, credential_id, verification_hash, badge_title, covers, is_flagship
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        certId,
        certNumber,
        student.id,
        courseId,
        def.title,
        def.category,
        mentor,
        mentorTitle,
        certGrade,
        scoreNum,
        JSON.stringify(def.skills),
        `https://mewacademy.com/verify/${certNumber}`,
        certNumber,
        verificationHash,
        def.badge,
        def.covers,
        def.isFlagship
      );

      createdCertificates.push({
        id: certId,
        certificateNumber: certNumber,
        recipientName: student.name,
        recipientEmail: student.email,
        courseId,
        courseTitle: def.title,
        category: def.category,
        instructorName: mentor,
        instructorTitle: mentorTitle,
        grade: certGrade,
        overallScore: scoreNum,
        skillsVerified: def.skills,
        verificationUrl: `https://mewacademy.com/verify/${certNumber}`,
        credentialId: certNumber,
        verificationHash,
        badgeTitle: def.badge,
        covers: def.covers,
        isFlagship: !!def.isFlagship,
        issuedAt: new Date().toISOString(),
      });
    }

    res.status(201).json({
      success: true,
      message: `3-in-1 Accredited Certificate Suite issued to ${student.name}!`,
      certificates: createdCertificates,
      certificate: createdCertificates[createdCertificates.length - 1] || null
    });
  } catch (error) {
    console.error('Admin issue certificate error:', error);
    res.status(500).json({ error: 'Internal server error while issuing certificate.' });
  }
});

/**
 * DELETE /api/certificates/bundle/:userId/:courseId
 * Revoke all certificates for a student & course
 */
router.delete('/bundle/:userId/:courseId', authenticate, authorize('admin'), (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;
    const db = getDatabase();

    db.prepare('DELETE FROM certificates WHERE user_id = ? AND course_id = ?').run(userId, courseId);

    res.json({
      success: true,
      message: 'All certificates for this course have been revoked.',
    });
  } catch (error) {
    console.error('Revoke bundle error:', error);
    res.status(500).json({ error: 'Internal server error while revoking certificates.' });
  }
});

/**
 * DELETE /api/certificates/:id
 * STRICT ADMIN RBAC: Only administrators can revoke an issued certificate.
 */
router.delete('/:id', authenticate, authorize('admin'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const existing = db.prepare(
      'SELECT id, certificate_number, user_id FROM certificates WHERE id = ? OR certificate_number = ?'
    ).get(id, id) as any;

    if (!existing) {
      res.status(404).json({ error: 'Certificate not found.' });
      return;
    }

    db.prepare('DELETE FROM certificates WHERE id = ?').run(existing.id);

    res.json({
      success: true,
      message: `Certificate #${existing.certificate_number} has been revoked successfully.`,
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    res.status(500).json({ error: 'Internal server error while revoking certificate.' });
  }
});

/**
 * GET /api/certificates/admin/students
 * STRICT ADMIN RBAC: Returns all enrolled students, their course purchases, and certificate issuance status.
 */
router.get('/admin/students', authenticate, authorize('admin'), (_req: Request, res: Response) => {
  try {
    const db = getDatabase();

    // 1. All registered students (EXCLUDING ADMINS)
    const students = db.prepare(`
      SELECT id, name, email, phone, role, avatar, created_at
      FROM users
      WHERE role != 'admin' AND email NOT IN ('muzammilahsan07@gmail.com', 'muzammilahsanahsan07@gmail.com', 'mewacademy.ac@gmail.com')
      ORDER BY created_at DESC
    `).all() as any[];

    // 2. All active course enrollments with payment info
    const enrollments = db.prepare(`
      SELECT e.id as enrollment_id, e.user_id, e.course_id, e.enrolled_at,
             t.order_id, t.amount, t.currency, t.status as payment_status
      FROM enrollments e
      LEFT JOIN transactions t ON t.user_id = e.user_id AND t.course_id = e.course_id
      ORDER BY e.enrolled_at DESC
    `).all() as any[];

    // 3. All issued certificates
    const certificates = db.prepare(`
      SELECT c.*, u.name as recipient_name, u.email as recipient_email
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.issued_at DESC
    `).all() as any[];

    res.json({
      success: true,
      students,
      enrollments: enrollments.map(e => ({
        id: e.enrollment_id,
        enrollment_id: e.enrollment_id,
        userId: e.user_id,
        user_id: e.user_id,
        courseId: e.course_id,
        course_id: e.course_id,
        enrolledAt: e.enrolled_at,
        enrolled_at: e.enrolled_at,
        orderId: e.order_id,
        amount: e.amount,
        currency: e.currency,
        paymentStatus: e.payment_status,
      })),
      certificates: certificates.map(c => {
        let skills: string[] = [];
        try {
          skills = JSON.parse(c.skills_verified || '[]');
        } catch {
          skills = ['Python', 'Exploratory Data Analysis', 'Pandas', 'NumPy', 'Data Visualization', 'Power BI'];
        }

        return {
          id: c.id,
          certificateNumber: c.certificate_number,
          certificate_number: c.certificate_number,
          userId: c.user_id,
          user_id: c.user_id,
          recipientName: c.recipient_name,
          recipient_name: c.recipient_name,
          recipientEmail: c.recipient_email,
          recipient_email: c.recipient_email,
          courseId: c.course_id,
          course_id: c.course_id,
          courseTitle: c.course_title,
          course_title: c.course_title,
          grade: c.grade,
          overallScore: c.overall_score,
          overall_score: c.overall_score,
          skillsVerified: skills,
          skills_verified: skills,
          badgeTitle: c.badge_title,
          badge_title: c.badge_title,
          covers: c.covers,
          isFlagship: !!c.is_flagship,
          is_flagship: !!c.is_flagship,
          issuedAt: c.issued_at,
          issued_at: c.issued_at,
          issueDate: c.issued_at ? new Date(c.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 2026',
          credentialId: c.credential_id,
          credential_id: c.credential_id,
          verificationUrl: c.verification_url,
          verification_url: c.verification_url,
          instructorName: c.instructor_name,
          instructorTitle: c.instructor_title,
        };
      })
    });
  } catch (error) {
    console.error('Admin students list error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/certificates/verify/:credentialId
 * Public certificate verification endpoint (accessible by anyone).
 */
router.get('/verify/:credentialId', (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;
    const db = getDatabase();

    const cert = db.prepare(`
      SELECT c.*, u.name as recipient_name, u.email as recipient_email 
      FROM certificates c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.credential_id = ? OR c.certificate_number = ?
    `).get(credentialId, credentialId) as any;

    if (!cert) {
      res.status(404).json({ success: false, error: 'Certificate not found. This credential ID may be invalid or revoked.' });
      return;
    }

    res.json({
      success: true,
      verified: true,
      certificate: {
        certificateNumber: cert.certificate_number,
        recipientName: cert.recipient_name,
        recipientEmail: cert.recipient_email,
        courseTitle: cert.course_title,
        category: cert.category,
        instructorName: cert.instructor_name,
        grade: cert.grade,
        overallScore: cert.overall_score,
        skillsVerified: JSON.parse(cert.skills_verified || '[]'),
        credentialId: cert.credential_id,
        verificationHash: cert.verification_hash,
        verificationUrl: cert.verification_url,
        issuedAt: cert.issued_at,
      },
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
