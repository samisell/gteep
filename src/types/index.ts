// =============================================================================
// GTEEP - Gilead Trust Economic Empowerment Project
// Comprehensive TypeScript Types
// =============================================================================

// -----------------------------------------------------------------------------
// Base / Shared Types
// -----------------------------------------------------------------------------

export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaItemId: number;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
}

export interface WPAuthor {
  name: string;
  slug: string;
  description?: string;
  avatar?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface WPCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: WPCategory | null;
}

export interface WPTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface WPSEO {
  title?: string;
  metaDesc?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: WPImage | null;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: WPImage | null;
  schema?: {
    raw?: string;
  };
}

// -----------------------------------------------------------------------------
// GTEEP-Specific Types
// -----------------------------------------------------------------------------

export interface GTEEPActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface GTEEPPhilosophy {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GTEEPTeamMember {
  id: string;
  name: string;
  role: string;
  category: 'executive' | 'director' | 'board-of-trustees' | 'advisory-board';
  bio: string;
  image?: string;
}

export interface GTEEPOutput {
  id: string;
  title: string;
  slug: string;
  type: 'concept-note' | 'policy-brief' | 'data-stock' | 'video' | 'photo' | 'knowledge-product';
  description: string;
  excerpt: string;
  date: string;
  downloadUrl?: string;
  externalUrl?: string;
  image?: string;
  authors?: string;
  tags?: string[];
}

export interface GTEEPBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  categories: string[];
}

export interface GTEEPPartner {
  id: string;
  name: string;
  type: 'university' | 'research-institute' | 'government' | 'ngo' | 'international-organization' | 'private-sector';
  website?: string;
  country?: string;
  description?: string;
  logo?: string;
}

// -----------------------------------------------------------------------------
// YouTube Video Types
// -----------------------------------------------------------------------------

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  channelUrl: string;
  videoUrl: string;
  embedUrl: string;
  viewCount?: number;
  /** Whether this video is from the "Other Videos" .env config */
  isOtherVideo?: boolean;
}

// -----------------------------------------------------------------------------
// WordPress Content Types (kept for future WP backend integration)
// -----------------------------------------------------------------------------

export interface WPPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  author?: WPAuthor;
  featuredImage?: WPImage | null;
  categories?: WPCategory[];
  tags?: WPTag[];
  seo?: WPSEO;
  uri: string;
}

export interface WPPage {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  author?: WPAuthor;
  featuredImage?: WPImage | null;
  seo?: WPSEO;
  uri: string;
  isFrontPage?: boolean;
  acfPageFields?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    heroImage?: WPImage | null;
    heroCtaText?: string;
    heroCtaUrl?: string;
    sections?: WPPageSection[];
  };
}

export interface WPPageSection {
  sectionTitle?: string;
  sectionContent?: string;
  sectionImage?: WPImage | null;
  sectionLayout?: 'full' | 'split-left' | 'split-right';
  sectionBackground?: 'default' | 'accent' | 'dark';
}

export interface WPPublication {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  featuredImage?: WPImage | null;
  seo?: WPSEO;
  uri: string;
  acfPublicationFields?: {
    publicationType?: 'journal-article' | 'book-chapter' | 'working-paper' | 'policy-brief' | 'conference-paper' | 'report';
    authors?: string;
    journal?: string;
    year?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    publisher?: string;
    abstract?: string;
    keywords?: string;
    downloadUrl?: string;
    externalUrl?: string;
    citationCount?: number;
    isFeatured?: boolean;
  };
}

export interface WPProject {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  featuredImage?: WPImage | null;
  seo?: WPSEO;
  uri: string;
  acfProjectFields?: {
    projectStatus?: 'ongoing' | 'completed' | 'upcoming';
    startDate?: string;
    endDate?: string;
    fundingAgency?: string;
    grantAmount?: string;
    principalInvestigator?: string;
    coInvestigators?: string;
    partnerInstitutions?: string;
    projectUrl?: string;
    publications?: string;
    highlights?: string;
    isFeatured?: boolean;
  };
}

