// =============================================================================
// GraphQL Data Fetchers - WordPress Headless CMS
// GTEEP - Gilead Trust Economic Empowerment Project
//
// These fetchers use the GraphQL client to fetch data from WordPress.
// When WordPress is unreachable, they return empty/null data and pages
// show a "Check your internet" OfflinePage component.
//
// No mock data fallback — all content comes from WordPress.
// =============================================================================

import { fetchGraphQL, isWordPressConnected } from '@/lib/graphql-client';
import {
  GET_PAGES,
  GET_PAGE_BY_SLUG,
  GET_WHAT_WE_DO_PAGE,
  GET_ACTIVITY_PAGE,
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_MEDIA_ITEMS,
  GET_SITE_SETTINGS,
  GET_ADMIN_EMAIL,
  GET_MENUS,
  GET_TEAM_MEMBERS,
  GET_TEAM_MEMBERS_ACF,
  SEARCH_QUERY,
  GET_PUBLICATIONS,
  GET_PUBLICATION_BY_SLUG,
  GET_PROJECTS,
  GET_PROJECT_BY_SLUG,
  GET_EVENTS,
  GET_EVENT_BY_SLUG,
  GET_RESOURCES,
  GET_RESOURCE_BY_SLUG,
  GET_VIDEO_GALLERY,
  GET_OUTPUT_DOWNLOADABLES,
  GET_FOLLOW_THE_MONEY_FILES,
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
  GTEEPTeamMember,
  GTEEPOutput,
  YouTubeVideo,
  FollowTheMoneyFiles,
  WPPublication,
  WPProject,
  WPEvent,
  WPResource,
  WPPublicationsData,
  WPProjectsData,
  WPEventsData,
  WPResourcesData,
  WPPublicationData,
  WPProjectData,
  WPEventData,
  WPResourceData,
} from '@/types';

// Re-export WordPress connectivity check for pages to use
export { isWordPressConnected };

// -----------------------------------------------------------------------------
// Helper: Extract nodes from a GraphQL response
// -----------------------------------------------------------------------------

function extractNodes<T>(
  response: { data?: any; errors?: any[] },
  path: string
): T[] {
  if (response.errors || !response.data) {
    return [];
  }

  const parts = path.split('.');
  let result: any = response.data;
  for (const part of parts) {
    if (result?.[part] === undefined) return [];
    result = result[part];
  }

  if (result?.nodes && Array.isArray(result.nodes) && result.nodes.length > 0) {
    return result.nodes as T[];
  }

  return [];
}

function extractSingleNode<T>(
  response: { data?: any; errors?: any[] },
  key: string
): T | null {
  if (response.errors || !response.data) {
    return null;
  }

  const node = response.data[key];
  if (!node) return null;

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
// Default site settings (minimal, used when WP is unreachable)
// -----------------------------------------------------------------------------

const defaultSiteSettings: WPSiteSettings = {
  siteTitle: 'GTEEP',
  siteDescription: 'Gender, Trade, Economics and Empowerment Programme',
  siteUrl: 'https://backend.gileadtrust.com',
  siteLogo: null,
  favicon: null,
  acfOptions: {
    heroTitle: 'GTEEP',
    heroSubtitle: 'Gender, Trade, Economics and Empowerment Programme',
    heroCtaText: 'Learn More',
    heroCtaUrl: '/about',
    contactEmail: 'info@gteep.gileadtrust.com',
    contactPhone: '',
    contactAddress: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
    },
  },
};

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
    pages: extractNodes<WPPage>(response, 'pages'),
    pageInfo: extractPageInfo(response, 'pages'),
  };
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const response = await fetchGraphQL<WPPageData>(GET_PAGE_BY_SLUG, { slug });

  const page = extractSingleNode<WPPage>(response, 'page');

  return page;
}

// -----------------------------------------------------------------------------
// About Page
// Fetches the About Us page from WordPress.
//
// The "about summary" shown on the About Us page is sourced from the
// WordPress page editor (page.content) — i.e. what the site admin edits in
// the standard WordPress block editor. This is the canonical source of
// truth so that edits to the About Us page in WordPress are reflected on
// the site immediately.
//
// The ACF `aboutContent.aboutSummary` field is kept as a fallback only,
// for backwards compatibility when the page editor content is empty.
// Vision / Mission / Goal still come from the ACF `aboutContent` group.
// -----------------------------------------------------------------------------

