import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'mew_academy_fallback_secret';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`;
}

export function generateCertificateNumber(category: string = 'EDA'): string {
  const year = new Date().getFullYear();
  const code = (category || 'EDA').substring(0, 3).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MEW-${year}-${code}-${num}`;
}

export function generateVerificationHash(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateNumericOTP(digits: number = 6): string {
  let otp = '';
  for (let i = 0; i < digits; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}
