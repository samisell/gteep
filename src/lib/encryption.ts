// =============================================================================
// Encryption Utility - Token generation and verification for download links
// =============================================================================

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'bolaoakanji-download-secret-key-2025';

/**
 * Simple base64 encoding with a signature for tamper detection.
 * Not cryptographically secure, but sufficient for download token purposes.
 * For production, consider using jose or jsonwebtoken libraries.
 */

/**
 * Generate a download token for a lead ID
 * Token format: base64(payload).hmacSignature
 */
export function generateDownloadToken(leadId: string): string {
  const payload = {
    leadId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    iat: Date.now(),
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, 'utf-8').toString('base64url');
  const signature = createSignature(payloadB64);

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

    // Verify signature
    const expectedSignature = createSignature(payloadB64);
    if (providedSignature !== expectedSignature) {
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
 * Create a simple HMAC-like signature using the encryption secret
 */
function createSignature(data: string): string {
  // Simple signature using repeated XOR and substitution
  // For production, use Node.js crypto.createHmac
  let hash = '';
  const secretChars = ENCRYPTION_SECRET.split('');

  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ secretChars[i % secretChars.length].charCodeAt(0);
    hash += charCode.toString(16).padStart(2, '0');
  }

  // Take first 64 characters for a consistent length
  return hash.substring(0, 64);
}

/**
 * Generate a simple verification code (for email verification, etc.)
 */
export function generateVerificationCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';

  // Use crypto if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      code += digits[array[i] % digits.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
  }

  return code;
}
