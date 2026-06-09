// =============================================================================
// GraphQL Data Fetchers - WordPress Headless CMS
// Professor Bola Akanji - Economics, Trade & Development Research Website
//
// These fetchers use the GraphQL client and fall back to mock data when
// WordPress is unreachable. This ensures the site always renders content.
// =============================================================================

import { fetchGraphQL } from '@/lib/graphql-client';
import {
  GET_PAGES,
  GET_PAGE_BY_SLUG,
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_PUBLICATIONS,
  GET_PUBLICATION_BY_SLUG,
  GET_PROJECTS,
  GET_PROJECT_BY_SLUG,
  GET_EVENTS,
  GET_EVENT_BY_SLUG,
  GET_RESOURCES,
  GET_RESOURCE_BY_SLUG,
  GET_MEDIA_ITEMS,
  GET_PARTNERS,
  GET_TESTIMONIALS,
  GET_SITE_SETTINGS,
  GET_MENUS,
  GET_SOCIAL_LINKS,
  SEARCH_QUERY,
} from './queries';

import type {
  WPPage,
  WPPost,
  WPPublication,
  WPProject,
  WPEvent,
  WPResource,
  WPMedia,
  WPPartner,
  WPTestimonial,
  WPSiteSettings,
  WPSocialLinks,
  WPMenu,
  WPPageInfo,
  WPSearchData,
  WPPageData,
  WPPostData,
  WPPublicationData,
  WPProjectData,
  WPEventData,
  WPResourceData,
  WPPagesData,
  WPPostsData,
  WPPublicationsData,
  WPProjectsData,
  WPEventsData,
  WPResourcesData,
  WPMediaData,
  WPPartnersData,
  WPTestimonialsData,
  WPSiteSettingsData,
  WPMenusData,
  WPSocialLinksData,
} from '@/types';

// Import mock data as fallback
import {
  mockPages,
  mockPosts,
  mockPublications,
  mockProjects,
  mockEvents,
  mockResources,
  mockMediaItems,
  mockPartners,
  mockTestimonials,
  mockSiteSettings,
  mockMenus,
  mockSocialLinks,
} from './mock-data';

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

  if (result?.nodes && Array.isArray(result.nodes)) {
    return result.nodes as T[];
  }

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
    pages: extractNodes<WPPage>(response, 'pages', mockPages),
    pageInfo: extractPageInfo(response, 'pages'),
  };
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const response = await fetchGraphQL<WPPageData>(GET_PAGE_BY_SLUG, { slug });

  const page = extractSingleNode<WPPage>(response, 'page', null);

  if (!page) {
    // Try to find in mock data
    return mockPages.find((p) => p.slug === slug) || null;
  }

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
    posts: extractNodes<WPPost>(response, 'posts', mockPosts),
    pageInfo: extractPageInfo(response, 'posts'),
  };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const response = await fetchGraphQL<WPPostData>(GET_POST_BY_SLUG, { slug });

  const post = extractSingleNode<WPPost>(response, 'post', null);

  if (!post) {
    return mockPosts.find((p) => p.slug === slug) || null;
  }

  return post;
}

// -----------------------------------------------------------------------------
// Publications
// -----------------------------------------------------------------------------

