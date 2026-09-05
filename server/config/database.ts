import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = process.env.DATABASE_PATH || './mew_academy.db';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(path.resolve(DB_PATH));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student' CHECK(role IN ('student', 'instructor', 'admin')),
      avatar TEXT DEFAULT '',
      headline TEXT DEFAULT '',
      streak_days INTEGER DEFAULT 0,
      total_hours_learned REAL DEFAULT 0,
      xp_points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      quiz_score REAL DEFAULT NULL,
      completed_at TEXT DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, course_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      certificate_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      course_title TEXT NOT NULL,
      category TEXT DEFAULT '',
      instructor_name TEXT DEFAULT '',
      instructor_title TEXT DEFAULT '',
      grade TEXT DEFAULT 'Passed' CHECK(grade IN ('Distinction', 'High Honors', 'Excellence', 'Passed')),
      overall_score REAL DEFAULT 0,
      skills_verified TEXT DEFAULT '[]',
      verification_url TEXT DEFAULT '',
      credential_id TEXT UNIQUE NOT NULL,
      verification_hash TEXT DEFAULT '',
      badge_title TEXT DEFAULT '',
      covers TEXT DEFAULT '',
      is_flagship INTEGER DEFAULT 0,
      issued_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      course_title TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      gateway TEXT NOT NULL,
      payment_method_details TEXT DEFAULT '',
      discount_applied REAL DEFAULT 0,
      coupon_code TEXT DEFAULT NULL,
      status TEXT DEFAULT 'PENDING',
      utr_number TEXT DEFAULT '',
      receipt_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT DEFAULT '',
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
    CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
    CREATE INDEX IF NOT EXISTS idx_certificates_credential ON certificates(credential_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);
    CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
    CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
  `);

  // Safe migrations for OAuth & Payment Approvals
  try {
    db.prepare("ALTER TABLE users ADD COLUMN google_id TEXT").run();
  } catch {
    // Column already exists
  }

  try {
    db.prepare("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'email'").run();
  } catch {
    // Column already exists
  }

  try {
    db.prepare("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''").run();
  } catch {
    // Column already exists
  }

  try {
    db.prepare("ALTER TABLE enrollments ADD COLUMN status TEXT DEFAULT 'enrolled'").run();
  } catch {
    // Column already exists
  }

  try {
    db.prepare("ALTER TABLE transactions ADD COLUMN utr_number TEXT DEFAULT ''").run();
  } catch {
    // Column already exists
  }

  // Ensure transactions table constraint migration
  try {
    const tableSql = (db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='transactions'").get() as any)?.sql || '';
    if (tableSql.includes("CHECK(status IN ('SUCCESS', 'FAILED', 'PENDING'))")) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS transactions_temp (
          id TEXT PRIMARY KEY,
          order_id TEXT UNIQUE NOT NULL,
          user_id TEXT NOT NULL,
          course_id TEXT NOT NULL,
          course_title TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT DEFAULT 'INR',
          gateway TEXT NOT NULL,
          payment_method_details TEXT DEFAULT '',
          discount_applied REAL DEFAULT 0,
          coupon_code TEXT DEFAULT NULL,
          status TEXT DEFAULT 'PENDING',
          utr_number TEXT DEFAULT '',
          receipt_url TEXT DEFAULT '',
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        INSERT OR IGNORE INTO transactions_temp SELECT id, order_id, user_id, course_id, course_title, amount, currency, gateway, payment_method_details, discount_applied, coupon_code, status, COALESCE(utr_number, ''), receipt_url, created_at FROM transactions;
        DROP TABLE transactions;
        ALTER TABLE transactions_temp RENAME TO transactions;
        CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      `);
    }
  } catch {
    // Migrated or non-blocking
  }

  try {
    db.prepare("UPDATE users SET role = 'admin' WHERE email IN ('muzammilahsan07@gmail.com', 'mewacademy.ac@gmail.com')").run();
  } catch {
    // Column or table not ready yet
  }

  console.log('✅ Database schema initialized');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}
