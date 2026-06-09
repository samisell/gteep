// =============================================================================
// GraphQL Client - Server-side fetch wrapper for WordPress GraphQL API
// =============================================================================

import type { GraphQLResponse } from '@/types';

const WORDPRESS_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || 'https://bolaoakanji.net/graphql';

const WP_AUTH_USER = process.env.WORDPRESS_AUTH_USER || '';
const WP_AUTH_PASS = process.env.WORDPRESS_AUTH_PASS || '';

// Cache for auth token to avoid re-authenticating on every request
let authToken: string | null = null;
let authTokenExpiry = 0;

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
    revalidate = 60,
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
    const response = await fetch(WORDPRESS_GRAPHQL_URL, fetchOptions);

    if (!response.ok) {
      console.error(
        `[GraphQL] HTTP ${response.status}: ${response.statusText}`
      );
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
      console.error(
        '[GraphQL] Query errors:',
        json.errors.map((e) => e.message).join('; ')
      );
    }

    return json;
  } catch (error) {
    console.error('[GraphQL] Fetch error:', error);
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
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ generalSettings { title } }`,
      }),
      next: { revalidate: 0 },
    });

    if (!response.ok) return false;

    const json: GraphQLResponse = await response.json();
    return !json.errors && !!json.data?.generalSettings;
  } catch {
    return false;
  }
}
