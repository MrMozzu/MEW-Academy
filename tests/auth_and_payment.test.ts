import { describe, it, expect, afterAll } from 'vitest';
import { hashPassword, comparePassword, generateResetToken } from '../server/utils/helpers.js';
import { getDatabase } from '../server/config/database.js';

describe('Unit Tests: Security & Payment URI', () => {
  it('Password hashing and comparison', async () => {
    const rawPassword = 'StudentSecret@123';
    const hashed = await hashPassword(rawPassword);
    
    expect(hashed).not.toBe(rawPassword);
    expect(hashed.startsWith('$2')).toBe(true);

    const isMatch = await comparePassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('WrongPassword@999', hashed);
    expect(isWrongMatch).toBe(false);
  });

  it('Cryptographic token generation', () => {
    const token = generateResetToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64);
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('NPCI UPI Deep Link and QR Parameters for ₹1599 Admission', () => {
    const upiId = '7070806047@ikwik';
    const payeeName = 'MEW Academy';
    const amount = 1599;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}.00&cu=INR&tn=${encodeURIComponent('MEW Academy Masterclass Admission')}`;

    expect(upiUrl.startsWith('upi://pay?')).toBe(true);
    
    // Parse query params
    const queryString = upiUrl.replace('upi://pay?', '');
    const params = new URLSearchParams(queryString);

    expect(params.get('pa')).toBe(upiId);
    expect(params.get('pn')).toBe(payeeName);
    expect(params.get('am')).toBe('1599.00');
    expect(params.get('cu')).toBe('INR');
    expect(params.get('tn')).toBe('MEW Academy Masterclass Admission');
  });
});
