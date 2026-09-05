import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateId } from '../utils/helpers.js';
import { sendAdmissionApprovedEmail } from '../services/emailService.js';

const router = Router();

/**
 * POST /api/enroll/submit-payment
 * Submit student payment proof (UTR) for admission verification
 */
router.post('/submit-payment', authenticate, (req: Request, res: Response) => {
  try {
    const { 
      courseId, 
      courseTitle, 
      amount, 
      utrNumber, 
      couponCode, 
      discountAmount,
      paymentMethodDetails 
    } = req.body;

    const userId = req.user!.userId;

    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required.' });
      return;
    }

    if (!utrNumber || utrNumber.trim().length < 6) {
      res.status(400).json({ error: 'A valid 12-digit UPI Transaction ID is required.' });
      return;
    }

    const cleanUtr = utrNumber.trim();
    const db = getDatabase();

    // Check if user already has an active enrollment
    const existingEnrollment = db.prepare(
      'SELECT id, status FROM enrollments WHERE user_id = ? AND course_id = ?'
    ).get(userId, courseId) as any;

    if (existingEnrollment && existingEnrollment.status === 'enrolled') {
      res.status(409).json({ error: 'You are already enrolled in this course.' });
      return;
    }

    const orderId = `ORD-MEW-${Math.floor(100000 + Math.random() * 900000)}`;
    const txnId = `TXN-${Date.now().toString().slice(-6)}`;

    // 1. Record transaction in database
    db.prepare(`
      INSERT INTO transactions (
        id, order_id, user_id, course_id, course_title, amount, currency,
        gateway, payment_method_details, discount_applied, coupon_code,
        status, utr_number
      ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'UPI', ?, ?, ?, 'PENDING_APPROVAL', ?)
    `).run(
      txnId,
      orderId,
      userId,
      courseId,
      courseTitle || '1-Month Online Live EDA Masterclass',
      amount || 1599,
      paymentMethodDetails || `UPI (Transaction ID: ${cleanUtr})`,
      discountAmount || 0,
      couponCode || null,
      cleanUtr
    );

    // 2. Insert or update enrollment with 'pending_approval'
    if (existingEnrollment) {
      db.prepare("UPDATE enrollments SET status = 'pending_approval', enrolled_at = datetime('now') WHERE id = ?").run(existingEnrollment.id);
    } else {
      const enrollmentId = generateId('enr');
      db.prepare(
        "INSERT INTO enrollments (id, user_id, course_id, status) VALUES (?, ?, ?, 'pending_approval')"
      ).run(enrollmentId, userId, courseId);
    }

    res.status(201).json({
      success: true,
      status: 'PENDING_APPROVAL',
      message: 'Payment details submitted successfully. Verification in progress.',
      transaction: {
        id: txnId,
        orderId,
        courseId,
        courseTitle,
        amount,
        utrNumber: cleanUtr,
        status: 'PENDING_APPROVAL',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ error: 'Internal server error while submitting payment.' });
  }
});

/**
 * GET /api/enroll/admin/pending-payments
 * List all pending payment submissions for Admin approval
 */
