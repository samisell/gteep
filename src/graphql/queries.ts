// =============================================================================
// GraphQL Queries - WordPress Headless CMS
// GTEEP - Gilead Trust Economic Empowerment Project
//
// These queries are designed to work with the actual WordPress GraphQL schema
// at backend.gileadtrust.com/graphql. ACF fields are NOT available, so we only
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
      aboutContent {
        aboutSummary
        aboutVision
        aboutMission
        aboutGoal
      }
      contactdetails {
        address
        email
        phoneNumber
      }
      videoGallery {
        firechatEvent
      }
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;

// -----------------------------------------------------------------------------
// What We Do Query - Fetches parent page with all child pages + nested children
// Includes ACF policyFirechat fields for Policy Engagement sub-pages
// -----------------------------------------------------------------------------

export const GET_WHAT_WE_DO_PAGE = `
  query GetWhatWeDoPage {
    page(id: "/what-we-do/", idType: URI) {
      id
      databaseId
      title
      slug
      uri
      content
      ${FEATURED_IMAGE_FRAGMENT}
      children(first: 20) {
        nodes {
          ... on Page {
            id
            databaseId
            title
            slug
            uri
            content
            ${FEATURED_IMAGE_FRAGMENT}
            policyFirechat {
              policyFirechat
            }
            children(first: 20) {
              nodes {
                ... on Page {
                  id
                  databaseId
                  title
                  slug
                  uri
                  content
                  ${FEATURED_IMAGE_FRAGMENT}
                  policyFirechat {
                    policyFirechat
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Single Activity Page Query - Fetches one What We Do child page with children
// -----------------------------------------------------------------------------

export const GET_ACTIVITY_PAGE = `
  query GetActivityPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      uri
      content
      ${FEATURED_IMAGE_FRAGMENT}
      policyFirechat {
        policyFirechat
      }
      children(first: 20) {
        nodes {
          ... on Page {
            id
            databaseId
            title
            slug
            uri
            content
            ${FEATURED_IMAGE_FRAGMENT}
            policyFirechat {
              policyFirechat
            }
          }
        }
      }
      parent {
        node {
          ... on Page {
            id
            databaseId
            title
            slug
            uri
          }
        }
      }
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
// Admin Email Query (ACF adminemail field group on Post type)
// Fetches the admin notification email from any published post with ACF data
// -----------------------------------------------------------------------------

export const GET_ADMIN_EMAIL = `
  query GetAdminEmail {
    posts(first: 1, where: { status: PUBLISH }) {
      nodes {
        adminemail {
          adminEmailForNotification
        }
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
// Team Members Query (Category-based fallback)
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
// Team Members Query (ACF-based)
// Uses ACF field group "Team Member" on posts.
//
// ACF Field Group Setup in WordPress:
//   Field Group Name:  "Team Member"
//   GraphQL Type Name: "TeamMember"
//   Location Rule:     Post Type = Post
//
// ACF Fields:
//   Field Label       | Field Name    | Field Type | Notes
//   ------------------|---------------|------------|---------------------------
//   Name              | teamName      | Text       | Person's full name
//   Role/Position     | teamRole      | Text       | e.g. "Executive Director"
//   Category          | teamCategory  | Select     | Options: executive, director,
//                     |               |            | advisory-board, board-of-trustees
//   Short Bio         | teamBio       | Textarea   | Brief one-liner bio
//   Profile Image     | teamImage     | Image      | Return format: Image Object
//
// With ACF, ALL team members are fetched in a SINGLE query.
// The teamCategory select field determines which group they belong to.
// -----------------------------------------------------------------------------

export const GET_TEAM_MEMBERS_ACF = `
  query GetTeamMembersACF($first: Int = 50) {
    posts(
      first: $first
      where: { status: PUBLISH, categoryName: "team" }
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
        teamMember {
          teamName
          teamRole
          teamCategory
          teamBio
          teamImage {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Output Downloadables Query (ACF-based)
// Fetches the ourOutputDownloadables ACF field group on the "Our Outputs" page.
//
// ACF Field Group: "OurOutputDownloadables"
// GraphQL Type: "OurOutputDownloadables"
// Location Rule: Post Type = Page (applies to all pages)
//
// ACF Fields (all URL type, each pointing to a downloadable file):
//   Field Name                              | Label                                       | Category
//   ----------------------------------------|---------------------------------------------|------------------
//   whatIsFiresideChat                      | What Is Fireside Chat                       | concept-note (Firechat)
//   genderBacklashArchitecture              | Gender Backlash Architecture                | concept-note (Firechat)
//   graphicsOnBookTalk                      | Graphics on Book Talk                       | (uncategorized → All)
//   oluponnaGenderBacklashResponse60        | Oluponna Gender Backlash Response 60        | concept-note (Firechat)
//   thePolicyFiresideChatOutcomes...0323    | The Policy Fireside Chat Outcomes...        | concept-note (Firechat)
// -----------------------------------------------------------------------------

export const GET_OUTPUT_DOWNLOADABLES = `
  query GetOutputDownloadables {
    page(id: "/our-outputs/", idType: URI) {
      id
      ourOutputDownloadables {
        whatIsFiresideChat
        genderBacklashArchitecture
        graphicsOnBookTalk
        oluponnaGenderBacklashResponse60
        thePolicyFiresideChatOutcomesAndNextSteps0323
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

// -----------------------------------------------------------------------------
// Video Gallery Query (ACF-based)
// Fetches the Video Gallery page under Our Outputs with ACF videoGallery data.
//
// ACF Field Group Setup in WordPress:
//   Field Group Name:  "VideoGallery"
//   GraphQL Type Name: "VideoGallery"
//   Location Rule:     Page = Video Gallery (or Page Template)
//
// ACF Fields:
//   Field Label       | Field Name    | Field Type | Notes
//   ------------------|---------------|------------|---------------------------
//   Firechat Event    | firechatEvent | URL        | Single YouTube video URL
//
// For MULTIPLE VIDEOS, add an ACF Repeater field:
//   Field Label       | Field Name    | Field Type | Notes
//   ------------------|---------------|------------|---------------------------
//   Videos            | videos        | Repeater   | Add rows for each video
//     Video URL       | videoUrl      | URL        | YouTube URL
//     Video Title     | videoTitle    | Text       | Optional custom title
//     Video Desc      | videoDescription | Textarea | Optional custom description
//
// When the repeater is added, update this query to include:
//   videos { videoUrl videoTitle videoDescription }
// -----------------------------------------------------------------------------

export const GET_VIDEO_GALLERY = `
  query GetVideoGallery {
    page(id: "/our-outputs/video-gallery/", idType: URI) {
      id
      databaseId
      title
      slug
      uri
      content
      videoGallery {
        firechatEvent
      }
      ${FEATURED_IMAGE_FRAGMENT}
    }
  }
`;
