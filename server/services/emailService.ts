import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials not set in .env. Email services running in simulated mode.');
      return false;
    }
    await transporter.verify();
    console.log('✅ SMTP Email Transporter connected successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ SMTP Email connection check notice (emails will fallback smoothly):', error);
    return false;
  }
}

/**
 * Send password reset email with 1-Click Link and 6-Digit OTP
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  resetOtp: string,
  userName: string = 'Student'
): Promise<boolean> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl.replace(/\/+$/, '')}/?reset_token=${resetToken}&email=${encodeURIComponent(to)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:540px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#d9822b,#f5a623);padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
            MEW Academy
          </h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.95);font-size:14px;font-weight:600;">
            Password Reset Request
          </p>
        </div>

        <!-- Body -->
        <div style="padding:36px 28px;text-align:center;">
          <p style="font-size:17px;color:#1e293b;margin:0 0 14px;font-weight:700;">
            Hello ${userName},
          </p>
          <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 28px;">
            We received a request to reset the password for your MEW Academy account (<strong>${to}</strong>). Click the button below to set your new password:
          </p>

          <!-- Primary 1-Click Action Button -->
          <div style="margin:0 0 32px;">
            <a href="${resetLink}" 
               style="display:inline-block;background:linear-gradient(135deg,#d9822b,#f5a623);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:800;letter-spacing:0.5px;box-shadow:0 6px 20px rgba(217,130,43,0.35);">
              🔐 Click Here to Reset Your Password
            </a>
          </div>

          <!-- Divider -->
          <div style="display:flex;align-items:center;margin:28px 0;">
            <div style="flex:1;border-top:1px solid #e2e8f0;"></div>
            <span style="padding:0 12px;color:#94a3b8;font-size:12px;text-transform:uppercase;font-weight:700;">Or use 6-digit OTP code</span>
            <div style="flex:1;border-top:1px solid #e2e8f0;"></div>
          </div>

          <!-- 6-Digit OTP Box -->
          <div style="background:#fff8ee;border:2px dashed #d9822b;border-radius:16px;padding:20px 16px;margin:0 auto 24px;max-width:320px;">
            <div style="font-size:11px;color:#854d0e;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
              Your 6-Digit OTP
            </div>
            <div style="font-size:36px;font-family:'Courier New',Courier,monospace;font-weight:900;letter-spacing:8px;color:#d9822b;padding-left:8px;">
              ${resetOtp}
            </div>
            <div style="font-size:11px;color:#a16207;margin-top:8px;font-weight:600;">
              ⏳ Valid for 1 hour
            </div>
          </div>

          <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0 0 16px;">
            If the button doesn't open, copy and paste this link into your browser:<br/>
            <a href="${resetLink}" style="color:#d9822b;word-break:break-all;">${resetLink}</a>
          </p>

          <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0;">
            If you did not request this, please disregard this message. Your account remains secure.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
            © ${new Date().getFullYear()} MEW Academy · Bhopal, India<br/>
            Need assistance? Email <a href="mailto:mewacademy.ac@gmail.com" style="color:#d9822b;text-decoration:none;font-weight:600;">mewacademy.ac@gmail.com</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"MEW Academy" <${process.env.SMTP_USER}>`,
      to,
      subject: `🔐 Reset Your MEW Academy Password (OTP: ${resetOtp})`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send reset email:', error);
    return false;
  }
}

/**
 * Send 6-Digit Email Verification OTP upon student registration
 */
export async function sendVerificationOtpEmail(to: string, otp: string, userName: string = 'Student'): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:540px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#d9822b,#f5a623);padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
            MEW Academy
          </h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.95);font-size:14px;font-weight:600;">
            Verify Your Email Address
          </p>
        </div>

        <!-- Body -->
        <div style="padding:36px 28px;text-align:center;">
          <p style="font-size:17px;color:#1e293b;margin:0 0 14px;font-weight:700;">
            Hello ${userName},
          </p>
          <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 24px;">
            Thank you for creating an account with <strong>MEW Academy</strong>. Please use the following 6-digit verification code to complete your registration:
          </p>

          <!-- 6-Digit OTP Box -->
          <div style="background:#fff8ee;border:2px dashed #d9822b;border-radius:16px;padding:22px 16px;margin:0 auto 24px;max-width:320px;">
            <div style="font-size:11px;color:#854d0e;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
              Your Verification Code
            </div>
            <div style="font-size:38px;font-family:'Courier New',Courier,monospace;font-weight:900;letter-spacing:8px;color:#d9822b;padding-left:8px;">
              ${otp}
            </div>
            <div style="font-size:11px;color:#a16207;margin-top:8px;font-weight:600;">
              ⏳ Code expires in 15 minutes
            </div>
          </div>

          <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0 0 12px;">
            Enter this code in the verification screen to activate your student account.
          </p>

          <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0;">
            If you did not initiate this registration, please ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
            © ${new Date().getFullYear()} MEW Academy · Bhopal, India<br/>
            Questions? Contact <a href="mailto:mewacademy.ac@gmail.com" style="color:#d9822b;text-decoration:none;font-weight:600;">mewacademy.ac@gmail.com</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"MEW Academy" <${process.env.SMTP_USER}>`,
      to,
      subject: `🛡️ MEW Academy Registration Code: ${otp}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