export interface WPEvent {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  featuredImage?: WPImage | null;
  seo?: WPSEO;
  uri: string;
  acfEventFields?: {
    eventStartDate?: string;
    eventEndDate?: string;
    eventTime?: string;
    venue?: string;
    city?: string;
    country?: string;
    eventType?: 'conference' | 'workshop' | 'seminar' | 'lecture' | 'panel' | 'webinar';
    registrationUrl?: string;
    organizer?: string;
    isVirtual?: boolean;
    isFeatured?: boolean;
  };
}

export interface WPResource {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  featuredImage?: WPImage | null;
  seo?: WPSEO;
  uri: string;
  acfResourceFields?: {
    resourceType?: 'dataset' | 'presentation' | 'report' | 'tool' | 'infographic' | 'policy-note';
    fileSize?: string;
    fileFormat?: string;
    downloadUrl?: string;
    externalUrl?: string;
    version?: string;
    license?: string;
    isGated?: boolean;
    isFeatured?: boolean;
  };
}

export interface WPMedia {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  altText: string;
  sourceUrl: string;
  mediaType: string;
  mimeType: string;
  width?: number;
  height?: number;
  fileSize?: number;
  caption?: string;
  description?: string;
  date: string;
  srcSet?: string;
  sizes?: string;
}

export interface WPPartner {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  featuredImage?: WPImage | null;
  acfPartnerFields?: {
    partnerType?: 'university' | 'research-institute' | 'government' | 'ngo' | 'international-organization' | 'private-sector';
    website?: string;
    country?: string;
    partnershipSince?: string;
    description?: string;
    isFeatured?: boolean;
  };
}

export interface WPTestimonial {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  acfTestimonialFields?: {
    personName?: string;
    personTitle?: string;
    personOrganization?: string;
    personImage?: WPImage | null;
    rating?: number;
    isFeatured?: boolean;
  };
}

// -----------------------------------------------------------------------------
// Site Configuration Types
// -----------------------------------------------------------------------------

export interface WPSiteSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo?: WPImage | null;
  favicon?: WPImage | null;
  acfOptions?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    heroImage?: WPImage | null;
    heroCtaText?: string;
    heroCtaUrl?: string;
    aboutSummary?: string;
    aboutImage?: WPImage | null;
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    officeHours?: string;
    footerText?: string;
    googleAnalyticsId?: string;
    mailchimpListUrl?: string;
  };
}

export interface WPSocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  researchgate?: string;
  googlescholar?: string;
  orcid?: string;
  academiaEdu?: string;
  ssrn?: string;
}

export interface WPMenuItem {
  id: string;
  label: string;
  url: string;
  target?: string;
  cssClasses?: string[];
  description?: string;
  parentId?: string;
  childItems?: WPMenuItem[];
  connectedObject?: {
    __typename: string;
    slug?: string;
    uri?: string;
  };
}

export interface WPMenu {
  id: string;
  name: string;
  slug: string;
  locations?: string[];
  menuItems?: WPMenuItem[];
}

// -----------------------------------------------------------------------------
// Form / Interaction Types
// -----------------------------------------------------------------------------

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  organization?: string;
  consent: boolean;
}

export interface DownloadLeadData {
  name: string;
  email: string;
  organization?: string;
  purpose?: string;
  resourceId: string;
  resourceTitle: string;
}

export interface NewsletterData {
  email: string;
  name?: string;
  interests?: string[];
  consent: boolean;
}

// -----------------------------------------------------------------------------
// GraphQL Response Types
// -----------------------------------------------------------------------------

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLErrorResponse[];
  extensions?: Record<string, any>;
}

export interface GraphQLErrorResponse {
  message: string;
  locations?: {
    line: number;
    column: number;
  }[];
  path?: string[];
  extensions?: Record<string, any>;
}

// Content collection responses
export interface WPPostsData {
  posts: {
    nodes: WPPost[];
    pageInfo: WPPageInfo;
  };
}

