// =============================================================================
// Rate Limiter - Simple in-memory rate limiting
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry>;
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60 * 1000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;

    // Clean up expired entries every 10 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }
  }

  /**
   * Check if a request is allowed under the rate limit.
   * Returns true if allowed, false if rate-limited.
   */
  check(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    // No entry or expired window - allow and start fresh
    if (!entry || now >= entry.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // Within window and under limit - allow
    if (entry.count < this.maxAttempts) {
      entry.count += 1;
      return true;
    }

    // Over limit - deny
    return false;
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry || Date.now() >= entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.count);
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  getResetTime(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry || Date.now() >= entry.resetTime) {
      return 0;
    }
    return entry.resetTime - Date.now();
  }

  /**
   * Reset the rate limit for a specific key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now >= entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Pre-configured rate limiters for different use cases
export const rateLimiter = new RateLimiter(5, 60 * 1000); // 5 requests per minute
export const contactFormLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 submissions per hour
export const downloadLimiter = new RateLimiter(10, 60 * 60 * 1000); // 10 downloads per hour
export const newsletterLimiter = new RateLimiter(2, 60 * 60 * 1000); // 2 signups per hour
export const searchLimiter = new RateLimiter(30, 60 * 1000); // 30 searches per minute

export { RateLimiter };