/**
 * Convert WordPress `page.content` HTML into plain-text paragraphs joined
 * by "\n\n" so the existing rendering logic (which splits on "\n\n") keeps
 * working unchanged. Only <p>...</p> blocks are extracted; empty paragraphs
 * are skipped. Common HTML entities are decoded to their plain-text form.
 */
function htmlContentToParagraphs(html: string | undefined | null): string {
  if (!html) return '';
  const paragraphs: string[] = [];
  const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '') // strip inner HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;|&apos;|&rsquo;|&#8217;/g, "'")
      .replace(/&lsquo;|&#8216;/g, "'")
      .replace(/&ldquo;|&#8220;/g, '"')
      .replace(/&rdquo;|&#8221;/g, '"')
      .replace(/&ndash;|&#8211;/g, '-')
      .replace(/&mdash;|&#8212;/g, '—')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) paragraphs.push(text);
  }
  return paragraphs.join('\n\n');
}

export interface AboutPageData {
  aboutSummary: string;
  aboutVision: string;
  aboutMission: string;
  aboutGoal: string;
}

export async function getAboutPage(): Promise<AboutPageData> {
  const defaults: AboutPageData = {
    aboutSummary:
      "Africa's economic transformation and the challenges and opportunities lie in the ability to learn, relearn and unlearn. This process is both integrative and intentional and be socially inclusive. GTEEP aims to curate and supply the required evidence and knowledge to support this process. Gender, Trade, Economics and Empowerment Programme (GTEEP) is an initiative of the Gilead Trust for Economic Empowerment. It is a knowledge, research and policy advocacy initiative that places people at the centre of economic policy and development. GTEEP's activities and one small successful bite at a time, contribute to creating spaces that promote more participatory and equitable access to resources and opportunities.",
    aboutVision:
      'A socially and culturally inclusive economy where everyone is heard.',
    aboutMission:
      'To continually knowledge spaces and inform policies with data-driven evidence and empower the citizens with requisite tools to reshape their individual and collective economic choices.',
    aboutGoal:
      'To promote spaces that create more participatory and equitable access to resources and opportunities.',
  };

  try {
    const page = await getPageBySlug('about-us');

    if (page) {
      // Primary source: WordPress page editor content (page.content)
      const pageContent = htmlContentToParagraphs(page.content);

      // Fallback source: ACF aboutContent.aboutSummary (legacy)
      const acfSummary = page.aboutContent?.aboutSummary || '';

      return {
        aboutSummary: pageContent || acfSummary || defaults.aboutSummary,
        aboutVision: page.aboutContent?.aboutVision || defaults.aboutVision,
        aboutMission:
          page.aboutContent?.aboutMission || defaults.aboutMission,
        aboutGoal: page.aboutContent?.aboutGoal || defaults.aboutGoal,
      };
    }
  } catch {
    // Fall through to defaults
  }

  return defaults;
}

// -----------------------------------------------------------------------------
// Contact Details (fetches ACF contactdetails fields from WP)
// -----------------------------------------------------------------------------

export interface ContactDetailsData {
  email: string;
  phone: string;
  address: string;
}

export async function getContactDetails(): Promise<ContactDetailsData> {
  const defaults: ContactDetailsData = {
    email: 'info@gteep.gileadtrust.com',
    phone: '+234 801 234 5678',
    address: 'Ikeja Lagos, Nigeria',
  };

  try {
    const page = await getPageBySlug('contact-us');

    if (page?.contactdetails) {
      const cd = page.contactdetails;
      return {
        email: cd.email || defaults.email,
        phone: cd.phoneNumber ? `+${cd.phoneNumber}` : defaults.phone,
        address: cd.address || defaults.address,
      };
    }
  } catch {
    // Fall through to defaults
  }

  return defaults;
}

// -----------------------------------------------------------------------------
// Admin Email (fetches ACF adminemail field from WP)
// The adminemail ACF field group is on the Post type, with a single field:
//   adminEmailForNotification — the email that receives contact/newsletter notifications
// -----------------------------------------------------------------------------

const DEFAULT_ADMIN_EMAIL = 'info@gteep.gileadtrust.com';

// Cache admin email for 5 minutes to avoid repeated WP queries
let adminEmailCache: { email: string; timestamp: number } | null = null;
const ADMIN_EMAIL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAdminEmail(): Promise<string> {
  // Return cached value if still valid
  if (adminEmailCache && Date.now() - adminEmailCache.timestamp < ADMIN_EMAIL_CACHE_TTL) {
    return adminEmailCache.email;
  }

  try {
    const response = await fetchGraphQL<any>(GET_ADMIN_EMAIL);

    if (!response.errors && response.data?.posts?.nodes?.length) {
      const email = response.data.posts.nodes[0]?.adminemail?.adminEmailForNotification;
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        adminEmailCache = { email, timestamp: Date.now() };
        return email;
      }
    }
  } catch {
    // Fall through to default
  }

  // Fall back to env var or default
  const fallback = process.env.CONTACT_RECEIVER_EMAIL || process.env.SITE_EMAIL || DEFAULT_ADMIN_EMAIL;
  return fallback;
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
    posts: extractNodes<WPPost>(response, 'posts'),
    pageInfo: extractPageInfo(response, 'posts'),
  };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const response = await fetchGraphQL<WPPostData>(GET_POST_BY_SLUG, { slug });

  const post = extractSingleNode<WPPost>(response, 'post');

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
    mediaItems: extractNodes<WPMedia>(response, 'mediaItems'),
    pageInfo: extractPageInfo(response, 'mediaItems'),
  };
}

