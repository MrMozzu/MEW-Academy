import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getDatabase } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateId,
  generateResetToken,
  generateNumericOTP,
} from '../utils/helpers.js';
import { sendPasswordResetEmail, sendWelcomeEmail, sendVerificationOtpEmail } from '../services/emailService.js';

const router = Router();

const ADMIN_EMAILS = [
  'muzammilahsan07@gmail.com',
  'muzammilahsanahsan07@gmail.com',
  'mewacademy.ac@gmail.com'
];

/**
 * GET /api/auth/config
 * Expose client configuration like Google Client ID
 */
router.get('/config', (_req: Request, res: Response) => {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || '';
  res.json({
    googleClientId: clientId,
  });
});

/**
 * POST /api/auth/admin-login
 * Dedicated, strictly verified Admin authentication with password
 */
router.post('/admin-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Admin email and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      res.status(403).json({ error: 'Access Denied. Only muzammilahsan07@gmail.com is authorized to access the Admin Terminal.' });
      return;
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
    if (!user) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Incorrect administrator password.' });
      return;
    }

    if (user.role !== 'admin') {
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
      user.role = 'admin';
    }

    const token = generateToken({ userId: user.id, email: user.email, role: 'admin' });

    res.json({
      success: true,
      message: 'Admin access authorized.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin',
        avatar: user.avatar || '/student-avatar.png',
        headline: 'Academy Administrator',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error during admin authentication.' });
  }
});

/**
 * POST /api/auth/admin-change-password
 * Allows verified admin to update their password
 */
router.post('/admin-change-password', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const db = getDatabase();
    const hash = await hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.user!.userId);

    res.json({ success: true, message: 'Admin password updated successfully.' });
  } catch (error) {
    console.error('Admin change password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/register-send-otp
 * Step 1 of registration: Validates details, generates 6-digit verification OTP, and emails student
 */
router.post('/register-send-otp', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? String(phone).trim() : '';

    const db = getDatabase();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const otp = generateNumericOTP(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // Clear old pending registration verification for this email
    db.prepare('DELETE FROM email_verifications WHERE email = ?').run(cleanEmail);

    // Save pending verification
    db.prepare(`
      INSERT INTO email_verifications (email, otp_code, name, password_hash, phone, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(cleanEmail, otp, cleanName, passwordHash, cleanPhone, expiresAt);

    // Send verification email
    await sendVerificationOtpEmail(cleanEmail, otp, cleanName);

    res.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox or spam folder.`,
    });
  } catch (error) {
    console.error('Registration send-otp error:', error);
    res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
  }
});

/**
 * POST /api/auth/register-verify-otp
 * Step 2 of registration: Verifies 6-digit OTP, creates verified student account, and returns auth token
 */
