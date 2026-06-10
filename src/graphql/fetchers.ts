// =============================================================================
// GraphQL Data Fetchers - WordPress Headless CMS
// GTEEP - Gilead Trust Economic Empowerment Project
//
// These fetchers use the GraphQL client and fall back to mock data when
// WordPress is unreachable or returns empty data. This ensures the site
// always renders content.
// =============================================================================

import { fetchGraphQL } from '@/lib/graphql-client';
import {
  GET_PAGES,
  GET_PAGE_BY_SLUG,
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_MEDIA_ITEMS,
  GET_SITE_SETTINGS,
  GET_MENUS,
  SEARCH_QUERY,
} from './queries';

import type {
  WPPage,
  WPPost,
  WPMedia,
  WPSiteSettings,
  WPMenu,
  WPPageInfo,
  WPSearchData,
  WPPageData,
  WPPostData,
  WPPagesData,
  WPPostsData,
  WPMediaData,
  WPSiteSettingsData,
  WPMenusData,
} from '@/types';

// Import mock data as fallback
import {
  mockSiteSettings,
  mockActivities,
  mockPhilosophy,
  mockTeamMembers,
  mockOutputs,
  mockPartners,
  mockBlogPosts,
  mockMenus,
  mockSocialLinks,
} from './mock-data';

// Re-export mock data for direct use by pages
export {
  mockSiteSettings,
  mockActivities,
  mockPhilosophy,
  mockTeamMembers,
  mockOutputs,
  mockPartners,
  mockBlogPosts,
  mockSocialLinks,
};

// -----------------------------------------------------------------------------
// Helper: Extract nodes from a GraphQL response, falling back to mock data
// -----------------------------------------------------------------------------

function extractNodes<T>(
  response: { data?: any; errors?: any[] },
  path: string,
  mockFallback: T[]
): T[] {
  if (response.errors || !response.data) {
    return mockFallback;
  }

  const parts = path.split('.');
  let result: any = response.data;
  for (const part of parts) {
    if (result?.[part] === undefined) return mockFallback;
    result = result[part];
  }

  if (result?.nodes && Array.isArray(result.nodes) && result.nodes.length > 0) {
    return result.nodes as T[];
  }

  // If WP returned empty nodes, use mock data
  return mockFallback;
}

function extractSingleNode<T>(
  response: { data?: any; errors?: any[] },
  key: string,
  mockFallback: T | null
): T | null {
  if (response.errors || !response.data) {
    return mockFallback;
  }

  const node = response.data[key];
  if (!node) return mockFallback;

  return node as T;
}

function extractPageInfo(
  response: { data?: any; errors?: any[] },
  path: string
): WPPageInfo | null {
  if (response.errors || !response.data) return null;

  const parts = path.split('.');
  let result: any = response.data;
  for (const part of parts) {
    if (result?.[part] === undefined) return null;
    result = result[part];
  }

  return result?.pageInfo ?? null;
}

// -----------------------------------------------------------------------------
// Pages
// -----------------------------------------------------------------------------