export async function getPublications(
  first: number = 20,
  after?: string
): Promise<{ publications: WPPublication[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPPublicationsData>(GET_PUBLICATIONS, {
    first,
    after,
  });

  return {
    publications: extractNodes<WPPublication>(
      response,
      'publications',
      mockPublications
    ),
    pageInfo: extractPageInfo(response, 'publications'),
  };
}

export async function getPublicationBySlug(
  slug: string
): Promise<WPPublication | null> {
  const response = await fetchGraphQL<WPPublicationData>(
    GET_PUBLICATION_BY_SLUG,
    { slug }
  );

  const publication = extractSingleNode<WPPublication>(
    response,
    'publication',
    null
  );

  if (!publication) {
    return mockPublications.find((p) => p.slug === slug) || null;
  }

  return publication;
}

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------

export async function getProjects(
  first: number = 20,
  after?: string
): Promise<{ projects: WPProject[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPProjectsData>(GET_PROJECTS, {
    first,
    after,
  });

  return {
    projects: extractNodes<WPProject>(response, 'projects', mockProjects),
    pageInfo: extractPageInfo(response, 'projects'),
  };
}

export async function getProjectBySlug(slug: string): Promise<WPProject | null> {
  const response = await fetchGraphQL<WPProjectData>(GET_PROJECT_BY_SLUG, {
    slug,
  });

  const project = extractSingleNode<WPProject>(response, 'project', null);

  if (!project) {
    return mockProjects.find((p) => p.slug === slug) || null;
  }

  return project;
}

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

export async function getEvents(
  first: number = 20,
  after?: string
): Promise<{ events: WPEvent[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPEventsData>(GET_EVENTS, {
    first,
    after,
  });

  return {
    events: extractNodes<WPEvent>(response, 'events', mockEvents),
    pageInfo: extractPageInfo(response, 'events'),
  };
}

export async function getEventBySlug(slug: string): Promise<WPEvent | null> {
  const response = await fetchGraphQL<WPEventData>(GET_EVENT_BY_SLUG, {
    slug,
  });

  const event = extractSingleNode<WPEvent>(response, 'event', null);

  if (!event) {
    return mockEvents.find((e) => e.slug === slug) || null;
  }

  return event;
}

// -----------------------------------------------------------------------------
// Resources
// -----------------------------------------------------------------------------

export async function getResources(
  first: number = 20,
  after?: string
): Promise<{ resources: WPResource[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPResourcesData>(GET_RESOURCES, {
    first,
    after,
  });

  return {
    resources: extractNodes<WPResource>(response, 'resources', mockResources),
    pageInfo: extractPageInfo(response, 'resources'),
  };
}

export async function getResourceBySlug(
  slug: string
): Promise<WPResource | null> {
  const response = await fetchGraphQL<WPResourceData>(GET_RESOURCE_BY_SLUG, {
    slug,
  });

  const resource = extractSingleNode<WPResource>(response, 'resource', null);

  if (!resource) {
    return mockResources.find((r) => r.slug === slug) || null;
  }

  return resource;
}

// -----------------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------------

export async function getMediaItems(
  first: number = 20,
  after?: string
): Promise<{ mediaItems: WPMedia[]; pageInfo: WPPageInfo | null }> {
  const response = await fetchGraphQL<WPMediaData>(GET_MEDIA_ITEMS, {
    first,
    after,
  });

  return {
    mediaItems: extractNodes<WPMedia>(response, 'mediaItems', mockMediaItems),
    pageInfo: extractPageInfo(response, 'mediaItems'),
  };
}

// -----------------------------------------------------------------------------
// Partners
// -----------------------------------------------------------------------------

export async function getPartners(): Promise<WPPartner[]> {
  const response = await fetchGraphQL<WPPartnersData>(GET_PARTNERS);

  return extractNodes<WPPartner>(response, 'partners', mockPartners);
}

// -----------------------------------------------------------------------------
// Testimonials
// -----------------------------------------------------------------------------

export async function getTestimonials(): Promise<WPTestimonial[]> {
  const response = await fetchGraphQL<WPTestimonialsData>(GET_TESTIMONIALS);

  return extractNodes<WPTestimonial>(
    response,
    'testimonials',
    mockTestimonials
  );
}

// -----------------------------------------------------------------------------
// Site Settings
// -----------------------------------------------------------------------------

export async function getSiteSettings(): Promise<WPSiteSettings> {
  const response = await fetchGraphQL<WPSiteSettingsData>(GET_SITE_SETTINGS);

  if (response.errors || !response.data) {
    return mockSiteSettings;
  }

  const { generalSettings, acfOptions } = response.data;

  if (!generalSettings) {
    return mockSiteSettings;
  }

  return {
    siteTitle: generalSettings.title || mockSiteSettings.siteTitle,
    siteDescription: generalSettings.description || mockSiteSettings.siteDescription,
    siteUrl: generalSettings.url || mockSiteSettings.siteUrl,
    siteLogo: mockSiteSettings.siteLogo,
    favicon: mockSiteSettings.favicon,
    acfOptions: acfOptions?.siteSettings || mockSiteSettings.acfOptions,
  };
}

// -----------------------------------------------------------------------------
// Menus
// -----------------------------------------------------------------------------

export async function getMenus(): Promise<WPMenu[]> {
  const response = await fetchGraphQL<WPMenusData>(GET_MENUS);

  if (response.errors || !response.data?.menus?.nodes) {
    return mockMenus;
  }

  return response.data.menus.nodes;
}

// -----------------------------------------------------------------------------
// Social Links
// -----------------------------------------------------------------------------

export async function getSocialLinks(): Promise<WPSocialLinks> {
  const response = await fetchGraphQL<WPSocialLinksData>(GET_SOCIAL_LINKS);

  if (response.errors || !response.data?.acfOptions?.socialLinks) {
    return mockSocialLinks;
  }

  return response.data.acfOptions.socialLinks;
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
    // Search mock data as fallback
    const term = searchTerm.toLowerCase();
    return {
      posts: {
        nodes: mockPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.excerpt.toLowerCase().includes(term)
        ),
      },
      pages: {
        nodes: mockPages.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.excerpt.toLowerCase().includes(term)
        ),
      },
      publications: {
        nodes: mockPublications.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            (p.excerpt && p.excerpt.toLowerCase().includes(term))
        ) as any,
      },
      projects: {
        nodes: mockProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.excerpt.toLowerCase().includes(term)
        ) as any,
      },
      events: {
        nodes: mockEvents.filter(
          (e) =>
            e.title.toLowerCase().includes(term) ||
            e.excerpt.toLowerCase().includes(term)
        ) as any,
      },
    };
  }

  return response.data;
}