router.post('/register-verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const db = getDatabase();

    // Verify OTP record
    const record = db.prepare(`
      SELECT * FROM email_verifications 
      WHERE email = ? AND otp_code = ? AND expires_at > datetime('now')
      ORDER BY id DESC LIMIT 1
    `).get(cleanEmail, cleanOtp) as any;

    if (!record) {
      res.status(400).json({ error: 'Invalid or expired 6-digit verification code. Please request a new code.' });
      return;
    }

    // Ensure user not created in parallel
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      db.prepare('DELETE FROM email_verifications WHERE email = ?').run(cleanEmail);
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const userId = generateId('usr');

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, role, avatar, headline)
      VALUES (?, ?, ?, ?, ?, 'student', '/student-avatar.png', 'Data Analytics Explorer')
    `).run(userId, record.name, record.email, record.password_hash, record.phone || '');

    // Remove used verification record
    db.prepare('DELETE FROM email_verifications WHERE email = ?').run(cleanEmail);

    const token = generateToken({ userId, email: record.email, role: 'student' });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(record.email, record.name).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Email verified and account created successfully!',
      token,
      user: {
        id: userId,
        name: record.name,
        email: record.email,
        phone: record.phone || '',
        role: 'student',
        avatar: '/student-avatar.png',
        headline: 'Data Analytics Explorer',
        streakDays: 1,
        totalHoursLearned: 0,
        xpPoints: 50,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Registration verify-otp error:', error);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

/**
 * POST /api/auth/register-resend-otp
 * Resend 6-digit OTP for pending registration
 */
router.post('/register-resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email address is required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDatabase();

    const record = db.prepare(`
      SELECT * FROM email_verifications 
      WHERE email = ? 
      ORDER BY id DESC LIMIT 1
    `).get(cleanEmail) as any;

    if (!record) {
      res.status(400).json({ error: 'No pending registration found for this email. Please re-enter your registration details.' });
      return;
    }

    const newOtp = generateNumericOTP(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    db.prepare('UPDATE email_verifications SET otp_code = ?, expires_at = ? WHERE id = ?').run(newOtp, expiresAt, record.id);

    await sendVerificationOtpEmail(cleanEmail, newOtp, record.name || 'Student');

    res.json({
      success: true,
      message: `A fresh 6-digit verification code has been sent to ${cleanEmail}.`,
    });
  } catch (error) {
    console.error('Resend registration OTP error:', error);
    res.status(500).json({ error: 'Failed to resend verification email.' });
  }
});

/**
 * POST /api/auth/register
 * Legacy direct registration endpoint (with phone support)
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const db = getDatabase();

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const userId = generateId('usr');
    const cleanPhone = phone ? String(phone).trim() : '';

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, role, avatar, headline)
      VALUES (?, ?, ?, ?, ?, 'student', '/student-avatar.png', 'Data Analytics Explorer')
    `).run(userId, name.trim(), email.trim().toLowerCase(), passwordHash, cleanPhone);

    const token = generateToken({ userId, email: email.trim().toLowerCase(), role: 'student' });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email.trim(), name.trim()).catch(() => { });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        role: 'student',
        avatar: '/student-avatar.png',
        headline: 'Data Analytics Explorer',
        streakDays: 1,
        totalHoursLearned: 0,
        xpPoints: 50,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Sign in with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const db = getDatabase();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) as any;
    if (!user) {
      res.status(401).json({ error: 'No account found with this email. Please register first.' });
      return;
    }

    const ADMIN_EMAILS = ['muzammilahsan07@gmail.com', 'mewacademy.ac@gmail.com'];
    if (ADMIN_EMAILS.includes(user.email.toLowerCase()) && user.role !== 'admin') {
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
      user.role = 'admin';
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Incorrect password. Please try again.' });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '/student-avatar.png',
        headline: user.headline || 'Data Analytics Explorer',
        streakDays: user.streak_days || 0,
        totalHoursLearned: user.total_hours_learned || 0,
        xpPoints: user.xp_points || 0,
        joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/auth/google
 * Authenticate or register with Google OAuth ID token
 */
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      res.status(400).json({ error: 'Google credential token or access token is required.' });
      return;
    }

    let payload: {
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      given_name?: string;
      picture?: string;
      sub?: string;
    } = {};

    if (credential) {
      // Verify ID token with Google's public tokeninfo endpoint
      const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (!googleResponse.ok) {
        const errData = await googleResponse.json().catch(() => ({}));
        res.status(401).json({ error: (errData as any).error_description || 'Invalid or expired Google ID token.' });
        return;
      }
      payload = (await googleResponse.json()) as any;
    } else if (accessToken) {
      // Verify access token with Google's userinfo endpoint
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!googleResponse.ok) {
        const errData = await googleResponse.json().catch(() => ({}));
        res.status(401).json({ error: (errData as any).error_description || 'Invalid or expired Google access token.' });
        return;
      }
      payload = (await googleResponse.json()) as any;
    }

    if (!payload.email) {
      res.status(400).json({ error: 'Google account has no associated email.' });
      return;
    }

    const email = payload.email.trim().toLowerCase();
    const name = (payload.name || payload.given_name || email.split('@')[0]).trim();
    const avatar = payload.picture || '';
    const googleId = payload.sub || '';

    const db = getDatabase();

    // Check if user already exists with this email
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    const ADMIN_EMAILS = ['muzammilahsan07@gmail.com', 'mewacademy.ac@gmail.com'];
    const initialRole = ADMIN_EMAILS.includes(email) ? 'admin' : 'student';

    if (!user) {
      // Create new user with Google profile
      const userId = generateId('usr');
      const randomPassword = crypto.randomUUID();
      const passwordHash = await hashPassword(randomPassword);

      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role, avatar, headline, google_id, auth_provider)
        VALUES (?, ?, ?, ?, ?, ?, 'Data Analytics Explorer', ?, 'google')
      `).run(userId, name, email, passwordHash, initialRole, avatar, googleId);

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, name).catch(() => { });

      user = {
        id: userId,
        name,
        email,
        role: initialRole,
        avatar,
        headline: 'Data Analytics Explorer',
        streak_days: 1,
        total_hours_learned: 0,
        xp_points: 50,
        created_at: new Date().toISOString(),
      };
    } else {
      // Existing user: ensure admin role if email matches
      if (ADMIN_EMAILS.includes(email) && user.role !== 'admin') {
        db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
        user.role = 'admin';
      }
      // Existing user: update avatar if empty or attach google_id
      if ((!user.avatar && avatar) || !user.google_id) {
        db.prepare(`
          UPDATE users 
          SET avatar = CASE WHEN avatar IS NULL OR avatar = '' THEN ? ELSE avatar END, 
              google_id = CASE WHEN google_id IS NULL OR google_id = '' THEN ? ELSE google_id END,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(avatar, googleId, user.id);
        if (!user.avatar && avatar) user.avatar = avatar;
      }
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Signed in with Google successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || avatar || '/student-avatar.png',
        headline: user.headline || 'Data Analytics Explorer',
        streakDays: user.streak_days || 1,
        totalHoursLearned: user.total_hours_learned || 0,
        xpPoints: user.xp_points || 50,
        joinedDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google. Please try again.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Generate reset token and send email
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email address is required.' });
      return;
    }

    const db = getDatabase();

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id, name FROM users WHERE LOWER(email) = ?').get(cleanEmail) as any;
    if (!user) {
      res.status(404).json({ error: 'No account registered with this email address. Please check your email or sign up.' });
      return;
    }

    // Generate token and 6-digit verification code with 1 hour expiry
    const resetToken = generateResetToken();
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Invalidate any previous reset tokens for this email
    db.prepare('UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0').run(cleanEmail);

    // Store both token and 6-digit code
    db.prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)').run(
      cleanEmail,
      resetToken,
      expiresAt
    );
    db.prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)').run(
      cleanEmail,
      resetCode,
      expiresAt
    );

    // Send email with both code and direct link
    let emailSent = false;
    try {
      emailSent = await sendPasswordResetEmail(cleanEmail, resetToken, resetCode, user.name);
    } catch (e) {
      console.warn('SMTP sending error, allowing fallback code:', e);
    }

    res.json({
      success: true,
      message: emailSent
        ? 'Recovery code sent to your email. Check your inbox.'
        : 'Password recovery initiated. Use your 6-digit code or link.',
      email: cleanEmail
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Set new password using reset token or 6-digit verification code
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      res.status(400).json({ error: 'Email, recovery code/token, and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();
    const db = getDatabase();

    const nowIso = new Date().toISOString();

    // Find valid reset token or 6-digit code
    const resetRecord = db.prepare(
      'SELECT * FROM password_resets WHERE email = ? AND token = ? AND used = 0 AND expires_at > ?'
    ).get(cleanEmail, cleanToken, nowIso) as any;

    if (!resetRecord) {
      res.status(400).json({ error: 'Invalid or expired recovery code. Please request a new code.' });
      return;
    }

    // Hash new password and update user
    const passwordHash = await hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?').run(
      passwordHash,
      nowIso,
      cleanEmail
    );

    // Mark all tokens for this email as used
    db.prepare('UPDATE password_resets SET used = 1 WHERE email = ?').run(cleanEmail);

    const updatedUser = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
    const authToken = generateToken({ userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role });

    res.json({
      success: true,
      message: 'Password updated successfully! You are now logged in.',
      token: authToken,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || '/student-avatar.png',
        headline: updatedUser.headline || 'Data Analytics Explorer',
        streakDays: updatedUser.streak_days || 0,
        totalHoursLearned: updatedUser.total_hours_learned || 0,
        xpPoints: updatedUser.xp_points || 0,
        joinedDate: new Date(updatedUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      }
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.', details: error?.message || String(error) });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires auth)
 */
router.get('/me', authenticate, (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.userId) as any;

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const ADMIN_EMAILS = ['muzammilahsan07@gmail.com', 'mewacademy.ac@gmail.com'];
    if (ADMIN_EMAILS.includes(user.email.toLowerCase()) && user.role !== 'admin') {
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
      user.role = 'admin';
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '/student-avatar.png',
        headline: user.headline || '',
        streakDays: user.streak_days || 0,
        totalHoursLearned: user.total_hours_learned || 0,
        xpPoints: user.xp_points || 0,
        joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
