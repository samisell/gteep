// =============================================================================
// Encryption Utility - Token generation and verification for download links
// Uses Node.js crypto HMAC-SHA256 for secure, tamper-proof tokens
// =============================================================================

import * as crypto from 'crypto';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'bolaoakanji-download-secret-key-2025';

/**
 * Generate a download token
 * Token format: base64url(payload).hmacSha256Signature
 */
export function generateDownloadToken(leadId: string): string {
  const payload = {
    leadId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    iat: Date.now(),
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, 'utf-8').toString('base64url');
  const signature = createHmacSignature(payloadB64);

  return `${payloadB64}.${signature}`;
}

/**
 * Verify a download token and return the lead ID if valid
 * Returns null if the token is invalid or expired
 */
export function verifyDownloadToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, providedSignature] = parts;

    // Verify signature using constant-time comparison (prevents timing attacks)
    const expectedSignature = createHmacSignature(payloadB64);
    if (!crypto.timingSafeEqual(
      Buffer.from(providedSignature, 'utf-8'),
      Buffer.from(expectedSignature, 'utf-8')
    )) {
      return null;
    }

    // Decode payload
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    // Check expiration
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    // Check lead ID exists
    if (!payload.leadId) {
      return null;
    }

    return payload.leadId;
  } catch {
    return null;
  }
}

/**
 * Create an HMAC-SHA256 signature — cryptographically secure
 */
function createHmacSignature(data: string): string {
  return crypto
    .createHmac('sha256', ENCRYPTION_SECRET)
    .update(data)
    .digest('hex');
}

/**
 * Generate a simple verification code (for email verification, etc.)
 */
export function generateVerificationCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    code += digits[array[i] % digits.length];
  }
  return code;
}