export async function getPages(
  first: number = 50,
  after?: string
): Promise<{ pages: WPPage[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPPagesData>(GET_PAGES, {
    first,
    after,
  });

  return {
    pages: extractNodes<WPPage>(response, 'pages', []),
    pageInfo: extractPageInfo(response, 'pages'),
  };
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const response = await fetchGraphQL<WPPageData>(GET_PAGE_BY_SLUG, { slug });

  const page = extractSingleNode<WPPage>(response, 'page', null);

  return page;
}

// -----------------------------------------------------------------------------
// Posts (Blog / News)
// -----------------------------------------------------------------------------

export async function getPosts(
  first: number = 12,
  after?: string
): Promise<{ posts: WPPost[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPPostsData>(GET_POSTS, {
    first,
    after,
  });

  return {
    posts: extractNodes<WPPost>(response, 'posts', []),
    pageInfo: extractPageInfo(response, 'posts'),
  };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const response = await fetchGraphQL<WPPostData>(GET_POST_BY_SLUG, { slug });

  const post = extractSingleNode<WPPost>(response, 'post', null);

  return post;
}

// -----------------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------------

export async function getMediaItems(
  first: number = 50,
  after?: string
): Promise<{ mediaItems: WPMedia[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPMediaData>(GET_MEDIA_ITEMS, {
    first,
    after,
  });

  return {
    mediaItems: extractNodes<WPMedia>(response, 'mediaItems', []),
    pageInfo: extractPageInfo(response, 'mediaItems'),
  };
}

// -----------------------------------------------------------------------------
// Site Settings & Logo
// -----------------------------------------------------------------------------

/**
 * Fetch the site logo URL from WordPress.
 * WP stores the site icon in the REST API root as `site_icon` (media item ID).
 * We fetch it via GraphQL mediaItems, looking for the "cropped-refined_logo" file
 * which is the site icon set in WP Customizer.
 * Falls back to null if not found.
 */
export async function getSiteLogo(): Promise<string | null> {
  try {
    const response = await fetchGraphQL<any>(`
      query GetSiteLogo {
        mediaItems(first: 10, where: { search: "cropped-refined_logo" }) {
          nodes {
            id
            sourceUrl
            altText
            title
          }
        }
      }
    `);

    if (response.errors || !response.data?.mediaItems?.nodes?.length) {
      // Fallback: try fetching the known site icon by databaseId
      const fallbackResponse = await fetchGraphQL<any>(`
        query GetSiteIcon {
          mediaItem(id: "8", idType: DATABASE_ID) {
            sourceUrl
            altText
          }
        }
      `);

      if (fallbackResponse.errors || !fallbackResponse.data?.mediaItem?.sourceUrl) {
        return null;
      }

      return fallbackResponse.data.mediaItem.sourceUrl;
    }

    // Find the cropped logo
    const logo = response.data.mediaItems.nodes.find(
      (node: any) => node.title?.includes('cropped-refined_logo') || node.sourceUrl?.includes('cropped-refined_logo')
    );

    return logo?.sourceUrl || response.data.mediaItems.nodes[0]?.sourceUrl || null;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<WPSiteSettings> {
  const response = await fetchGraphQL<WPSiteSettingsData>(GET_SITE_SETTINGS);

  if (response.errors || !response.data) {
    return mockSiteSettings;
  }

  const { generalSettings } = response.data;

  if (!generalSettings) {
    return mockSiteSettings;
  }

  // Try to fetch the site logo from WP
  const logoUrl = await getSiteLogo();

  // Merge WP general settings with mock data for ACF fields
  return {
    siteTitle: generalSettings.title || mockSiteSettings.siteTitle,
    siteDescription: generalSettings.description || mockSiteSettings.siteDescription,
    siteUrl: generalSettings.url || mockSiteSettings.siteUrl,
    siteLogo: logoUrl
      ? {
          sourceUrl: logoUrl,
          altText: 'GTEEP Logo',
          mediaItemId: 8,
          width: 512,
          height: 512,
        }
      : mockSiteSettings.siteLogo,
    favicon: logoUrl
      ? {
          sourceUrl: logoUrl,
          altText: 'GTEEP Favicon',
          mediaItemId: 8,
          width: 512,
          height: 512,
        }
      : mockSiteSettings.favicon,
    acfOptions: mockSiteSettings.acfOptions,
  };
}

// -----------------------------------------------------------------------------
// Menus
// -----------------------------------------------------------------------------

export async function getMenus(): Promise<WPMenu[]> {
  const response = await fetchGraphQL<WPMenusData>(GET_MENUS);

  if (response.errors || !response.data?.menus?.nodes?.length) {
    return mockMenus;
  }

  return response.data.menus.nodes;
}

// -----------------------------------------------------------------------------
// GTEEP-Specific Data Fetchers
// These use WP pages to populate GTEEP-specific data types, with mock fallbacks
// -----------------------------------------------------------------------------

/**
 * Get activities (What We Do) data.
 * Currently returns mock data as WP doesn't have custom post types for activities.
 * When WP content becomes available, this will map WP pages to GTEEPActivity types.
 */
export async function getActivities() {
  // Try to get "What We Do" page content from WP
  try {
    const page = await getPageBySlug('what-we-do');
    if (page?.content) {
      // If WP has content, we could parse it. For now, use mock data.
      // In the future, this could parse Gutenberg blocks or HTML content.
    }
  } catch {
    // Fall through to mock data
  }

  return mockActivities;
}

/**
 * Get philosophy data.
 * Currently returns mock data.
 */
export async function getPhilosophy() {
  try {
    const page = await getPageBySlug('our-philosophy');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to mock data
  }

  return mockPhilosophy;
}

/**
 * Get team members data.
 * Currently returns mock data.
 */
export async function getTeamMembers() {
  try {
    const page = await getPageBySlug('about-us');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to mock data
  }

  return mockTeamMembers;
}

/**
 * Get outputs data.
 * Currently returns mock data.
 */
export async function getOutputs() {
  try {
    const page = await getPageBySlug('our-outputs');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to mock data
  }

  return mockOutputs;
}

/**
 * Get partners data.
 * Currently returns mock data.
 */
export async function getPartners() {
  try {
    const page = await getPageBySlug('our-partners');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to mock data
  }

  return mockPartners;
}

/**
 * Get blog posts data.
 * Tries WP posts first, falls back to mock data.
 */
export async function getBlogPosts() {
  const { posts } = await getPosts(12);

  // If WP has real blog posts, map them to GTEEPBlogPost format
  if (posts.length > 0) {
    return posts.map((post): import('@/types').GTEEPBlogPost => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      date: post.date,
      author: post.author?.name || 'GTEEP Team',
      image: post.featuredImage?.node?.sourceUrl || undefined,
      categories: post.categories?.nodes?.map(c => c.name) || [],
    }));
  }

  // Fall back to mock data
  return mockBlogPosts;
}

// -----------------------------------------------------------------------------
// Search
// -----------------------------------------------------------------------------

export async function searchContent(
  searchTerm: string,
  first: number = 10
): Promise<WPSearchData | null> {
  const response = await fetchGraphQL<WPSearchData>(SEARCH_QUERY, {
    search: searchTerm,
    first,
  });

  if (response.errors || !response.data) {
    return null;
  }

  return response.data;
}