// -----------------------------------------------------------------------------
// Site Settings & Logo
// -----------------------------------------------------------------------------

/**
 * Fetch the site logo URL from WordPress.
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
    return defaultSiteSettings;
  }

  const { generalSettings } = response.data;

  if (!generalSettings) {
    return defaultSiteSettings;
  }

  // Try to fetch the site logo from WP
  const logoUrl = await getSiteLogo();

  // Determine the site description
  const wpDescription = generalSettings.description;
  const isDefaultWpTagline = !wpDescription || wpDescription === 'Just another WordPress site';
  const siteDescription = isDefaultWpTagline ? defaultSiteSettings.siteDescription : wpDescription;

  return {
    siteTitle: generalSettings.title || defaultSiteSettings.siteTitle,
    siteDescription,
    siteUrl: generalSettings.url || defaultSiteSettings.siteUrl,
    siteLogo: logoUrl
      ? {
          sourceUrl: logoUrl,
          altText: 'GTEEP Logo',
          mediaItemId: 8,
          width: 512,
          height: 512,
        }
      : null,
    favicon: logoUrl
      ? {
          sourceUrl: logoUrl,
          altText: 'GTEEP Favicon',
          mediaItemId: 8,
          width: 512,
          height: 512,
        }
      : null,
    acfOptions: defaultSiteSettings.acfOptions,
  };
}

// -----------------------------------------------------------------------------
// Menus
// -----------------------------------------------------------------------------

export async function getMenus(): Promise<WPMenu[]> {
  const response = await fetchGraphQL<WPMenusData>(GET_MENUS);

  if (response.errors || !response.data?.menus?.nodes?.length) {
    return [];
  }

  return response.data.menus.nodes;
}

// -----------------------------------------------------------------------------
// GTEEP-Specific Data Fetchers
// These use WP pages/posts to populate GTEEP-specific data types
// -----------------------------------------------------------------------------

/**
 * Get activities (What We Do) data from WordPress.
 * Fetches the "what-we-do" page and its child pages from WP.
 * Each child page becomes an activity section.
 * Nested children (e.g., Policy Firechat under Policy Engagement) are included.
 * New pages added under "What We Do" in WP will appear automatically.
 */
