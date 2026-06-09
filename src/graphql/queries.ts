// =============================================================================
// GraphQL Queries - WordPress Headless CMS
// Professor Bola Akanji - Economics, Trade & Development Research Website
// =============================================================================

// -----------------------------------------------------------------------------
// Shared Fragments
// -----------------------------------------------------------------------------

const SEO_FRAGMENT = `
  seo {
    title
    metaDesc
    metaKeywords
    canonicalUrl
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
      altText
      width
      height
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
      altText
    }
    schema {
      raw
    }
  }
`;

const IMAGE_FRAGMENT = `
  sourceUrl
  altText
  mediaItemId
  width
  height
  srcSet
  sizes
`;

const AUTHOR_FRAGMENT = `
  author {
    node {
      name
      slug
      description
      avatar {
        url
        width
        height
      }
    }
  }
`;

const CATEGORIES_FRAGMENT = `
  categories {
    nodes {
      id
      name
      slug
      description
      count
    }
  }
`;

const TAGS_FRAGMENT = `
  tags {
    nodes {
      id
      name
      slug
      count
    }
  }
`;

const FEATURED_IMAGE_FRAGMENT = `
  featuredImage {
    node {
      ${IMAGE_FRAGMENT}
    }
  }
`;

const PAGE_INFO_FRAGMENT = `
  pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// -----------------------------------------------------------------------------
// Page Queries
// -----------------------------------------------------------------------------

export const GET_PAGES = `
  query GetPages($first: Int = 50, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        modified
        uri
        isFrontPage
        ${FEATURED_IMAGE_FRAGMENT}
        ${SEO_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      isFrontPage
      ${FEATURED_IMAGE_FRAGMENT}
      template {
        templateName
      }
      ${SEO_FRAGMENT}
      acfPageFields {
        heroTitle
        heroSubtitle
        heroDescription
        heroImage {
          ${IMAGE_FRAGMENT}
        }
        heroCtaText
        heroCtaUrl
        sections {
          sectionTitle
          sectionContent
          sectionImage {
            ${IMAGE_FRAGMENT}
          }
          sectionLayout
          sectionBackground
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Post Queries
// -----------------------------------------------------------------------------

export const GET_POSTS = `
  query GetPosts($first: Int = 12, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        uri
        ${FEATURED_IMAGE_FRAGMENT}
        ${AUTHOR_FRAGMENT}
        ${CATEGORIES_FRAGMENT}
        ${TAGS_FRAGMENT}
        ${SEO_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      ${FEATURED_IMAGE_FRAGMENT}
      ${AUTHOR_FRAGMENT}
      ${CATEGORIES_FRAGMENT}
      ${TAGS_FRAGMENT}
      ${SEO_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Publication Queries
// -----------------------------------------------------------------------------

export const GET_PUBLICATIONS = `
  query GetPublications($first: Int = 20, $after: String) {
    publications: posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: "publications" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        uri
        ${FEATURED_IMAGE_FRAGMENT}
        ${SEO_FRAGMENT}
        acfPublicationFields {
          publicationType
          authors
          journal
          year
          volume
          issue
          pages
          doi
          publisher
          abstract
          keywords
          downloadUrl
          externalUrl
          citationCount
          isFeatured
        }
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_PUBLICATION_BY_SLUG = `
  query GetPublicationBySlug($slug: ID!) {
    publication: post(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      ${FEATURED_IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      acfPublicationFields {
        publicationType
        authors
        journal
        year
        volume
        issue
        pages
        doi
        publisher
        abstract
        keywords
        downloadUrl
        externalUrl
        citationCount
        isFeatured
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Project Queries
// -----------------------------------------------------------------------------

export const GET_PROJECTS = `
  query GetProjects($first: Int = 20, $after: String) {
    projects: posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: "projects" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        uri
        ${FEATURED_IMAGE_FRAGMENT}
        ${SEO_FRAGMENT}
        acfProjectFields {
          projectStatus
          startDate
          endDate
          fundingAgency
          grantAmount
          principalInvestigator
          coInvestigators
          partnerInstitutions
          projectUrl
          publications
          highlights
          isFeatured
        }
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_PROJECT_BY_SLUG = `
  query GetProjectBySlug($slug: ID!) {
    project: post(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      ${FEATURED_IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      acfProjectFields {
        projectStatus
        startDate
        endDate
        fundingAgency
        grantAmount
        principalInvestigator
        coInvestigators
        partnerInstitutions
        projectUrl
        publications
        highlights
        isFeatured
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Event Queries
// -----------------------------------------------------------------------------

export const GET_EVENTS = `
  query GetEvents($first: Int = 20, $after: String) {
    events: posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: "events" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        uri
        ${FEATURED_IMAGE_FRAGMENT}
        ${SEO_FRAGMENT}
        acfEventFields {
          eventStartDate
          eventEndDate
          eventTime
          venue
          city
          country
          eventType
          registrationUrl
          organizer
          isVirtual
          isFeatured
        }
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_EVENT_BY_SLUG = `
  query GetEventBySlug($slug: ID!) {
    event: post(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      ${FEATURED_IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      acfEventFields {
        eventStartDate
        eventEndDate
        eventTime
        venue
        city
        country
        eventType
        registrationUrl
        organizer
        isVirtual
        isFeatured
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Resource Queries
// -----------------------------------------------------------------------------

export const GET_RESOURCES = `
  query GetResources($first: Int = 20, $after: String) {
    resources: posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: "resources" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        uri
        ${FEATURED_IMAGE_FRAGMENT}
        ${SEO_FRAGMENT}
        acfResourceFields {
          resourceType
          fileSize
          fileFormat
          downloadUrl
          externalUrl
          version
          license
          isGated
          isFeatured
        }
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_RESOURCE_BY_SLUG = `
  query GetResourceBySlug($slug: ID!) {
    resource: post(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      uri
      ${FEATURED_IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      acfResourceFields {
        resourceType
        fileSize
        fileFormat
        downloadUrl
        externalUrl
        version
        license
        isGated
        isFeatured
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Media Queries
// -----------------------------------------------------------------------------

export const GET_MEDIA_ITEMS = `
  query GetMediaItems($first: Int = 20, $after: String) {
    mediaItems(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        altText
        sourceUrl
        mediaType
        mimeType
        width
        height
        caption
        description
        date
        srcSet
        sizes
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Partner Queries
// -----------------------------------------------------------------------------

export const GET_PARTNERS = `
  query GetPartners($first: Int = 50) {
    partners: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "partners" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        content
        ${FEATURED_IMAGE_FRAGMENT}
        acfPartnerFields {
          partnerType
          website
          country
          partnershipSince
          description
          isFeatured
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Testimonial Queries
// -----------------------------------------------------------------------------

export const GET_TESTIMONIALS = `
  query GetTestimonials($first: Int = 20) {
    testimonials: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "testimonials" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        content
        acfTestimonialFields {
          personName
          personTitle
          personOrganization
          personImage {
            ${IMAGE_FRAGMENT}
          }
          rating
          isFeatured
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Site Settings Queries
// -----------------------------------------------------------------------------

export const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
    }
    acfOptions {
      siteSettings {
        heroTitle
        heroSubtitle
        heroDescription
        heroImage {
          ${IMAGE_FRAGMENT}
        }
        heroCtaText
        heroCtaUrl
        aboutSummary
        aboutImage {
          ${IMAGE_FRAGMENT}
        }
        contactEmail
        contactPhone
        contactAddress
        officeHours
        footerText
        googleAnalyticsId
        mailchimpListUrl
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Menu Queries
// -----------------------------------------------------------------------------

export const GET_MENUS = `
  query GetMenus {
    menus(where: { location: PRIMARY }) {
      nodes {
        id
        name
        slug
        locations
        menuItems(first: 100) {
          nodes {
            id
            label
            url
            target
            cssClasses
            description
            parentId
            childItems {
              nodes {
                id
                label
                url
                target
                cssClasses
                description
                parentId
              }
            }
            connectedObject {
              ... on ContentNode {
                __typename
                slug
                uri
              }
            }
          }
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Social Links Query
// -----------------------------------------------------------------------------

export const GET_SOCIAL_LINKS = `
  query GetSocialLinks {
    acfOptions {
      socialLinks {
        twitter
        linkedin
        facebook
        instagram
        youtube
        researchgate
        googlescholar
        orcid
        academiaEdu
        ssrn
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Search Query
// -----------------------------------------------------------------------------

export const SEARCH_QUERY = `
  query SearchContent($search: String!, $first: Int = 10) {
    posts(first: $first, where: { search: $search, status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        uri
        date
        ${FEATURED_IMAGE_FRAGMENT}
      }
    }
    pages(first: $first, where: { search: $search, status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        uri
        date
      }
    }
    publications: posts(
      first: $first
      where: { search: $search, status: PUBLISH, categoryName: "publications" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        uri
        date
        acfPublicationFields {
          publicationType
          year
          authors
        }
      }
    }
    projects: posts(
      first: $first
      where: { search: $search, status: PUBLISH, categoryName: "projects" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        uri
        date
        acfProjectFields {
          projectStatus
        }
      }
    }
    events: posts(
      first: $first
      where: { search: $search, status: PUBLISH, categoryName: "events" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        uri
        date
        acfEventFields {
          eventStartDate
          eventType
          venue
          city
        }
      }
    }
  }
`;
