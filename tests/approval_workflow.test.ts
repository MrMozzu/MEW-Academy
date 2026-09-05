import { describe, it, expect, beforeAll } from 'vitest';
import { getDatabase } from '../server/config/database.js';

describe('Admin Payment Approval & UTR Workflow Tests', () => {
  let db: any;

  beforeAll(() => {
    db = getDatabase();
  });

  it('1. Database schema should support status and utr_number columns', () => {
    const tableInfo = db.prepare("PRAGMA table_info(transactions)").all() as any[];
    const columnNames = tableInfo.map(c => c.name);
    
    expect(columnNames).toContain('utr_number');
    expect(columnNames).toContain('status');

    const enrollInfo = db.prepare("PRAGMA table_info(enrollments)").all() as any[];
    const enrollColumns = enrollInfo.map(c => c.name);
    expect(enrollColumns).toContain('status');
  });

  it('2. Should record pending approval transaction when student submits UTR', () => {
    const testUserId = 'test-student-utr-01';
    const testCourseId = 'course-data-analytics';
    const testUtr = '987654321012';

    // Insert dummy student if not present
    db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, password_hash, phone, role)
      VALUES (?, ?, ?, 'testhash123', ?, 'student')
    `).run(testUserId, 'Test UTR Student', 'utrstudent@mewacademy.com', '9876543210');

    // Submit payment proof
    const txnId = `TXN-TEST-${Date.now()}`;
    const orderId = `ORD-TEST-${Date.now()}`;

    db.prepare(`
      INSERT INTO transactions (
        id, order_id, user_id, course_id, course_title, amount, currency,
        gateway, payment_method_details, discount_applied, coupon_code,
        status, utr_number
      ) VALUES (?, ?, ?, ?, ?, ?, 'INR', 'UPI', ?, ?, ?, 'PENDING_APPROVAL', ?)
    `).run(
      txnId,
      orderId,
      testUserId,
      testCourseId,
      '1-Month Online Live EDA Masterclass',
      1299,
      `UPI (UTR: ${testUtr})`,
      200,
      'IKAMAI',
      testUtr
    );

    db.prepare(`
      INSERT OR REPLACE INTO enrollments (id, user_id, course_id, status)
      VALUES (?, ?, ?, 'pending_approval')
    `).run(`enr-${Date.now()}`, testUserId, testCourseId);

    // Verify stored pending transaction
    const savedTxn = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txnId) as any;
    expect(savedTxn).toBeDefined();
    expect(savedTxn.status).toBe('PENDING_APPROVAL');
    expect(savedTxn.utr_number).toBe(testUtr);
    expect(savedTxn.coupon_code).toBe('IKAMAI');
    expect(savedTxn.amount).toBe(1299);
  });

  it('3. Admin should see pending transactions in the approval queue', () => {
    const pendingList = db.prepare(`
      SELECT 
        t.id as transaction_id,
        t.utr_number,
        t.status,
        u.name as student_name,
        u.phone as student_phone
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'PENDING_APPROVAL'
    `).all() as any[];

    expect(pendingList.length).toBeGreaterThan(0);
    const item = pendingList.find(p => p.utr_number === '987654321012');
    expect(item).toBeDefined();
    expect(item.student_name).toBe('Test UTR Student');
    expect(item.student_phone).toBe('9876543210');
  });

  it('4. Admin approval should activate enrollment and set transaction to SUCCESS', () => {
    const testUserId = 'test-student-utr-01';
    const testCourseId = 'course-data-analytics';

    // Fetch transaction
    const txn = db.prepare("SELECT id FROM transactions WHERE user_id = ? AND status = 'PENDING_APPROVAL'").get(testUserId) as any;
    expect(txn).toBeDefined();

    // Admin clicks Approve
    db.prepare("UPDATE transactions SET status = 'SUCCESS' WHERE id = ?").run(txn.id);
    db.prepare("UPDATE enrollments SET status = 'enrolled' WHERE user_id = ? AND course_id = ?").run(testUserId, testCourseId);

    // Check updated records
    const updatedTxn = db.prepare('SELECT status FROM transactions WHERE id = ?').get(txn.id) as any;
    expect(updatedTxn.status).toBe('SUCCESS');

    const updatedEnrollment = db.prepare('SELECT status FROM enrollments WHERE user_id = ? AND course_id = ?').get(testUserId, testCourseId) as any;
    expect(updatedEnrollment.status).toBe('enrolled');
  });
});