/**
 * Send a welcome email to a new student
 */
export async function sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 30px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#d9822b,#f5a623);padding:30px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">MEW Academy</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.95);font-size:13px;font-weight:600;">Welcome to our Learning Community!</p>
        </div>
        <div style="padding:32px 26px;">
          <p style="font-size:16px;color:#1e293b;margin:0 0 12px;font-weight:700;">Welcome, ${userName}!</p>
          <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
            Thank you for joining MEW Academy. You can now explore live masterclass admissions, track your progress, and earn accredited certificates.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"MEW Academy" <${process.env.SMTP_USER}>`,
      to,
      subject: '🎉 Welcome to MEW Academy!',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send admission approval confirmation with WhatsApp Group invite
 */
export async function sendAdmissionApprovedEmail(
  to: string,
  userName: string,
  courseTitle: string,
  amount: number,
  utrNumber: string,
  whatsappGroupLink: string = process.env.WHATSAPP_BATCH_GROUP_LINK || 'https://chat.whatsapp.com/EDIc8xNvYD37djUfdcxPZI'
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:540px;margin:30px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.25);border:1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#d9822b 100%);padding:36px 24px;text-align:center;">
          <h1 style="margin:0;color:#f5a623;font-size:26px;font-weight:900;letter-spacing:0.5px;">MEW ACADEMY</h1>
          <p style="margin:6px 0 0;color:#ffffff;font-size:14px;font-weight:700;">Live Masterclass Admission Confirmed</p>
        </div>

        <div style="padding:32px 28px;">
          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;padding:16px;text-align:center;margin-bottom:24px;">
            <span style="font-size:24px;">🎉</span>
            <h2 style="margin:6px 0 2px;color:#065f46;font-size:18px;font-weight:800;">Payment Verified &amp; Admission Active!</h2>
            <p style="margin:0;color:#047857;font-size:13px;">Welcome aboard, ${userName}!</p>
          </div>

          <!-- Admission Details Table -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr>
                <td style="padding:6px 0;color:#64748b;font-weight:600;">Course:</td>
                <td style="padding:6px 0;color:#0f172a;font-weight:700;text-align:right;">${courseTitle}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#64748b;font-weight:600;">Amount Verified:</td>
                <td style="padding:6px 0;color:#d9822b;font-weight:800;text-align:right;">₹${amount.toLocaleString('en-IN')}</td>
              </tr>
              ${utrNumber ? `
              <tr>
                <td style="padding:6px 0;color:#64748b;font-weight:600;">UPI Transaction ID:</td>
                <td style="padding:6px 0;color:#0f172a;font-family:monospace;font-weight:700;text-align:right;">${utrNumber}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding:6px 0;color:#64748b;font-weight:600;">Format:</td>
                <td style="padding:6px 0;color:#0f172a;font-weight:700;text-align:right;">Live Online Masterclass</td>
              </tr>
            </table>
          </div>

          <!-- WhatsApp Batch Group CTA -->
          <div style="background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);border-radius:16px;padding:24px;text-align:center;color:#ffffff;margin-bottom:24px;">
            <h3 style="margin:0 0 8px;font-size:17px;font-weight:800;color:#ffffff;">💬 Join Your Official WhatsApp Batch Group</h3>
            <p style="margin:0 0 16px;font-size:12px;color:rgba(255,255,255,0.95);line-height:1.5;">
              All live Zoom / Google Meet classroom links, class schedules, doubt sessions, and assignments are provided inside this group.
            </p>
            <a href="${whatsappGroupLink}" target="_blank" style="display:inline-block;background:#ffffff;color:#075e54;font-size:14px;font-weight:800;padding:12px 28px;border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,0.15);">
              👉 Tap to Join WhatsApp Batch Group
            </a>
          </div>

          <p style="font-size:12px;color:#64748b;text-align:center;margin:0;">
            Need help? Contact Team MEW Academy at <a href="mailto:mewacademy.ac@gmail.com" style="color:#d9822b;font-weight:600;">mewacademy.ac@gmail.com</a> or WhatsApp <a href="https://wa.me/917070806047" style="color:#25d366;font-weight:700;">+91 7070806047</a>.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"MEW Academy" <${process.env.SMTP_USER}>`,
      to,
      subject: `🎉 Admission Approved: ${courseTitle} | Join WhatsApp Batch Group`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send admission approval email:', error);
    return false;
  }
}