export async function getActivities(): Promise<import('@/types').GTEEPActivity[]> {
  try {
    const response = await fetchGraphQL<any>(GET_WHAT_WE_DO_PAGE);

    if (response.errors || !response.data?.page) {
      return [];
    }

    const page = response.data.page;
    const childNodes = page.children?.nodes || [];

    if (childNodes.length === 0) {
      return [];
    }

    // Map of known icons for specific activities (by slug)
    const iconMap: Record<string, string> = {
      'policy-research': 'FileSearch',
      'policy-engagement': 'Users',
      'citizen-enlightenment': 'Lightbulb',
      'data-speaks': 'BarChart3',
      'youth-mentoring': 'GraduationCap',
      'womens-economic-livelihood': 'Heart',
      'our-publication': 'BookOpen',
    };

    return childNodes.map((child: any, index: number) => {
      // Parse nested children (e.g., Policy Firechat under Policy Engagement)
      const nestedChildren: import('@/types').GTEEPActivityChild[] = (child.children?.nodes || []).map(
        (nested: any) => ({
          id: nested.id,
          databaseId: nested.databaseId,
          title: nested.title,
          slug: nested.slug,
          uri: nested.uri,
          content: nested.content || '',
          image: nested.featuredImage?.node?.sourceUrl || undefined,
          policyFirechat: nested.policyFirechat?.policyFirechat || undefined,
        })
      );

      return {
        id: child.id,
        databaseId: child.databaseId,
        title: child.title,
        slug: child.slug,
        uri: child.uri,
        description: '', // Will use content or description from WP
        content: child.content || '',
        icon: iconMap[child.slug] || 'FileSearch',
        image: child.featuredImage?.node?.sourceUrl || undefined,
        children: nestedChildren.length > 0 ? nestedChildren : undefined,
        policyFirechat: child.policyFirechat?.policyFirechat || undefined,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Get a single activity page by its URI slug.
 * Used for individual activity detail pages at /what-we-do/[slug].
 */
export async function getActivityPage(slug: string): Promise<{
  activity: import('@/types').GTEEPActivity;
  parentPage?: { id: string; title: string; slug: string; uri: string };
} | null> {
  try {
    const response = await fetchGraphQL<any>(GET_ACTIVITY_PAGE, {
      slug: `/what-we-do/${slug}/`,
    });

    if (response.errors || !response.data?.page) {
      return null;
    }

    const page = response.data.page;

    const iconMap: Record<string, string> = {
      'policy-research': 'FileSearch',
      'policy-engagement': 'Users',
      'citizen-enlightenment': 'Lightbulb',
      'data-speaks': 'BarChart3',
      'youth-mentoring': 'GraduationCap',
      'womens-economic-livelihood': 'Heart',
      'our-publication': 'BookOpen',
    };

    // Parse nested children
    const nestedChildren: import('@/types').GTEEPActivityChild[] = (page.children?.nodes || []).map(
      (nested: any) => ({
        id: nested.id,
        databaseId: nested.databaseId,
        title: nested.title,
        slug: nested.slug,
        uri: nested.uri,
        content: nested.content || '',
        image: nested.featuredImage?.node?.sourceUrl || undefined,
        policyFirechat: nested.policyFirechat?.policyFirechat || undefined,
      })
    );

    const activity: import('@/types').GTEEPActivity = {
      id: page.id,
      databaseId: page.databaseId,
      title: page.title,
      slug: page.slug,
      uri: page.uri,
      description: '',
      content: page.content || '',
      icon: iconMap[page.slug] || 'FileSearch',
      image: page.featuredImage?.node?.sourceUrl || undefined,
      children: nestedChildren.length > 0 ? nestedChildren : undefined,
      policyFirechat: page.policyFirechat?.policyFirechat || undefined,
    };

    const parent = page.parent?.node;
    const parentPage = parent
      ? { id: parent.id, title: parent.title, slug: parent.slug, uri: parent.uri }
      : undefined;

    return { activity, parentPage };
  } catch {
    return null;
  }
}

/**
 * Get philosophy data from WordPress.
 */
export async function getPhilosophy(): Promise<import('@/types').GTEEPPhilosophy[]> {
  try {
    const page = await getPageBySlug('our-philosophy');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to empty array
  }

  return [];
}

/**
 * Valid team member categories for ACF teamCategory select field
 */
const VALID_TEAM_CATEGORIES = ['executive', 'director', 'advisory-board', 'board-of-trustees'] as const;

/**
 * Get team members data from WordPress.
 *
 * Strategy: Try ACF first, then fall back to category-based approach.
 *
 * 1. ACF approach (preferred): Fetches posts with ACF "teamMember" field group.
 *    - Requires ACF field group "Team Member" with GraphQL type "TeamMember"
 *    - Uses a "team" category to scope the query
 *    - Each post has ACF fields: teamName, teamRole, teamCategory, teamBio, teamImage
 *
 * 2. Category-based fallback (legacy): Fetches posts from 4 separate categories.
 *    - Post Title = Person's Name
 *    - First Tag = Role/Position
 *    - Post Content/Excerpt = Bio
 *    - Featured Image = Profile picture
 *    - Category = Which group they belong to
 */
export async function getTeamMembers(): Promise<GTEEPTeamMember[]> {
  // --- Try ACF approach first ---
  try {
    const acfResponse = await fetchGraphQL<any>(GET_TEAM_MEMBERS_ACF);

    if (!acfResponse.errors && acfResponse.data?.posts?.nodes?.length) {
      const posts = acfResponse.data.posts.nodes;

      // Check if any posts actually have ACF teamMember data
      const hasAcfData = posts.some(
        (p: any) => p.teamMember && (p.teamMember.teamName || p.teamMember.teamRole)
      );

      if (hasAcfData) {
        const teamMembers: GTEEPTeamMember[] = posts
          .filter((p: any) => p.teamMember?.teamName || p.title)
          .map((p: any) => {
            const acf = p.teamMember || {};
            const category = VALID_TEAM_CATEGORIES.includes(acf.teamCategory)
              ? acf.teamCategory
              : 'director'; // default fallback

            return {
              id: p.id,
              name: acf.teamName || p.title || '',
              role: acf.teamRole || (p.tags?.nodes?.[0]?.name || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')),
              category,
              bio: acf.teamBio || (p.content
                ? p.content.replace(/<[^>]*>/g, '').trim()
                : p.excerpt?.replace(/<[^>]*>/g, '').trim() || ''),
              image: acf.teamImage?.sourceUrl || p.featuredImage?.node?.sourceUrl || '',
            };
          });

        return teamMembers;
      }
    }
  } catch {
    // ACF query failed — likely not set up yet. Fall through to category-based.
  }

  // --- Category-based fallback (original approach) ---
  try {
    const response = await fetchGraphQL<any>(GET_TEAM_MEMBERS);

    if (response.errors || !response.data) {
      return [];
    }

    const mapPostToMember = (
      post: any,
      category: GTEEPTeamMember['category']
    ): GTEEPTeamMember => ({
      id: post.id,
      name: post.title || '',
      role: post.tags?.nodes?.[0]?.name || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      category,
      bio: post.content
        ? post.content.replace(/<[^>]*>/g, '').trim()
        : post.excerpt?.replace(/<[^>]*>/g, '').trim() || '',
      image: post.featuredImage?.node?.sourceUrl || '',
    });

    const { executives, directors, advisoryBoard, boardOfTrustees } = response.data;

    const teamMembers: GTEEPTeamMember[] = [
      ...(executives?.nodes || []).map((p: any) => mapPostToMember(p, 'executive')),
      ...(directors?.nodes || []).map((p: any) => mapPostToMember(p, 'director')),
      ...(advisoryBoard?.nodes || []).map((p: any) => mapPostToMember(p, 'advisory-board')),
      ...(boardOfTrustees?.nodes || []).map((p: any) => mapPostToMember(p, 'board-of-trustees')),
    ];

    return teamMembers;
  } catch {
    return [];
  }
}

/**
 * Get outputs data from WordPress.
 */
export async function getOutputs(): Promise<import('@/types').GTEEPOutput[]> {
  try {
    const page = await getPageBySlug('our-outputs');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to empty array
  }

  return [];
}

/**
 * Get partners data from WordPress.
 */
export async function getPartners(): Promise<import('@/types').GTEEPPartner[]> {
  try {
    const page = await getPageBySlug('our-partners');
    if (page?.content) {
      // Could parse WP content in the future
    }
  } catch {
    // Fall through to empty array
  }

  return [];
}

/**
 * Get blog posts data from WordPress.
 */
export async function getBlogPosts(): Promise<import('@/types').GTEEPBlogPost[]> {
  const { posts } = await getPosts(50);

  // Categories used for team members — these should NOT appear in blog posts
  const teamCategorySlugs = ['executive', 'director', 'advisory-board', 'board-of-trustees', 'team'];

  // Filter out team member posts and the default "Hello world!" WP post
  const blogPosts = posts.filter((post) => {
    if (post.slug === 'hello-world') return false;

    const postCategories = (post.categories as any)?.nodes || [];
    const hasTeamCategory = postCategories.some((cat: any) =>
      teamCategorySlugs.includes(cat.slug)
    );
    if (hasTeamCategory) return false;

    return true;
  });

  if (blogPosts.length > 0) {
    return blogPosts.map((post): import('@/types').GTEEPBlogPost => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      date: post.date,
      author: (post.author as any)?.node?.name || 'GTEEP Team',
      image: post.featuredImage?.node?.sourceUrl || undefined,
      categories: (post.categories as any)?.nodes?.map((c: any) => c.name) || [],
    }));
  }

  return [];
}

// -----------------------------------------------------------------------------
// Publications
// -----------------------------------------------------------------------------

export async function getPublications(
  first: number = 50,
  after?: string
): Promise<{ publications: WPPublication[] }> {
  try {
    const response = await fetchGraphQL<WPPublicationsData>(GET_PUBLICATIONS, {
      first,
      after,
    });

    const publications = extractNodes<WPPublication>(response, 'publications');

    return { publications };
  } catch {
    return { publications: [] };
  }
}

export async function getPublicationBySlug(slug: string): Promise<WPPublication | null> {
  try {
    const response = await fetchGraphQL<WPPublicationData>(GET_PUBLICATION_BY_SLUG, { slug });

    const publication = extractSingleNode<WPPublication>(response, 'publication');
    return publication;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------

export async function getProjects(
  first: number = 50,
  after?: string
): Promise<{ projects: WPProject[] }> {
  try {
    const response = await fetchGraphQL<WPProjectsData>(GET_PROJECTS, {
      first,
      after,
    });

    const projects = extractNodes<WPProject>(response, 'projects');

    return { projects };
  } catch {
    return { projects: [] };
  }
}

export async function getProjectBySlug(slug: string): Promise<WPProject | null> {
  try {
    const response = await fetchGraphQL<WPProjectData>(GET_PROJECT_BY_SLUG, { slug });

    const project = extractSingleNode<WPProject>(response, 'project');
    return project;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

export async function getEvents(
  first: number = 50,
  after?: string
): Promise<{ events: WPEvent[] }> {
  try {
    const response = await fetchGraphQL<WPEventsData>(GET_EVENTS, {
      first,
      after,
    });

    const events = extractNodes<WPEvent>(response, 'events');

    return { events };
  } catch {
    return { events: [] };
  }
}

export async function getEventBySlug(slug: string): Promise<WPEvent | null> {
  try {
    const response = await fetchGraphQL<WPEventData>(GET_EVENT_BY_SLUG, { slug });

    const event = extractSingleNode<WPEvent>(response, 'event');
    return event;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Resources
// -----------------------------------------------------------------------------

export async function getResources(
  first: number = 50,
  after?: string
): Promise<{ resources: WPResource[] }> {
  try {
    const response = await fetchGraphQL<WPResourcesData>(GET_RESOURCES, {
      first,
      after,
    });

    const resources = extractNodes<WPResource>(response, 'resources');

    return { resources };
  } catch {
    return { resources: [] };
  }
}

export async function getResourceBySlug(slug: string): Promise<WPResource | null> {
  try {
    const response = await fetchGraphQL<WPResourceData>(GET_RESOURCE_BY_SLUG, { slug });

    const resource = extractSingleNode<WPResource>(response, 'resource');
    return resource;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Video Gallery (ACF-based)
// Fetches the Video Gallery page from WordPress with ACF videoGallery data,
// extracts YouTube URLs, and enriches each with oEmbed metadata.
// -----------------------------------------------------------------------------

interface VideoGalleryPageData {
  page: {
    id: string;
    databaseId: number;
    title: string;
    slug: string;
    uri: string;
    content: string | null;
    videoGallery: {
      firechatEvent: string | null;
    } | null;
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
        mediaItemId: number;
      } | null;
    } | null;
  } | null;
}

export async function getVideoGallery(): Promise<YouTubeVideo[]> {
  try {
    const response = await fetchGraphQL<VideoGalleryPageData>(GET_VIDEO_GALLERY);

    if (response.errors || !response.data?.page) {
      return [];
    }

    const page = response.data.page;
    const videoGallery = page.videoGallery;
    if (!videoGallery) return [];

    // Collect all YouTube URLs from ACF fields
    const videoUrls: string[] = [];

    // Single URL fields
    if (videoGallery.firechatEvent && videoGallery.firechatEvent.trim()) {
      videoUrls.push(videoGallery.firechatEvent.trim());
    }

    // Repeater field support (when user adds 'videos' repeater in ACF):
    // if (videoGallery.videos && Array.isArray(videoGallery.videos)) {
    //   for (const row of videoGallery.videos) {
    //     if (row.videoUrl && row.videoUrl.trim()) {
    //       videoUrls.push(row.videoUrl.trim());
    //     }
    //   }
    // }

    if (videoUrls.length === 0) return [];

    // Extract video IDs and enrich with oEmbed data
    const { extractVideoId, fetchVideoByOembed } = await import('@/lib/youtube');

    const videoPromises = videoUrls.map(async (url) => {
      const videoId = extractVideoId(url);
      if (!videoId) return null;
      return fetchVideoByOembed(videoId);
    });

    const results = await Promise.all(videoPromises);

    // Filter out null results and de-duplicate by videoId
    const seen = new Set<string>();
    const videos: YouTubeVideo[] = [];

    for (const video of results) {
      if (video && !seen.has(video.videoId)) {
        seen.add(video.videoId);
        // Mark as ACF-managed video (not "other video")
        videos.push({
          ...video,
          isOtherVideo: false,
        });
      }
    }

    return videos;
  } catch (error) {
    console.error('Failed to fetch video gallery from ACF:', error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// Output Downloadables (ACF-based)
// Fetches downloadable file URLs from the ourOutputDownloadables ACF on posts,
// maps them to GTEEPOutput objects with correct output tab categories.
// -----------------------------------------------------------------------------

/**
 * Mapping from ACF field names to output metadata:
 *   - outputType: which tab on the Outputs page
 *   - title: human-readable title
 *   - relatedActivity: which activity page this relates to
 *   - relatedSubActivity: which sub-activity (child page)
 *
 * Files without a specific output tab mapping will appear under "All" only.
 */
const DOWNLOADABLE_FIELD_MAP: Record<string, {
  outputType: GTEEPOutput['type'];
  title: string;
  relatedActivity?: string;
  relatedSubActivity?: string;
}> = {
  whatIsFiresideChat: {
    outputType: 'concept-note',
    title: 'Development Conversations Website',
    relatedActivity: 'policy-engagement',
    relatedSubActivity: 'policy-firechat',
  },
  genderBacklashArchitecture: {
    outputType: 'concept-note',
    title: 'Gender Backlash Architecture',
    relatedActivity: 'policy-engagement',
    relatedSubActivity: 'policy-firechat',
  },
  oluponnaGenderBacklashResponse60: {
    outputType: 'concept-note',
    title: 'Oluponna Gender Backlash Response',
    relatedActivity: 'policy-engagement',
    relatedSubActivity: 'policy-firechat',
  },
  thePolicyFiresideChatOutcomesAndNextSteps0323: {
    outputType: 'concept-note',
    title: 'Policy Fireside Chat Outcomes & Next Steps',
    relatedActivity: 'policy-engagement',
    relatedSubActivity: 'policy-firechat',
  },
  graphicsOnBookTalk: {
    outputType: 'knowledge-product',
    title: 'Graphics on Book Talk',
    // No specific activity relationship
  },
};

function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase() || '';
    return ext;
  } catch {
    return '';
  }
}

function getFileTypeIcon(ext: string): string {
  switch (ext) {
    case 'pptx': case 'ppt': return 'presentation';
    case 'docx': case 'doc': return 'document';
    case 'pdf': return 'pdf';
    case 'xlsx': case 'xls': return 'spreadsheet';
    default: return 'file';
  }
}

interface DownloadablesData {
  page: {
    id: string;
    ourOutputDownloadables: {
      whatIsFiresideChat: string | null;
      genderBacklashArchitecture: string | null;
      graphicsOnBookTalk: string | null;
      oluponnaGenderBacklashResponse60: string | null;
      thePolicyFiresideChatOutcomesAndNextSteps0323: string | null;
    } | null;
  } | null;
}

export async function getOutputDownloadables(): Promise<GTEEPOutput[]> {
  try {
    const response = await fetchGraphQL<DownloadablesData>(GET_OUTPUT_DOWNLOADABLES);

    if (response.errors || !response.data?.page) {
      return [];
    }

    // Get the downloadables ACF data from the "Our Outputs" page
    const downloadables = response.data.page.ourOutputDownloadables;
    if (!downloadables) return [];

    const outputs: GTEEPOutput[] = [];
    let counter = 0;

    // Map each ACF field to a GTEEPOutput
    for (const [fieldName, metadata] of Object.entries(DOWNLOADABLE_FIELD_MAP)) {
      const url = (downloadables as any)[fieldName];
      if (!url || typeof url !== 'string' || !url.trim()) continue;

      const ext = getFileExtension(url);
      const fileIcon = getFileTypeIcon(ext);

      outputs.push({
        id: `download-${counter++}`,
        title: metadata.title,
        slug: fieldName,
        type: metadata.outputType,
        description: `${fileIcon.charAt(0).toUpperCase() + fileIcon.slice(1)} file (${ext.toUpperCase()}) from GTEEP research outputs`,
        excerpt: `${metadata.title} — ${ext.toUpperCase()} download`,
        date: new Date().toISOString().split('T')[0],
        downloadUrl: url,
        relatedActivity: metadata.relatedActivity,
        relatedSubActivity: metadata.relatedSubActivity,
        fileType: ext,
      });
    }

    return outputs;
  } catch (error) {
    console.error('Failed to fetch output downloadables from ACF:', error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// Follow the Money Event Files (ACF-based)
// Fetches the followTheMoney ACF field group from posts.
// Returns the brief-for-registration and full concept note file URLs for the
// "Follow the Money" Fireside Chat event.
// -----------------------------------------------------------------------------

interface FollowTheMoneyData {
  posts: {
    nodes: Array<{
      id: string;
      followTheMoney: {
        followTheMoneyBriefForRegistration: string | null;
        followTheMoneyFullConceptNote: string | null;
      } | null;
    }>;
  };
}

export async function getFollowTheMoneyFiles(): Promise<FollowTheMoneyFiles> {
  try {
    const response = await fetchGraphQL<FollowTheMoneyData>(GET_FOLLOW_THE_MONEY_FILES, { first: 1 });

    if (response.errors || !response.data?.posts?.nodes?.length) {
      return {};
    }

    // The ACF field group is attached to all posts (location rule), so the data
    // is the same on every post. Read from the first post.
    const post = response.data.posts.nodes[0];
    const ftm = post.followTheMoney;
    if (!ftm) return {};

    return {
      briefForRegistration: ftm.followTheMoneyBriefForRegistration?.trim() || undefined,
      fullConceptNote: ftm.followTheMoneyFullConceptNote?.trim() || undefined,
    };
  } catch (error) {
    console.error('Failed to fetch Follow the Money files from ACF:', error);
    return {};
  }
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
