// =============================================================================
// GraphQL Queries - WordPress Headless CMS
// GTEEP - Gilead Trust Economic Empowerment Project
//
// These queries are designed to work with the actual WordPress GraphQL schema
// at gteep.jileadtrust.com/graphql. ACF fields are NOT available, so we only
// query standard WP GraphQL fields.
// =============================================================================

// -----------------------------------------------------------------------------
// Shared Fragments
// -----------------------------------------------------------------------------

const IMAGE_FRAGMENT = `
  sourceUrl
  altText
  mediaItemId
  srcSet
  sizes
  mediaDetails {
    width
    height
  }
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
        content
        date
        modified
        uri
        isFrontPage
        ${FEATURED_IMAGE_FRAGMENT}
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
      date
      modified
      uri
      isFrontPage
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Post Queries (Blog)
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
    }
  }
`;

// -----------------------------------------------------------------------------
// Media Queries
// -----------------------------------------------------------------------------

export const GET_MEDIA_ITEMS = `
  query GetMediaItems($first: Int = 50, $after: String) {
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
        mediaDetails {
          width
          height
        }
        caption
        date
        srcSet
        sizes
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Site Settings Query
// -----------------------------------------------------------------------------

export const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
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
// Team Members Query
// Fetches posts in the team-member categories:
//   - "Executive" category → Executive Director
//   - "Director" category → Directors
//   - "Board of Trustees" category → Trustees
//   - "Advisory Board" category → Advisory Board
//
// Convention:
//   Post Title     = Person's Name (e.g. "Bola Akanji")
//   Post Excerpt   = Short brief / one-liner
//   Post Content   = Full bio
//   Featured Image = Profile picture
//   Category       = Which group they belong to
//   First Tag      = Their Position/Role (e.g. "Executive Director")
// -----------------------------------------------------------------------------

export const GET_TEAM_MEMBERS = `
  query GetTeamMembers($first: Int = 50) {
    executives: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "executive" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        ${FEATURED_IMAGE_FRAGMENT}
        ${TAGS_FRAGMENT}
      }
    }
    directors: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "director" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        ${FEATURED_IMAGE_FRAGMENT}
        ${TAGS_FRAGMENT}
      }
    }
    advisoryBoard: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "advisory-board" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        ${FEATURED_IMAGE_FRAGMENT}
        ${TAGS_FRAGMENT}
      }
    }
    boardOfTrustees: posts(
      first: $first
      where: { status: PUBLISH, categoryName: "board-of-trustees" }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        content
        ${FEATURED_IMAGE_FRAGMENT}
        ${TAGS_FRAGMENT}
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Publications Queries
// Custom post type "publication" in WPGraphQL
// -----------------------------------------------------------------------------

export const GET_PUBLICATIONS = `
  query GetPublications($first: Int = 50, $after: String) {
    publications(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        content
        excerpt
        date
        modified
        status
        uri
        ${FEATURED_IMAGE_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_PUBLICATION_BY_SLUG = `
  query GetPublicationBySlug($slug: ID!) {
    publication(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      status
      uri
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Projects Queries
// Custom post type "project" in WPGraphQL
// -----------------------------------------------------------------------------

export const GET_PROJECTS = `
  query GetProjects($first: Int = 50, $after: String) {
    projects(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        content
        excerpt
        date
        modified
        status
        uri
        ${FEATURED_IMAGE_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_PROJECT_BY_SLUG = `
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      status
      uri
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Events Queries
// Custom post type "event" in WPGraphQL
// -----------------------------------------------------------------------------

export const GET_EVENTS = `
  query GetEvents($first: Int = 50, $after: String) {
    events(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        content
        excerpt
        date
        modified
        status
        uri
        ${FEATURED_IMAGE_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_EVENT_BY_SLUG = `
  query GetEventBySlug($slug: ID!) {
    event(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      status
      uri
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// Resources Queries
// Custom post type "resource" in WPGraphQL
// -----------------------------------------------------------------------------

export const GET_RESOURCES = `
  query GetResources($first: Int = 50, $after: String) {
    resources(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        content
        excerpt
        date
        modified
        status
        uri
        ${FEATURED_IMAGE_FRAGMENT}
      }
      ${PAGE_INFO_FRAGMENT}
    }
  }
`;

export const GET_RESOURCE_BY_SLUG = `
  query GetResourceBySlug($slug: ID!) {
    resource(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      excerpt
      date
      modified
      status
      uri
      ${FEATURED_IMAGE_FRAGMENT}
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
  }
`;