router.get('/admin/pending-payments', authenticate, authorize('admin'), (req: Request, res: Response) => {
  try {
    const db = getDatabase();

    const pending = db.prepare(`
      SELECT 
        t.id as transaction_id,
        t.order_id,
        t.user_id,
        t.course_id,
        t.course_title,
        t.amount,
        t.currency,
        t.utr_number,
        t.coupon_code,
        t.payment_method_details,
        t.created_at,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        u.avatar as student_avatar
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'PENDING_APPROVAL'
      ORDER BY t.created_at DESC
    `).all() as any[];

    res.json({
      success: true,
      pendingPayments: pending.map(p => ({
        transactionId: p.transaction_id,
        orderId: p.order_id,
        userId: p.user_id,
        courseId: p.course_id,
        courseTitle: p.course_title,
        amount: p.amount,
        currency: p.currency,
        utrNumber: p.utr_number || '',
        couponCode: p.coupon_code || '',
        studentName: p.student_name,
        studentEmail: p.student_email,
        studentPhone: p.student_phone || '',
        studentAvatar: p.student_avatar || '',
        createdAt: p.created_at,
      })),
    });
  } catch (error) {
    console.error('Get pending payments error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/enroll/admin/approve
 * Admin approves payment: activates enrollment & sends WhatsApp Batch Group email
 */
router.post('/admin/approve', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { transactionId, userId, courseId } = req.body;

    if (!transactionId || !userId || !courseId) {
      res.status(400).json({ error: 'Transaction ID, User ID, and Course ID are required.' });
      return;
    }

    const db = getDatabase();

    // 1. Update Transaction to SUCCESS
    const txn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(transactionId) as any;
    db.prepare("UPDATE transactions SET status = 'SUCCESS' WHERE id = ?").run(transactionId);

    // 2. Update or Insert Enrollment to 'enrolled'
    const existingEnrollment = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId) as any;
    if (existingEnrollment) {
      db.prepare("UPDATE enrollments SET status = 'enrolled' WHERE id = ?").run(existingEnrollment.id);
    } else {
      const enrollmentId = generateId('enr');
      db.prepare("INSERT INTO enrollments (id, user_id, course_id, status) VALUES (?, ?, ?, 'enrolled')").run(enrollmentId, userId, courseId);
    }

    // 3. Fetch Student details for email
    const student = db.prepare('SELECT name, email, phone FROM users WHERE id = ?').get(userId) as any;

    if (student?.email) {
      // Non-blocking email dispatch with WhatsApp Batch Group invite
      sendAdmissionApprovedEmail(
        student.email,
        student.name || 'Student',
        txn?.course_title || '1-Month Online Live EDA Masterclass',
        txn?.amount || 1599,
        txn?.utr_number || ''
      ).catch(() => {});
    }

    res.json({
      success: true,
      message: `Admission approved for ${student?.name || 'student'}. Enrollment is active!`,
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ error: 'Internal server error during approval.' });
  }
});

/**
 * POST /api/enroll/admin/reject
 * Admin rejects invalid/unpaid payment request
 */
router.post('/admin/reject', authenticate, authorize('admin'), (req: Request, res: Response) => {
  try {
    const { transactionId, userId, courseId } = req.body;

    if (!transactionId) {
      res.status(400).json({ error: 'Transaction ID is required.' });
      return;
    }

    const db = getDatabase();

    db.prepare("UPDATE transactions SET status = 'REJECTED' WHERE id = ?").run(transactionId);
    if (userId && courseId) {
      db.prepare("UPDATE enrollments SET status = 'rejected' WHERE user_id = ? AND course_id = ?").run(userId, courseId);
    }

    res.json({
      success: true,
      message: 'Payment request rejected.',
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/enroll
 * Direct auto-enroll fallback
 */
router.post('/', authenticate, (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user!.userId;

    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required.' });
      return;
    }

    const db = getDatabase();

    const existing = db.prepare('SELECT id, status FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId) as any;
    if (existing && existing.status === 'enrolled') {
      res.status(409).json({ error: 'You are already enrolled in this course.' });
      return;
    }

    if (existing) {
      db.prepare("UPDATE enrollments SET status = 'enrolled' WHERE id = ?").run(existing.id);
    } else {
      const enrollmentId = generateId('enr');
      db.prepare("INSERT INTO enrollments (id, user_id, course_id, status) VALUES (?, ?, ?, 'enrolled')").run(enrollmentId, userId, courseId);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled!',
      enrollment: {
        courseId,
        status: 'enrolled',
        enrolledAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/enroll/my-courses
 * Get list of enrolled courses and pending statuses for current user
 */
router.get('/my-courses', authenticate, (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const userId = req.user!.userId;

    const enrollments = db.prepare(
      "SELECT course_id, enrolled_at, COALESCE(status, 'enrolled') as status FROM enrollments WHERE user_id = ? ORDER BY enrolled_at DESC"
    ).all(userId) as any[];

    res.json({
      success: true,
      enrollments: enrollments.map(e => ({
        courseId: e.course_id,
        status: e.status,
        enrolledAt: e.enrolled_at,
      })),
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * DELETE /api/enroll/:courseId
 * Unenroll from a course
 */
router.delete('/:courseId', authenticate, (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.userId;
    const db = getDatabase();

    db.prepare('DELETE FROM enrollments WHERE user_id = ? AND course_id = ?').run(userId, courseId);

    res.json({ success: true, message: 'Unenrolled successfully.' });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