export interface WPPagesData {
  pages: {
    nodes: WPPage[];
    pageInfo: WPPageInfo;
  };
}

export interface WPPublicationsData {
  publications: {
    nodes: WPPublication[];
    pageInfo: WPPageInfo;
  };
}

export interface WPProjectsData {
  projects: {
    nodes: WPProject[];
    pageInfo: WPPageInfo;
  };
}

export interface WPEventsData {
  events: {
    nodes: WPEvent[];
    pageInfo: WPPageInfo;
  };
}

export interface WPResourcesData {
  resources: {
    nodes: WPResource[];
    pageInfo: WPPageInfo;
  };
}

export interface WPMediaData {
  mediaItems: {
    nodes: WPMedia[];
    pageInfo: WPPageInfo;
  };
}

export interface WPPartnersData {
  partners: {
    nodes: WPPartner[];
  };
}

export interface WPTestimonialsData {
  testimonials: {
    nodes: WPTestimonial[];
  };
}

export interface WPPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

// Single item responses
export interface WPPostData {
  post: WPPost | null;
}

export interface WPPageData {
  page: WPPage | null;
}

export interface WPPublicationData {
  publication: WPPublication | null;
}

export interface WPProjectData {
  project: WPProject | null;
}

export interface WPEventData {
  event: WPEvent | null;
}

export interface WPResourceData {
  resource: WPResource | null;
}

// Settings responses
export interface WPSiteSettingsData {
  generalSettings: {
    title: string;
    description: string;
    url: string;
  };
  acfOptions?: {
    siteSettings?: WPSiteSettings['acfOptions'];
  };
}

export interface WPMenusData {
  menus: {
    nodes: WPMenu[];
  };
}

export interface WPSocialLinksData {
  acfOptions?: {
    socialLinks?: WPSocialLinks;
  };
}

// Search response
export interface WPSearchData {
  contentTypes?: {
    nodes: WPSearchResult[];
  };
  posts?: {
    nodes: WPPost[];
  };
  pages?: {
    nodes: WPPage[];
  };
  publications?: {
    nodes: WPPublication[];
  };
  projects?: {
    nodes: WPProject[];
  };
  events?: {
    nodes: WPEvent[];
  };
}

export interface WPSearchResult {
  id: string;
  title: string;
  slug: string;
  uri: string;
  contentType?: {
    node: {
      name: string;
    };
  };
  excerpt?: string;
}

// -----------------------------------------------------------------------------
// SEO / Metadata Types
// -----------------------------------------------------------------------------

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogPublishedTime?: string;
  ogModifiedTime?: string;
  ogAuthors?: string[];
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface GenerateMetadataResult {
  title: string;
  description: string;
  keywords?: string[];
  alternates?: {
    canonical?: string;
  };
  openGraph: {
    title: string;
    description: string;
    url?: string;
    siteName: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// -----------------------------------------------------------------------------
// Component Props Types
// -----------------------------------------------------------------------------

export interface SectionProps {
  className?: string;
  id?: string;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: WPImage | null;
  ctaText?: string;
  ctaUrl?: string;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
}

// -----------------------------------------------------------------------------
// Filter / Query Types
// -----------------------------------------------------------------------------

export interface ContentFilter {
  search?: string;
  category?: string;
  tag?: string;
  year?: string;
  type?: string;
  status?: string;
  sortBy?: 'date' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PublicationFilter extends ContentFilter {
  publicationType?: WPPublication['acfPublicationFields']['publicationType'];
  journal?: string;
}

export interface ProjectFilter extends ContentFilter {
  projectStatus?: WPProject['acfProjectFields']['projectStatus'];
}

export interface EventFilter extends ContentFilter {
  eventType?: WPEvent['acfEventFields']['eventType'];
  upcoming?: boolean;
}

export interface ResourceFilter extends ContentFilter {
  resourceType?: WPResource['acfResourceFields']['resourceType'];
}
