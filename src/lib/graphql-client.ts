// =============================================================================
// GraphQL Client - Server-side fetch wrapper for WordPress GraphQL API
//
// Features:
// - Caches WordPress availability status to avoid repeated failed requests
// - Falls back gracefully when WordPress is unreachable
// - Supports ISR revalidation and auth tokens
// =============================================================================

import type { GraphQLResponse } from '@/types';

const WORDPRESS_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || 'https://gteep.jileadtrust.com/graphql';

const WP_AUTH_USER = process.env.WORDPRESS_AUTH_USER || '';
const WP_AUTH_PASS = process.env.WORDPRESS_AUTH_PASS || '';

// Cache for auth token to avoid re-authenticating on every request
let authToken: string | null = null;
let authTokenExpiry = 0;

// WordPress availability cache
// - null = not checked yet
// - true = WordPress is reachable
// - false = WordPress is unreachable
let wpAvailable: boolean | null = null;
let wpAvailableCheckTime = 0;
const WP_AVAILABILITY_CACHE_TTL = 30 * 1000; // Re-check every 30 seconds (quick recovery when WP comes back)

/**
 * Check if WordPress backend is available, using a cached result
 */
async function checkWordPressAvailability(): Promise<boolean> {
  // Return cached result if still within TTL
  if (wpAvailable !== null && Date.now() - wpAvailableCheckTime < WP_AVAILABILITY_CACHE_TTL) {
    return wpAvailable;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

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

    if (!response.ok) {
      wpAvailable = false;
      wpAvailableCheckTime = Date.now();
      return false;
    }

    const json: GraphQLResponse = await response.json();
    const available = !json.errors && !!json.data?.generalSettings;
    wpAvailable = available;
    wpAvailableCheckTime = Date.now();
    return available;
  } catch {
    wpAvailable = false;
    wpAvailableCheckTime = Date.now();
    return false;
  }
}

/**
 * Authenticate with WordPress and retrieve a JWT token
 */
async function getAuthToken(): Promise<string | null> {
  // Return cached token if still valid (tokens typically last 300-600 seconds)
  if (authToken && Date.now() < authTokenExpiry) {
    return authToken;
  }

  if (!WP_AUTH_USER || !WP_AUTH_PASS) {
    return null;
  }

  try {
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
    });

    const json: GraphQLResponse = await response.json();

    if (json.errors || !json.data?.login?.authToken) {
      console.warn('[GraphQL] Auth failed:', json.errors?.[0]?.message);
      return null;
    }

    authToken = json.data.login.authToken;
    // Cache for 5 minutes
    authTokenExpiry = Date.now() + 5 * 60 * 1000;

    return authToken;
  } catch (error) {
    console.warn('[GraphQL] Auth error:', error);
    return null;
  }
}

/**
 * Core GraphQL fetch function with error handling, caching, and auth support.
 *
 * Uses Next.js fetch with ISR revalidation by default.
 * Falls back gracefully if WordPress is unreachable.
 * Caches WordPress unavailability to avoid repeated failed requests.
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
    revalidate = 0, // Always fetch fresh data from WP on every page load
    tags = [],
    auth = false,
  } = options || {};

  // Skip the request entirely if WordPress is known to be unavailable
  const available = await checkWordPressAvailability();
  if (!available) {
    // Return a mock error response so fetchers fall back to mock data
    // Use a single silent log instead of per-request errors
    return {
      errors: [
        {
          message: 'WordPress backend is currently unavailable. Using fallback data.',
        },
      ],
    };
  }

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
    const response = await fetch(WORDPRESS_GRAPHQL_URL, fetchOptions);

    if (!response.ok) {
      // Mark WordPress as unavailable so subsequent requests skip the network call
      wpAvailable = false;
      wpAvailableCheckTime = Date.now();

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
      console.warn(
        '[GraphQL] Query warnings:',
        json.errors.map((e) => e.message).join('; ')
      );
    }

    return json;
  } catch (error) {
    // Mark WordPress as unavailable so subsequent requests skip the network call
    wpAvailable = false;
    wpAvailableCheckTime = Date.now();

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
  return checkWordPressAvailability();
}

/**
 * Force a re-check of WordPress availability (useful after config changes)
 */
export function resetWordPressAvailability(): void {
  wpAvailable = null;
  wpAvailableCheckTime = 0;
}
