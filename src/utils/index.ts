// =============================================================================
// Utility Functions
// Professor Bola Akanji - Economics, Trade & Development Research Website
// =============================================================================

import { cn } from '@/lib/utils';

// Re-export cn for convenience
export { cn };

/**
 * Format a date string into a human-readable format
 */
export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  } catch {
    return date;
  }
}

/**
 * Format a date as a short string (e.g., "Mar 15, 2025")
 */
export function formatShortDate(date: string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date range for events
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate) return '';

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!end || start.toDateString() === end.toDateString()) {
    return formatDate(startDate);
  }

  // Same month
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} - ${formatDate(endDate)}`;
  }

  // Different months
  return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, length: number = 150): string {
  if (!text) return '';
  if (text.length <= length) return text;

  // Try to find a natural break point (space, period)
  const truncated = text.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastPeriod = truncated.lastIndexOf('.');

  if (lastPeriod > length * 0.7) {
    return text.substring(0, lastPeriod + 1);
  }

  if (lastSpace > length * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Convert a string to a URL-safe slug
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random token for download links
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Get reading time estimate for text content
 */
export function getReadingTime(content: string): number {
  if (!content) return 0;

  const plainText = stripHtml(content);
  const wordsPerMinute = 200;
  const wordCount = plainText.split(/\s+/).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number | string): string {
  const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;

  if (isNaN(size) || size === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(size) / Math.log(k));

  return `${parseFloat((size / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Build a query string from an object of parameters
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Debounce function for search inputs etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get publication type label
 */
export function getPublicationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'journal-article': 'Journal Article',
    'book-chapter': 'Book Chapter',
    'working-paper': 'Working Paper',
    'policy-brief': 'Policy Brief',
    'conference-paper': 'Conference Paper',
    'report': 'Report',
  };
  return labels[type] || type;
}

/**
 * Get project status label
 */
export function getProjectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ongoing: 'Ongoing',
    completed: 'Completed',
    upcoming: 'Upcoming',
  };
  return labels[status] || status;
}

/**
 * Get event type label
 */
export function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    conference: 'Conference',
    workshop: 'Workshop',
    seminar: 'Seminar',
    lecture: 'Lecture',
    panel: 'Panel Discussion',
    webinar: 'Webinar',
  };
  return labels[type] || type;
}

/**
 * Get resource type label
 */
export function getResourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    dataset: 'Dataset',
    presentation: 'Presentation',
    report: 'Report',
    tool: 'Tool / Toolkit',
    infographic: 'Infographic',
    'policy-note': 'Policy Note',
  };
  return labels[type] || type;
}
