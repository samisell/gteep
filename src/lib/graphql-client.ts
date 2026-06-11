// =============================================================================
// GraphQL Client - Server-side fetch wrapper for WordPress GraphQL API
//
// Optimized for Vercel serverless:
// - No module-level availability caching (doesn't work in serverless)
// - Each request tries WordPress directly and falls back on failure
// - Longer timeouts for cold starts
// - Graceful fallback to mock data when WP is unreachable
// =============================================================================

import type { GraphQLResponse } from '@/types';

const WORDPRESS_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || 'https://gteep.jileadtrust.com/graphql';

const WP_AUTH_USER = process.env.WORDPRESS_AUTH_USER || '';
const WP_AUTH_PASS = process.env.WORDPRESS_AUTH_PASS || '';

// Cache for auth token to avoid re-authenticating on every request
let authToken: string | null = null;
let authTokenExpiry = 0;

/**
 * Authenticate with WordPress and retrieve a JWT token
 */
async function getAuthToken(): Promise<string | null> {
  // Return cached token if still valid
  if (authToken && Date.now() < authTokenExpiry) {
    return authToken;
  }

  if (!WP_AUTH_USER || !WP_AUTH_PASS) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation LoginUser($username: String!, $password: String!) {
            login(input: { username: $username, password: $password }) {
              authToken
            }
          }
        `,
        variables: { username: WP_AUTH_USER, password: WP_AUTH_PASS },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json: GraphQLResponse = await response.json();

    if (json.errors || !json.data?.login?.authToken) {
      return null;
    }

    authToken = json.data.login.authToken;
    authTokenExpiry = Date.now() + 5 * 60 * 1000;

    return authToken;
  } catch {
    return null;
  }
}

/**
 * Core GraphQL fetch function with error handling and auth support.
 *
 * Each request tries WordPress directly. If the request fails,
 * fetchers will fall back to mock data.
 * No availability caching — serverless functions can't rely on
 * module-level state across invocations.
 */
export async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    revalidate?: number | false;
    tags?: string[];
    auth?: boolean;
  }
): Promise<GraphQLResponse<T>> {
  const {
    revalidate = 0,
    tags = [],
    auth = false,
  } = options || {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Attach auth token if requested
  if (auth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  // Configure Next.js caching / ISR
  if (revalidate !== false) {
    fetchOptions.next = {
      revalidate,
      ...(tags.length > 0 ? { tags } : {}),
    };
  }

  try {
    // 15-second timeout for Vercel serverless (cold starts can be slow)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        errors: [
          {
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        ],
      };
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors && json.errors.length > 0) {
      // Log only non-critical warnings (e.g., missing custom post types)
      const criticalErrors = json.errors.filter(
        (e) => !e.message.includes('Cannot query field')
      );
      if (criticalErrors.length > 0) {
        console.warn(
          '[GraphQL] Errors:',
          criticalErrors.map((e) => e.message).join('; ')
        );
      }
    }

    return json;
  } catch (error) {
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : 'Unknown fetch error',
        },
      ],
    };
  }
}

/**
 * Check if the WordPress backend is reachable
 */
export async function isWordPressConnected(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ generalSettings { title } }`,
      }),
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const json: GraphQLResponse = await response.json();
    return !json.errors && !!json.data?.generalSettings;
  } catch {
    return false;
  }
}

/**
 * No-op: kept for backward compatibility
 */
export function resetWordPressAvailability(): void {
  // No-op: availability caching removed for serverless compatibility
}
