---
Task ID: 1
Agent: Main Agent
Task: Create Policy Fireside Chats page with downloadable fireside.pptx

Work Log:
- Analyzed existing site structure, page patterns (server + client component split), navigation, and footer
- Read existing EventsPageClient, WhatWeDoPageClient, PageHeader, Navbar, Footer components for design patterns
- Reviewed existing mock data for events including the "Policy Fireside Chat — Africa: The Gender Backlash" event
- Created `/home/z/my-project/src/app/fireside-chats/page.tsx` - Server component with ISR (revalidate=300), metadata, and event data fetching
- Created `/home/z/my-project/src/components/pages/FiresideChatsPageClient.tsx` - Full client component with:
  - PageHeader with "Policy Fireside Chats" title and breadcrumb
  - Introduction section with "Where Policy Meets Practice" heading
  - "How It Works" section with 4 cards (Expert Moderation, Diverse Panelists, Live Q&A, Actionable Insights)
  - Episodes section with 4 episodes (1 recorded, 3 upcoming) including speakers, topics, dates
  - Related Events section (populated from WP events matching fireside/panel criteria)
  - "Why It Matters" section with stats and testimonial quote
  - CTA section with "Join the Conversation" heading
  - DownloadFormDialog component for email-gated download of fireside.pptx
- Created `/home/z/my-project/src/app/api/download/request/route.ts` - API endpoint for download form submissions
- Copied fireside.pptx from upload/ to public/uploads/ for public access
- Updated Navbar navigation links to include "Fireside Chats" between "What We Do" and "Our Partners"
- Updated Footer quick links to include "Fireside Chats"
- Updated Footer "Our Focus" section: changed from simple strings to objects with href, "Policy Engagement" now links to /fireside-chats
- Fixed `getEvents()` return type issue (returns `{ events: WPEvent[] }` not `WPEvent[]`)
- Lint passes cleanly
- Verified both `/` and `/fireside-chats` return HTTP 200
- Agent Browser confirmed page renders correctly with all sections, navigation, and footer

Stage Summary:
- New page created at /fireside-chats route
- fireside.pptx is accessible at /uploads/fireside.pptx
- Download form dialog captures email before allowing download
- Navigation updated in both Navbar and Footer
- All existing functionality preserved (no breaking changes)
- Lint passes, pages render correctly
---
Task ID: 1
Agent: Main Agent
Task: Remove all mock data and use WordPress as sole data source, with offline page when WP is unreachable

Work Log:
- Explored entire codebase to understand data flow: GraphQL client → fetchers → server pages → client components
- Created OfflinePage component at src/components/shared/OfflinePage.tsx with WifiOff icon, "Unable to Load Content" message, Try Again/Back to Home buttons, and contact email
- Rewrote src/graphql/fetchers.ts: removed all mock data imports and fallbacks, changed extractNodes to return [] instead of mock fallback, updated getActivities/getPhilosophy/getOutputs/getPartners to return [] when WP has no data, updated getTeamMembers to return [] instead of mock team, kept getSiteSettings with minimal defaults for site title/description
- Updated src/lib/graphql-client.ts: added 60-second connectivity cache to isWordPressConnected() to avoid redundant health checks, reduced timeout from 10s to 5s
- Updated ALL server page files to check isWordPressConnected() before fetching data, and render OfflinePage when WP is unreachable: page.tsx, about/page.tsx, what-we-do/page.tsx, blog/page.tsx, outputs/page.tsx, partners/page.tsx, projects/page.tsx, publications/page.tsx, events/page.tsx, resources/page.tsx, fireside-chats/page.tsx, gallery/page.tsx, contact/page.tsx, media/page.tsx, and all [slug] detail pages
- Deleted src/graphql/mock-data.ts (1121 lines of mock data removed)
- Added empty state handling to client components: HomePageClient shows "Our activities are being updated" and "Our philosophy is being updated" placeholders when data is empty; WhatWeDoPageClient shows "Activities Coming Soon" with CTA buttons
- Ran lint successfully with no errors
- Verified with Agent Browser: homepage, about, and what-we-do pages all render correctly

Stage Summary:
- All mock data removed - site now uses WordPress exclusively via GraphQL API
- OfflinePage component shows when WordPress is unreachable (check internet connection message)
- 60-second connectivity cache prevents redundant WP health checks
- Empty state placeholders added for sections without WP content yet (activities, philosophy)
- WordPress data flows correctly: team members, blog posts, publications, projects, events, resources all fetch from WP
- The user needs to set up Activities and Philosophy content in WordPress for those sections to populate

---
Task ID: 2
Agent: Main Agent
Task: Make About Us content come from WordPress ACF and use about content for homepage hero section

Work Log:
- Queried WordPress GraphQL API to discover ACF field group: `aboutContent` on Page type with 4 fields: aboutSummary, aboutVision, aboutMission, aboutGoal
- Updated src/types/index.ts: Added `aboutContent` field to WPPage interface with all 4 ACF fields
- Updated src/graphql/queries.ts: Added `aboutContent { aboutSummary aboutVision aboutMission aboutGoal }` to GET_PAGE_BY_SLUG query
- Created getAboutPage() fetcher in src/graphql/fetchers.ts that fetches the about-us page with ACF data, with sensible defaults for missing fields
- Updated src/app/about/page.tsx: Now fetches aboutData via getAboutPage() and passes it as prop
- Updated src/components/pages/AboutPageClient.tsx: Added aboutData prop, replaced hardcoded fallbacks with WordPress ACF data (aboutDescription, aboutVision, aboutMission, aboutGoal all come from WP)
- Updated src/app/page.tsx: Now fetches aboutData and passes to HomePageClient
- Updated src/components/pages/HomePageClient.tsx: Added aboutData prop, hero description now extracts first 1-2 sentences from WP aboutSummary for concise hero text
- Verified with browser: About page shows full aboutSummary from WP, Mission and Goal from WP ACF, Vision shows fallback (WP aboutVision is null - needs to be populated in WP admin), Hero shows first 2 sentences from aboutSummary

Stage Summary:
- About Us page content now fully comes from WordPress ACF fields (aboutContent group)
- Homepage hero description text comes from WordPress aboutSummary (first 1-2 sentences extracted)
- Vision field in WP is currently null - user needs to populate it in WP admin for it to show instead of default
- All 4 ACF fields working: aboutSummary, aboutVision, aboutMission, aboutGoal

---
Task ID: 3
Agent: Main Agent
Task: Implement Contact Us page as standalone (not from WordPress) with full form submission, SMTP config, and admin email notification

Work Log:
- Analyzed existing contact implementation: ContactPageClient, API route, email service, Prisma schema, rate limiter were all partially built
- Removed WordPress connectivity check from contact page (src/app/contact/page.tsx) - page now works independently of WP
- Updated Prisma schema: Added `phone` field to ContactSubmission model, pushed to database successfully
- Added SMTP environment variables to .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, SMTP_FROM_NAME, CONTACT_RECEIVER_EMAIL, SITE_EMAIL
- Completely rewrote ContactPageClient with enhanced features:
  - Removed WP settings dependency - uses standalone CONTACT_INFO constant
  - Added 4 Quick Access contact cards (General Inquiries, Partnerships, Research & Publications, Media & Press)
  - Added Inquiry Type dropdown (Select component) with 9 categories
  - Added Phone Number field
  - Added FAQ section with 6 accordion items
  - Added Quick Response notice card
  - Improved success state with animation and confirmation email message
  - Better character counter for message field
  - Privacy policy link in consent checkbox
- Updated API route (src/app/api/contact/route.ts): Added phone field to Zod schema, database save, and email notification data
- Updated email service (src/lib/email.ts): Added phone number to admin notification HTML and text templates
- Fixed Footer newsletter form: Replaced simulated API call with actual fetch to /api/newsletter endpoint
- Ran lint - passes cleanly
- Verified with Agent Browser: Contact page loads correctly, all sections visible, form submission works (data saved to DB), success state displays

Stage Summary:
- Contact Us page is fully standalone - no WordPress dependency
- Full form pipeline works: validation → database save → email notification attempt
- SMTP config ready in .env (user needs to replace placeholder credentials with real SMTP credentials)
- Admin receives notification at CONTACT_RECEIVER_EMAIL (default: info@gteep.com)
- Sender receives confirmation email at their provided email
- Email sending is non-blocking (graceful degradation if SMTP fails)
- Phone field added to contact form and database
- FAQ section added with 6 common questions
- Footer newsletter now calls real /api/newsletter API

---
Task ID: 4
Agent: Main Agent
Task: Update contact details on contact page to fetch from WordPress ACF contactdetails

Work Log:
- Queried WordPress GraphQL API to discover ACF `contactdetails` field group on Page type
- Found 3 ACF fields: `address` (String), `email` (String), `phoneNumber` (Float)
- Queried the contact-us page to verify data: address="Ikeja Lagos", email="info@gteep.gileadtrust.com", phoneNumber=234
- Updated src/types/index.ts: Added `contactdetails` field to WPPage interface
- Updated src/graphql/queries.ts: Added `contactdetails { address email phoneNumber }` to GET_PAGE_BY_SLUG query
- Created getContactDetails() fetcher in src/graphql/fetchers.ts that fetches from contact-us page ACF with defaults
- Updated src/app/contact/page.tsx: Now fetches contact details from WP and passes as prop
- Updated src/components/pages/ContactPageClient.tsx:
  - Added contactDetails prop interface
  - Replaced hardcoded CONTACT_INFO constant with WP-derived contactEmail, contactPhone, contactAddress
  - Made contact cards dynamic (derive email domain from WP email)
  - FAQ "Email us directly" link now uses contactEmail variable
- Updated src/app/layout.tsx: Fetches contactDetails and passes to Footer component
- Updated src/components/layout/Footer.tsx: Accepts contactDetails prop, displays WP email/address/phone
- Fixed all stale info@gteep.com → info@gteep.gileadtrust.com across: email.ts, privacy/page.tsx, maintenance/page.tsx, OfflinePage.tsx, HomePageClient.tsx, fetchers.ts
- Lint passes, browser verification confirms all 7 checks pass

Stage Summary:
- Contact details (email, address, phone) now come from WordPress ACF contactdetails field group
- WP ACF data flows: contact-us page → getContactDetails() fetcher → contact page & footer
- Contact cards dynamically derive email domain from WP email
- All stale info@gteep.com references replaced with info@gteep.gileadtrust.com
- Footer contact info also pulled from WP ACF (same data, rendered in footer across all pages)
- Note: phoneNumber in WP ACF is stored as Float (currently 234 = Nigeria country code). User may want to store the full phone number in WP admin

---
Task ID: 5
Agent: Main Agent
Task: Switch team member data from WordPress posts (category/tag-based) to ACF fields

Work Log:
- Queried WordPress GraphQL schema to discover existing ACF types: WithAcfAboutContent, WithAcfContactdetails, WithAcfAdminemail — no ACF team member type yet
- Queried current team member posts to verify structure: title=name, tag=role, content=bio, featuredImage=photo, category=group
- Added GET_TEAM_MEMBERS_ACF query to queries.ts — single query using "team" category with ACF teamMember { teamName teamRole teamCategory teamBio teamImage } fields
- Kept existing GET_TEAM_MEMBERS query as fallback (4-category approach)
- Updated WPPost type in types/index.ts: Added optional teamMember ACF fields (teamName, teamRole, teamCategory, teamBio, teamImage)
- Rewrote getTeamMembers() fetcher with ACF-first strategy:
  1. Try ACF query first — if teamMember fields exist and have data, use them
  2. Fall back to category-based query (executive/director/advisory-board/board-of-trustees) if ACF not set up
- Added VALID_TEAM_CATEGORIES constant for ACF teamCategory validation
- Lint passes cleanly
- Browser verification: Homepage and Contact page both load correctly with team members visible

Stage Summary:
- Code is ready for ACF team member fields — will automatically use them when available
- User needs to create ACF field group "Team Member" (GraphQL type: TeamMember) in WordPress with fields: teamName, teamRole, teamCategory, teamBio, teamImage
- User needs to create a "team" category in WordPress and assign team member posts to it
- Current category-based approach continues to work as fallback until ACF is set up
- No breaking changes — smooth transition path

---
Task ID: 6
Agent: Main Agent
Task: Remove non-WordPress pages, rearrange nav/footer, make newsletter functional, add ACF admin email

Work Log:
- Queried WP GraphQL schema: confirmed custom post types (publications, projects, events, resources) don't exist in WP
- Queried WP for existing ACF types: WithAcfAdminemail confirmed with adminEmailForNotification field (value: info.venihost@gmail.com)
- Removed 5 page directories: /projects, /publications, /resources, /events, /maintenance
- Removed 8 client components for deleted pages
- Updated Navbar navLinks: reordered to Home, About Us, What We Do, Our Outputs (dropdown: All Outputs, Fireside Chats, Gallery), Blog, Our Partners, Contact Us
- Updated Footer quickLinks: reordered to match nav (Home, About Us, What We Do, Our Outputs, Fireside Chats, Blog, Our Partners, Contact Us)
- Fixed Footer social icons: replaced BookOpen/Heart with ExternalLink for Facebook/Instagram (brand icons not available in lucide)
- Removed broken /terms link from footer bottom bar, kept only Privacy Policy
- Added GET_ADMIN_EMAIL GraphQL query for ACF adminemail field
- Added getAdminEmail() fetcher with 5-minute cache, fallback to env vars and default
- Updated newsletter API: added admin notification email and subscriber confirmation email (both fire-and-forget)
- Updated contact API: now fetches admin email via getAdminEmail() and passes to sendContactNotification
- Updated email.ts: sendContactNotification accepts optional overrideAdminEmail parameter
- Updated FiresideChatsPageClient: firesideEvents prop is now optional (defaults to empty array)
- Updated FiresideChats page: no longer imports getEvents (doesn't exist in WP)
- Updated SearchPageClient: removed references to /publications, /projects, /events routes
- Lint passes, browser verification confirms all 8 checks pass

Stage Summary:
- 5 pages removed (projects, publications, resources, events, maintenance) — return 404
- Navbar rearranged with dropdown under Our Outputs
- Footer rearranged with correct links and icons
- Newsletter fully functional: DB save + admin email notification + subscriber confirmation
- Admin email fetched from WP ACF adminemail field (currently: info.venihost@gmail.com)
- Contact form uses ACF admin email for notifications
- All deleted routes properly return custom 404 pages

---
Task ID: 1
Agent: Main Agent
Task: Implement What We Do page layout with WP-driven activity sections, Policy Firechat ACF support, dynamic routes

Work Log:
- Queried WordPress GraphQL to discover page hierarchy: What We Do has 6 child pages + Policy Firechat nested under Policy Engagement
- Discovered ACF policyFirechat field group is assigned globally to all pages (same content returned on all child pages)
- Added GET_WHAT_WE_DO_PAGE and GET_ACTIVITY_PAGE GraphQL queries with nested children and policyFirechat ACF fields
- Updated GTEEPActivity type with new fields: databaseId, slug, uri, content, children, policyFirechat
- Added GTEEPActivityChild type for nested sub-pages
- Rewrote getActivities() fetcher to use dedicated WP query with child/nested page support
- Added getActivityPage() fetcher for individual activity detail pages
- Completely redesigned WhatWeDoPageClient with: Programme Areas overview grid, dynamic activity sections from WP, Policy Firechat subsection (only under Policy Engagement), auto-detection of new WP child pages
- Created ActivityDetailClient component for individual activity pages with sidebar, content rendering, sub-programme cards
- Created /what-we-do/[...slug] catch-all dynamic route for both /what-we-do/policy-research and /what-we-do/policy-engagement/policy-firechat
- Updated Navbar: What We Do now has dropdown with All Activities + 6 programme areas
- Updated Footer: Focus areas now link to individual activity pages instead of /what-we-do
- Updated HomePageClient: Activity cards link to individual pages and use content snippets for descriptions
- Fixed lint errors: Replaced getActivityIcon() (component creation during render) with ActivityIcon component
- Fixed Policy Firechat showing on all activities (ACF field is global) by restricting to activity.slug === 'policy-engagement'
- Fixed breadcrumb duplication (PageHeader already adds Home)
- Fixed ActivityDetailClient to use policyFirechat as fallback content when content field is empty

Stage Summary:
- What We Do page fully dynamic from WordPress with 6 activity sections
- New pages added to WP under "What We Do" automatically appear on the site
- Policy Firechat ACF content properly displayed under Policy Engagement only
- Individual activity pages at /what-we-do/[slug] with detail views
- Nested sub-pages supported: /what-we-do/policy-engagement/policy-firechat
- Navbar dropdown shows all 6 programme areas under What We Do
- Footer focus areas link directly to individual programme pages
- All lint checks pass, all pages return 200

---
Task ID: 7
Agent: Main Agent
Task: Update video gallery page under outputs to use ACF data from WordPress

Work Log:
- Queried WordPress GraphQL to discover videoGallery ACF type: single field `firechatEvent` (URL/String)
- Queried WP pages to find Video Gallery page at /our-outputs/video-gallery/ (databaseId 22)
- Updated src/types/index.ts: Added `videoGallery` field to WPPage interface with `firechatEvent` and `videos` repeater support
- Added GET_VIDEO_GALLERY GraphQL query to src/graphql/queries.ts with documentation for ACF repeater extension
- Added `videoGallery { firechatEvent }` to GET_PAGE_BY_SLUG query for future page-level access
- Added GET_VIDEO_GALLERY import and YouTubeVideo type import to src/graphql/fetchers.ts
- Created getVideoGallery() fetcher that: fetches Video Gallery page from WP, extracts YouTube URLs from ACF, enriches each with YouTube oEmbed API, de-duplicates by videoId
- Included commented-out repeater field support code for when user adds ACF Repeater field
- Updated src/app/outputs/page.tsx: Now fetches both outputs and video gallery data, passes videos prop
- Completely rewrote src/components/pages/OutputsPageClient.tsx:
  - Replaced client-side YouTube API fetching with server-side ACF data
  - New ACFVideoCard component with GTEEP Video badge
  - New VideoGallerySection component that receives videos as prop (no useEffect/fetch)
  - Empty state shows helpful instructions for adding videos via ACF
  - Video player dialog preserved for playback
  - Removed Loader2, useEffect, useCallback for video fetching (no longer needed)
- Lint passes cleanly
- Browser verification: Page renders correctly, Video Gallery tab shows ACF video ("The Policy Fireside Chat-Africa: The Gender Backlash"), video card has thumbnail, title, channel name, clickable play button

Stage Summary:
- Video Gallery now fully ACF-driven from WordPress (no YouTube RSS/oEmbed client-side fetching)
- Current ACF: single `firechatEvent` URL field
- To add more videos: user can add ACF Repeater field called `videos` with sub-fields `videoUrl`, `videoTitle`, `videoDescription`
- Server-side oEmbed enrichment happens during page render (5-min ISR cache)
- Empty state provides instructions for WordPress admin setup
- All other output tabs (Concept Notes, Policy Briefs, etc.) still work as before

---
Task ID: 8
Agent: Main Agent
Task: Link downloadable files from ACF to outputs page, create cross-links between activity pages and output tabs, implement policy firechat related outputs

Work Log:
- Discovered `OurOutputDownloadables` ACF field group on Post type with 5 URL fields pointing to downloadable files
- Queried WordPress media library to confirm file types: 3 DOCX, 2 PPTX files
- Added `GET_OUTPUT_DOWNLOADABLES` GraphQL query to fetch ACF download URLs from posts
- Created `getOutputDownloadables()` fetcher with `DOWNLOADABLE_FIELD_MAP` that maps each ACF field to:
  - outputType (which tab on Outputs page: concept-note, knowledge-product, etc.)
  - title (human-readable)
  - relatedActivity (which activity page it relates to, e.g. 'policy-engagement')
  - relatedSubActivity (which child page, e.g. 'policy-firechat')
- Updated `GTEEPOutput` type with `relatedActivity`, `relatedSubActivity`, `fileType` fields
- Updated outputs page to fetch and merge downloadables with existing outputs
- Created `DownloadableCard` component with file type icon, extension badge, firechat badge, download button
- Added `?tab=concept-note` URL parameter support via `useSearchParams` in OutputsPageClient
- Wrapped outputs page in Suspense for useSearchParams compatibility
- Updated ActivityDetailClient with `relatedOutputs` prop and "Related Outputs" section
- Added "View Related Outputs" button in Policy Firechat section linking to /outputs?tab=concept-note
- Updated activity page server component to fetch downloadables and filter by activity slug
- Updated FiresideChatsPageClient with `relatedOutputs` prop and "Policy Firechat Outputs" section
- Added "View All Concept Notes" button linking to /outputs?tab=concept-note
- Fixed lint errors: render-time component creation, setState-in-effect
- Browser verification: All 4 key pages work correctly with proper cross-linking

Stage Summary:
- 5 ACF downloadable files now appear on the Outputs page (4 under Concept Notes tab, 1 under Knowledge Products)
- Files without a specific output sub-page (e.g. "Graphics on Book Talk") appear under their mapped tab + "All"
- Policy Engagement activity page shows "Related Outputs" section with 4 firechat-related downloadables
- Fireside Chats page shows "Policy Firechat Outputs" section with download cards
- Cross-linking: Activity page → /outputs?tab=concept-note, Fireside Chats → /outputs?tab=concept-note
- URL deep-linking supported: /outputs?tab=concept-note opens directly to that tab
- All download buttons link directly to the WordPress-hosted files

---
Task ID: 9
Agent: Main Agent
Task: Transfer the project to GLM-5.2 — Add AI chatbot powered by GLM-5.2 via z-ai-web-dev-sdk

Work Log:
- Explored project to understand existing AI/LLM integration status (none found — z-ai-web-dev-sdk was installed but unused)
- Read z-ai-web-dev-sdk type definitions to understand API: CreateChatCompletionBody with optional model field, ChatMessage with role/content
- Invoked LLM Skill for SDK usage documentation
- Created backend API route at src/app/api/chat/route.ts:
  - Uses z-ai-web-dev-sdk with model: 'glm-5.2'
  - GTEEP-specific system prompt with domain knowledge about programmes, activities, research, fireside chats
  - Conversation history support (last 10 messages for context)
  - Rate limiting (20 messages per minute per IP)
  - Input validation (required message, max 2000 chars)
  - ZAI instance reuse (module-level cache)
  - Error handling with user-friendly messages
- Created AI Chat Widget component at src/components/features/AIChatWidget.tsx:
  - Floating emerald-green chat button (bottom-right, all pages)
  - Animated chat panel (540px height, 380px width)
  - Welcome screen with bot avatar and 4 suggested prompts
  - Message bubbles with user/assistant avatars
  - Basic markdown rendering (bullet points, bold text, numbered lists)
  - Loading indicator ("Thinking...")
  - Scroll-to-bottom button for long conversations
  - Clear chat button
  - Textarea input with Enter-to-send, Shift+Enter for newline
  - Disclaimer text ("AI responses may not always be accurate")
  - Framer Motion animations for open/close
- Integrated chat widget into root layout (src/app/layout.tsx):
  - Added AIChatWidget import
  - Placed component inside ContentProtection wrapper alongside ScrollToTop
  - Appears on all pages (including maintenance mode bypass)
- Lint passes cleanly (zero errors)
- Browser verification: All 9 checks pass
  - Homepage loads correctly
  - Chat button visible (floating, green, bottom-right)
  - Chat panel opens with "GTEEP Assistant" header and "Powered by GLM-5.2" subtitle
  - 4 suggested prompts visible and functional
  - AI responds with relevant GTEEP information when prompts clicked
  - Chat works on /about page as well
  - Homepage layout intact (navbar, hero, footer all present)

Stage Summary:
- GTEEP website now has an AI assistant powered by GLM-5.2
- Chat widget appears on all pages via root layout integration
- Backend uses z-ai-web-dev-sdk with model: 'glm-5.2' for chat completions
- System prompt provides GTEEP-specific domain knowledge for contextual responses
- Rate limiting protects against abuse (20 msgs/min/IP)
- Conversation history maintained for multi-turn dialogue (last 10 messages)
- All existing functionality preserved (no breaking changes)

---
Task ID: 10
Agent: Main Agent
Task: Remove non-WordPress content, redirect Firechat nav to /what-we-do/policy-engagement/policy-firechat

Work Log:
- Found FiresideChatsPageClient.tsx was entirely hardcoded (4 static episodes, "How It Works", "Why It Matters", stats, quotes) — none from WordPress API
- The real WP-driven firechat page already existed at /what-we-do/policy-engagement/policy-firechat via ActivityDetailClient (renders ACF policyFirechat content)
- Updated Navbar: Changed Firechat href from /fireside-chats to /what-we-do/policy-engagement/policy-firechat
- Updated Footer: Changed Fireside Chats href from /fireside-chats to /what-we-do/policy-engagement/policy-firechat
- Updated ActivityDetailClient: Changed "View Fireside Chats" button link from /fireside-chats to /what-we-do/policy-engagement/policy-firechat
- Updated WhatWeDoPageClient: Changed "View Fireside Chats" button link from /fireside-chats to /what-we-do/policy-engagement/policy-firechat
- Updated not-found.tsx: Changed Fireside Chats href from /fireside-chats to /what-we-do/policy-engagement/policy-firechat
- Removed /src/app/fireside-chats/ directory (hardcoded standalone page)
- Removed /src/components/pages/FiresideChatsPageClient.tsx (979 lines of hardcoded content)
- Verified no remaining references to /fireside-chats in codebase
- Lint passes cleanly
- Browser verification: All 6 checks pass
  - "Firechat" nav item links to /what-we-do/policy-engagement/policy-firechat
  - Policy Firechat page loads with WordPress ACF content
  - /fireside-chats returns 404 (old page removed)
  - Footer links correctly updated
  - What We Do page links correctly updated

Stage Summary:
- Removed all hardcoded fireside-chats content (was NOT from WordPress API)
- Firechat in nav now links to /what-we-do/policy-engagement/policy-firechat (WP-driven)
- 5 link references updated across: Navbar, Footer, ActivityDetailClient, WhatWeDoPageClient, not-found.tsx
- Old /fireside-chats route removed entirely (979 lines of hardcoded content deleted)
- All content now comes from WordPress API via ActivityDetailClient

---
Task ID: 11
Agent: Main Agent
Task: Make all documents on firechat and output pages view-only (no download)

Work Log:
- Created DocumentViewer component at src/components/features/DocumentViewer.tsx:
  - Full-screen modal with iframe-based document rendering
  - PDFs: rendered directly in browser iframe
  - PPTX/DOCX/XLSX: rendered via Google Docs Viewer (embedded, read-only)
  - Header bar with document title, file type badge, "Read Only" indicator
  - Footer: "View Only — Downloading is not available"
  - Loading state with spinner while document loads
  - Close button in header + "Close Viewer" button in footer
  - sandbox attribute on iframe for security
- Created ViewDocumentButton component (same file) as reusable trigger:
  - Two variants: full button (with "View DOCX" text) and icon-only (eye icon)
  - Opens DocumentViewer modal on click
  - Prevents event propagation (works inside clickable cards)
- Updated OutputsPageClient.tsx:
  - Replaced Download import with Eye import
  - Added ViewDocumentButton import
  - DownloadableCard: "Download PPTX" → "View PPTX" (ViewDocumentButton)
  - OutputCard: "Download" link → "View" (ViewDocumentButton, size="sm")
  - Empty state text: "No download available" → "No document available"
- Updated ActivityDetailClient.tsx:
  - Replaced Download import with Eye import
  - Added ViewDocumentButton import
  - Related Outputs section: Download icon button → Eye icon (ViewDocumentButton, iconOnly)
  - Description: "Downloadable files" → "Documents"
- Lint passes cleanly
- Browser verification: All checks pass
  - /outputs page: All 5 cards show "View DOCX/PPTX" buttons with eye icons
  - Clicking View opens read-only document viewer (Google Docs Viewer iframe)
  - Viewer shows "Read Only" and "View Only — Downloading is not available"
  - /what-we-do/policy-engagement/policy-firechat: Related Outputs use eye icon view buttons
  - No download buttons anywhere on these pages

Stage Summary:
- Documents on firechat and output pages are now view-only (cannot be downloaded)
- DocumentViewer uses Google Docs Viewer for PPTX/DOCX, browser PDF viewer for PDFs
- Replaced all Download buttons with View buttons (eye icon)
- Both OutputsPageClient and ActivityDetailClient updated
- 3 new components: DocumentViewer, ViewDocumentButton (full + iconOnly variants)

---
Task ID: 3
Agent: Main Agent
Task: Rename "Concept Notes" tab to "Knowledge Products" on Our Outputs page & Add team member lightbox modal on Home/About pages

Work Log:
- Read OutputsPageClient.tsx and identified the "Concept Notes" tab (value: 'concept-note') and the separate "Knowledge Products" tab (value: 'knowledge-product')
- Removed 'concept-note' from tabDefs, keeping only 'knowledge-product' with label "Knowledge Products"
- Updated filteredOutputs logic to merge concept-note items into knowledge-product tab when that tab is selected
- Updated tabCounts to merge concept-note count into knowledge-product count
- Updated getOutputTypeLabel('concept-note') to return 'Knowledge Product'
- Updated getOutputTypeIcon('concept-note') to use BookOpen (matching knowledge-product)
- Updated getOutputTypeBadgeColor('concept-note') and getOutputTypeBgGradient('concept-note') to match knowledge-product styling
- Created /home/z/my-project/src/components/features/TeamMemberModal.tsx — lightbox-style popup with:
  - Framer Motion AnimatePresence animation (fade + scale)
  - Gradient header with decorative circles and category badge
  - Large avatar overlapping header/content
  - Full name, role, and complete bio (not truncated)
  - Close via X button, overlay click, or Escape key
  - Body scroll lock when modal is open
- Updated HomePageClient.tsx:
  - Added import for TeamMemberModal
  - Added useState for selectedMember
  - Added cursor-pointer and onClick handlers to all team cards (executive, directors, advisory board, trustees)
  - Added "View profile →" hint text that appears on hover
  - Added line-clamp to executive bio for consistency
  - Added TeamMemberModal component at end of JSX
- Updated AboutPageClient.tsx:
  - Added useState import and TeamMemberModal import
  - Added useState for selectedMember
  - Added cursor-pointer and onClick handlers to all team cards (executive, directors, advisory board, trustees)
  - Added "View profile →" hint text that appears on hover
  - Added TeamMemberModal component at end of JSX
- Ran lint — passed clean
- Verified via Agent Browser: Knowledge Products tab works with 5 items, modal opens/closes correctly on both Home and About pages

Stage Summary:
- "Concept Notes" tab removed from Our Outputs page, items merged into "Knowledge Products"
- Team member lightbox modal created and integrated on both Home and About pages
- All team cards are now clickable with hover hints and open a beautiful modal showing full bio

---
Task ID: 4
Agent: Main Agent
Task: Multiple homepage and site-wide updates - Philosophy, Activities, Partners/Blog removal, Fireside Chat, About page

Work Log:
- Updated Our Philosophy section on home page to show Mission, Vision, Goal cards from WordPress ACF data (aboutMission, aboutVision, aboutGoal) with Target, Eye, TrendingUp icons
- Added ACTIVITY_ORDER constant to enforce consistent ordering: Policy Research → Policy Engagement → Citizen Enlightenment → Data Speaks → Youth Mentoring → Women's Economic Livelihood → Our Publication
- Added sortedActivities useMemo in HomePageClient and WhatWeDoPageClient
- Added "Our Publication" to Navbar (under What We Do dropdown), Footer focus areas, and fetcher icon mappings
- Added BookOpen icon mapping for 'our-publication' slug in fetchers.ts and activity icon maps
- Removed "Our Partners" section (Section 8) entirely from home page
- Removed "From Our Blog" section (Section 9) entirely from home page
- Updated hero section CTAs: Primary → "Join Fireside Chat" (with Flame icon, links to /what-we-do/policy-engagement/policy-firechat), Secondary → "Explore Our Work" (links to /what-we-do)
- Created new Fireside Chat section on home page with "Where Policy Meets Practice" heading, 3 feature highlights (Expert-Led Conversations, Actionable Insights, Inclusive Dialogue), gradient visual card, and CTA buttons
- Changed "Our Leadership" to "Our Team" on About page (badge and heading)
- Updated description text for the team section on About page
- All lint checks passed, Agent Browser verified all 7 changes

Stage Summary:
- Philosophy section now shows Mission/Vision/Goal from ACF + additional WP philosophy items
- Activities are consistently ordered across Home, What We Do, Navbar, and Footer
- Partners and Blog sections removed from home page
- Fireside Chat section added with engaging visual design
- Hero CTAs now drive traffic to fireside chat page
- About page uses "Our Team" instead of "Our Leadership"
---
Task ID: 1
Agent: main
Task: Multiple site restructuring changes - About page, Policy Engagement tabs, Video gallery move, Header menu restructure

Work Log:
- Removed "Our Direction" section from AboutPageClient.tsx (Vision, Mission, Goal cards)
- Merged Vision, Mission, Goal content into "Our Philosophy" section on About page
- Added id="philosophy" and id="team" anchor IDs to About page sections
- Re-arranged Navbar menu to: Home, About Us, Our Philosophy (/about#philosophy), Who We Are (/about#team), What We Do (dropdown), Fireside Chat, Our Output, Contact Us (button)
- Updated Footer quickLinks to match new menu structure
- Removed Blog and Our Partners from nav and footer
- Added event tabs (Overview | Events) to Policy Engagement page in ActivityDetailClient.tsx
- Events tab shows Fireside Chat as a recurring event card with link to firechat page
- Added video gallery to Policy Fireside Chat page (moved from Outputs page)
- Removed Video Gallery tab from OutputsPageClient.tsx
- Added VideoGallery and RelatedOutputs helper components to ActivityDetailClient.tsx
- Updated activity page.tsx to fetch and pass videos data to ActivityDetailClient
- Updated outputs/page.tsx to not fetch videos data anymore

Stage Summary:
- About page: "Our Direction" section removed, Vision/Mission/Goal merged into "Our Philosophy" section
- About page: Added #philosophy and #team anchor IDs for nav linking
- Policy Engagement page: Now has Overview/Events tabs, Events shows fireside chat event card
- Policy Fireside Chat page: Now has video gallery with YouTube videos from WordPress ACF
- Outputs page: Video Gallery tab removed
- Navbar: New structure with Our Philosophy, Who We Are, Fireside Chat, Our Output
- Footer: Updated quick links to match new nav structure
- All lint checks pass, dev server running without errors

---
Task ID: 2
Agent: Main Agent
Task: Fix viewable files on fireside chat and outputs pages + add carousel to home page + rename Firechat to Fireside Chat

Work Log:
- Diagnosed why document files weren't showing: GraphQL query used `firechatDevelopmentConversationsWebsite` but WordPress ACF field is actually `whatIsFiresideChat`
- Fixed `GET_OUTPUT_DOWNLOADABLES` query in `src/graphql/queries.ts` with correct field name
- Updated `DOWNLOADABLE_FIELD_MAP` and `DownloadablesData` interface in `src/graphql/fetchers.ts`
- Verified fireside chat page now shows 4 related outputs with View buttons
- Verified outputs page now shows 5 documents in Knowledge Products tab
- Replaced static "Featured Outputs" section on home page with carousel slider showing all output files
- Added `OutputsCarousel` component with left/right arrow navigation, edge fade gradients, and mobile arrows
- Added `getOutputDownloadables()` to home page data fetching (`src/app/page.tsx`)
- Updated Outputs page: renamed "Firechat" badge to "Fireside Chat" and made it a clickable link to `/what-we-do/policy-engagement/policy-firechat`
- Updated "Related: Policy Firechat" text to "Related: Policy Fireside Chat"
- Added `.scrollbar-hide` CSS utility class for carousel
- All lint checks pass, dev server running without errors

Stage Summary:
- Fireside chat page: Shows 4 related output documents (Development Conversations Website, Gender Backlash Architecture, Oluponna Gender Backlash Response, Policy Fireside Chat Outcomes & Next Steps)
- Outputs page: Shows 5 documents with clickable "Fireside Chat" badges linking to firechat page
- Home page: "Our Outputs" section replaced with horizontal carousel with arrow navigation showing all 5 output files
- Badge labels changed from "Firechat" to "Fireside Chat" everywhere

---
Task ID: 3
Agent: Main Agent
Task: Restore viewable files - WordPress admin moved ACF field group from Post to Page type

Work Log:
- Investigated why viewable files disappeared from fireside chat and outputs pages
- Checked WordPress GraphQL schema and found `ourOutputDownloadables` field was REMOVED from the `Post` type
- Verified the field is now on the `Page` type (ACF field group location rule was changed from "Post Type = Post" to "Post Type = Page")
- Confirmed the data still exists by querying the `/our-outputs/` page directly via GraphQL
- Updated `GET_OUTPUT_DOWNLOADABLES` query in `src/graphql/queries.ts`:
  - Changed from `posts(first: 1)` query to `page(id: "/our-outputs/", idType: URI)` query
  - Removed `$first` variable parameter (no longer needed for single page query)
- Updated `DownloadablesData` interface in `src/graphql/fetchers.ts`:
  - Changed shape from `{ posts: { nodes: [...] } }` to `{ page: { ... } }`
- Updated `getOutputDownloadables()` function:
  - Removed the `first: 1` parameter from fetchGraphQL call
  - Changed data access from `response.data.posts.nodes[0]` to `response.data.page`
  - Updated error checks accordingly
- Lint passes, dev server responding 200 on all routes
- Verified via Agent Browser: All 3 pages now show viewable files again

Stage Summary:
- Root cause: WordPress admin changed the ACF "OurOutputDownloadables" field group location rule from Post type to Page type
- Fix: Updated GraphQL query to fetch from `page(id: "/our-outputs/")` instead of `posts(first: 1)`
- Fireside chat page: 4 related output documents restored with View buttons
- Outputs page: 5 documents restored in Knowledge Products tab
- Home page: 5 document cards in carousel section restored

---
Task ID: 4
Agent: Main Agent
Task: Implement Follow the Money upcoming event under Fireside Chat with registration link and ACF files

Work Log:
- Investigated WordPress GraphQL schema to find Follow the Money ACF field group
- Discovered new ACF type "FollowTheMoney" with 2 fields:
  - followTheMoneyBriefForRegistration (Concept-brief-for-registration.docx)
  - followTheMoneyFullConceptNote (Concept-Note-05-01-fin.docx)
- Field group is attached to the Post type (location rule: Post Type = Post)
- Verified both file URLs return 200 with valid content
- Added `FollowTheMoneyFiles` type to `src/types/index.ts`
- Added `GET_FOLLOW_THE_MONEY_FILES` GraphQL query to `src/graphql/queries.ts`
- Added `getFollowTheMoneyFiles()` fetcher function to `src/graphql/fetchers.ts`
- Updated `src/app/what-we-do/[...slug]/page.tsx` to fetch Follow the Money data in parallel
- Updated `ActivityDetailClient` component:
  - Added `followTheMoney` prop to interface
  - Added new `FollowTheMoneyEventSection` component with:
    - Event banner (gradient amber) with "Follow the Money" title
    - Event meta: July 25, 2026, Session 2, Under Policy Fireside Chat
    - "Registration Link: Follow the Money" caption
    - "Register Now" button linking to https://forms.gle/2KKU6bGEjewBQ7xDA with target="_blank"
    - Event Documents section with 2 file cards (Brief for Registration, Full Concept Note)
    - Each file card has a View button (read-only document viewer)
  - Added `EventFileCard` helper component
  - Inserted FollowTheMoneyEventSection into the policy-firechat page between intro content and videos
- Verified via Agent Browser: All 8 checks PASS
  - Event title "Follow the Money" present
  - Date "July 25, 2026" shown
  - "Registration Link: Follow the Money" caption present
  - Register Now button with correct href and target="_blank"
  - 2 file cards with correct titles
  - View buttons present on file cards

Stage Summary:
- New ACF field group "FollowTheMoney" integrated (files come from WordPress only, no hardcoded file URLs)
- Event title, date, and registration link are configured per user spec (event metadata not in WordPress, so title/date/registration URL are hardcoded in component)
- Registration link opens in new tab (target="_blank" rel="noopener noreferrer")
- Event displays on Fireside Chat page as "Upcoming Fireside Chat Event"
- Both attached files (Brief for Registration + Full Concept Note) come from WordPress ACF
- All lint checks pass, dev server running without errors

---
Task ID: 5
Agent: Main Agent
Task: Fix About Us page summary to come from WordPress page editor (page.content) instead of stale ACF aboutSummary field

Work Log:
- User reported that the content displayed on the About Us page ("Africa's economic transformation...") was NOT coming from the WordPress ACF `about_content` / `about_summary` field as they expected
- Investigated by querying WordPress directly: discovered the About Us page (slug "about-us", URI "/") has TWO separate content sources:
  1. `page.content` (main WordPress block editor) — UPDATED content with wording like "problems" (not "terrain"), "locationally" (not "locational"), "mentally and physiologically" (not just "physiologically"), "tapping into" (not "digging into"), plus a 2nd paragraph "GTEEP works to meet these needs..."
  2. `aboutContent.aboutSummary` (ACF field) — STALE old content with "terrain", "locational", "physiologically", "digging into", single paragraph only
- Root cause: `getAboutPage()` in `src/graphql/fetchers.ts` was using `page.aboutContent.aboutSummary` (the stale ACF field) as the primary source. The site admin had updated the WordPress page editor (page.content) with newer wording but the website was still showing the old ACF content.
- Verified via Agent Browser before fix: website displayed OLD content matching the ACF aboutSummary exactly
- Added `htmlContentToParagraphs()` helper in `src/graphql/fetchers.ts` that:
  - Extracts text from `<p>...</p>` tags in the WordPress HTML content
  - Strips inner HTML tags and decodes common HTML entities (&nbsp;, &amp;, &quot;, &#8217;, &#8211;, etc.)
  - Joins paragraphs with "\n\n" so the existing rendering logic in AboutPageClient.tsx (which splits on "\n\n") keeps working unchanged
- Updated `getAboutPage()`:
  - PRIMARY source: `page.content` (WordPress page editor) → parsed via `htmlContentToParagraphs()`
  - FALLBACK 1: `page.aboutContent.aboutSummary` (ACF, for backwards compatibility)
  - FALLBACK 2: hardcoded defaults
  - Vision / Mission / Goal still come from the ACF `aboutContent` group (unchanged)
- Lint passes, dev server running without errors
- Verified via Agent Browser after fix: About Us page now displays the UPDATED WordPress page editor content (with "problems", "locationally", "mentally and physiologically", "tapping into", plus the 2nd paragraph "GTEEP works to meet these needs...")
- Verified Vision / Mission / Goal sections still render correctly from ACF

Stage Summary:
- About Us page summary now sourced from the WordPress page editor (page.content) — the canonical source the site admin edits
- ACF `aboutContent.aboutSummary` kept as a fallback only (no longer the primary source)
- Edits made to the About Us page in WordPress will now reflect on the website immediately (300s ISR)
- HTML-to-paragraphs parser handles WordPress block editor output (<p class="wp-block-paragraph">...</p>) cleanly
- Vision, Mission, Goal unchanged (still from ACF `aboutContent` group)

---
Task ID: 6
Agent: Main Agent
Task: Remove specified content from fireside chat and policy engagement pages

Work Log:
- User requested removal of three pieces of content:
  1. Fireside chat page header: "What We Do" subtitle + "GTEEP's Policy Fireside chat programme — driving evidence-based policy change across Africa." description
  2. Policy engagement page Overview tab: "Content Coming Soon / Detailed information about our policy engagement programme is being developed. Check back soon for updates." fallback (shown because WP page content is null)
  3. Policy engagement page header: "What We Do" subtitle + "GTEEP's Policy Engagement programme — driving evidence-based policy change across Africa." description
- Located all three in `src/components/pages/ActivityDetailClient.tsx`
- Added `hideHeaderSubtitle` flag in the main component: true when `activity.slug` is `policy-engagement` OR `policy-firechat`
- Updated the `<PageHeader>` call to pass `subtitle={undefined}` and `description={undefined}` when `hideHeaderSubtitle` is true (PageHeader already conditionally renders these only when truthy)
- Removed the "Content Coming Soon" fallback block from the policy-engagement Overview tab; now renders `<WpContent>` only when `activity.content` is present, plus related outputs
- Other activity pages (policy-research, citizen-enlightenment, etc.) still show the "What We Do" subtitle + description as before (unchanged)
- Verified via Agent Browser:
  - Fireside chat page (`/what-we-do/policy-engagement/policy-firechat`): header now shows only breadcrumb + H1 "Policy Fireside chat"; no subtitle, no description. Follow the Money event, videos, and related outputs still render below.
  - Policy engagement page (`/what-we-do/policy-engagement`): header now shows only breadcrumb + H1 "Policy Engagement"; Overview tab shows Related Outputs only (no "Content Coming Soon"); Events tab still works and links to the fireside chat.
  - Confirmed via JS eval on both pages: "Content Coming Soon", "Detailed information about our policy engagement programme is being developed", "GTEEP's Policy Engagement programme", and "GTEEP's Policy Fireside chat programme" are ALL absent.
- Lint passes, dev server clean (all routes 200)

Stage Summary:
- Fireside chat page: header subtitle "What We Do" and the "GTEEP's Policy Fireside chat programme — driving evidence-based policy change across Africa." description removed
- Policy engagement page: "Content Coming Soon / Detailed information..." fallback removed from Overview tab (now shows Related Outputs only when WP content is empty); header subtitle and description also removed
- Other activity detail pages are unchanged (still show the generic "What We Do" subtitle + description)
- Events tab on policy engagement page still functions correctly

---
Task ID: 7
Agent: Main Agent
Task: Remove all non-WordPress content, update hero to WP about summary, simplify policy engagement page, create event accordion on fireside chat page

Work Log:
- User directive: "any content that did not come from wordpress remove leave it blank don't write anything. all the sub headline in sections remove it."
- Specific asks:
  1. Hero section on home page → use about summary from WordPress ACF
  2. Policy engagement page → just list Policy Fireside Chat, remove Overview/Events tabs
  3. Fireside chat page → create event accordion (Gender Backlash, Follow the Money)
  4. Remove all non-WordPress content and sub-headlines

HOME PAGE (HomePageClient.tsx):
- Hero section: Replaced truncated getHeroDescription() with full aboutData.aboutSummary (both paragraphs from WP, split on \n\n). Removed hardcoded badge "Economic Empowerment & Policy Research" and subtitle "Gilead Trust Economic Empowerment Project". Kept H1 "GTEEP" and CTA buttons (functional navigation).
- Section 2 (Our Activities): Removed Badge "What We Do" and description "Driving evidence-based policy change...". Removed hardcoded fallback "Learn more about our X programme." on activity cards (now blank if no WP description). Removed "Our activities are being updated. Check back soon!" empty-state text.
- Section 3 (Our Philosophy): Removed Badge "Our Philosophy" and description "The core principles...".
- Section 4 (Who We Are): Removed Badge "Our Team" and description "A dedicated team...".
- Section 5 (Advisory Board): Removed Badge "Advisory Board" and description "Distinguished experts...".
- Section 6 (Board of Trustees): Removed Badge "Board of Trustees" and description "Providing governance oversight...".
- Section 7 (Outputs Carousel): Removed Badge "Our Work" and description "Browse our research outputs...".
- Section 8 (Fireside Chat): Removed ALL hardcoded content (Badge "Fireside Chat", H2 "Where Policy Meets Practice", description, feature highlights with "Expert-Led Conversations"/"Actionable Insights"/"Inclusive Dialogue", visual card with "Policy Fireside Chat"/"Bridging evidence and action..."/"Live Dialogue"/"Expert Panels"/"Policy Impact"). Kept only the 2 CTA buttons (functional navigation to firechat page and outputs page).
- Section 9 (Stay Connected): Removed H2 "Stay Connected", description "Subscribe to our newsletter...", and "We respect your privacy. Unsubscribe at any time." Kept newsletter form and contact info (from WP settings).
- Removed unused imports: Sparkles, MessageCircle.

POLICY ENGAGEMENT PAGE (ActivityDetailClient.tsx):
- Removed the entire Tabs structure (Overview/Events tabs).
- Replaced with a simple listing: WP content (if any) + sub-programme cards (Policy Fireside Chat) using child.title from WP + Related Outputs.
- Removed hardcoded "Policy Engagement Events" heading, "Our events bring together experts..." description, "Recurring Event" badge, "Development Conversations" subtitle, "Our Policy Fireside Chat brings together leading experts..." description, "More events will be added as they are scheduled." placeholder.
- The firechat card now shows only the WP-sourced title (child.title) and a "View {title}" navigation link.

FIRESIDE CHAT PAGE (ActivityDetailClient.tsx):
- Created new EventAccordion component with two accordion items:
  1. "Gender Backlash" (collapsed by default) — contains:
     - VideoGallery (YouTube video from WP videoGallery ACF)
     - Gender-backlash-related output files (filtered by title keywords: gender/backlash/oluponna) from WP ACF ourOutputDownloadables
  2. "Follow the Money" (expanded by default) — contains:
     - "July 25, 2026" date badge (user-specified)
     - "Registration Link: Follow the Money" caption + "Register Now" button (links to https://forms.gle/2KKU6bGEjewBQ7xDA, target="_blank" rel="noopener noreferrer")
     - File cards from WP ACF followTheMoney fields (briefForRegistration, fullConceptNote) — titles derived from WP filenames via titleFromFilename() helper
- Removed ALL hardcoded content from the old FollowTheMoneyEventSection:
  - "Upcoming Fireside Chat Event" heading
  - "Our next policy conversation" sub-text
  - "Upcoming Event" badge
  - "Policy Fireside Chat — Development Conversations" subtitle
  - "Fireside Chat Session 2" meta
  - "Under Policy Fireside Chat" meta
  - "Building on the success of our first Fireside Chat..." description paragraph
  - "Register to attend the upcoming Fireside Chat event." sub-text
  - "Event Documents" heading
  - File card descriptions ("Short overview of the Follow the Money event...", "Complete concept note detailing the theme, scope, and objectives...")
- Removed separate "Fireside Chat Videos" section (videos now inside Gender Backlash accordion)
- Removed "Watch our recorded policy conversations" sub-text
- Removed "No videos available yet" / "Videos from our Fireside Chat sessions will appear here..." fallback
- Non-event-specific related outputs (Development Conversations Website, Policy Fireside Chat Outcomes & Next Steps) remain in RelatedOutputs section below the accordion
- Added titleFromFilename() helper to derive readable titles from WordPress file URLs (replaces hardcoded file titles)
- Updated EventFileCard to not require a description prop (descriptions were hardcoded, now removed)

OTHER CLEANUP (ActivityDetailClient.tsx):
- RelatedOutputs: Removed "Documents related to this programme" sub-headline
- Default activity pages: Removed "Content Coming Soon" / "Detailed information about our X programme is being developed..." fallback
- Children Sub-Pages section: Removed "Sub-Programmes under {activity.title}" heading
- Child page cards: Removed hardcoded badge labels ("🔥 Firechat" / "Sub-Programme")
- VideoGallery: Removed hardcoded "Fireside Chat" badge on video thumbnails
- Sidebar: Removed "GTEEP Programme" badge, "Sub-Programmes" heading, "Explore" heading
- Removed unused imports: Tabs, TabsList, TabsTrigger, TabsContent, Plus, Clock, MapPin

VERIFICATION (Agent Browser):
- Home page hero: Shows H1 "GTEEP" + full about summary (both paragraphs from WP) + CTA buttons. No badge, no subtitle. ✓
- Home page sections: All Badge sub-headlines and description paragraphs removed. Confirmed via JS eval. ✓
- Policy engagement page: No tabs, just lists "Policy Fireside chat" card with WP-sourced title + Related Outputs. ✓
- Fireside chat page: Event accordion with "Gender Backlash" (contains video + 2 gender backlash outputs from WP) and "Follow the Money" (contains registration link + 2 ACF files). ✓
- Register Now link: href=https://forms.gle/2KKU6bGEjewBQ7xDA, target=_blank, rel=noopener noreferrer ✓
- All old hardcoded content confirmed removed via JS eval (12 checks all "REMOVED"). ✓
- Lint passes, dev server clean (all routes 200).

Stage Summary:
- Home page hero now shows the full WordPress about summary (both paragraphs) — no hardcoded badge or subtitle
- All section Badge sub-headlines and description paragraphs removed from home page
- Policy engagement page simplified: no tabs, just lists the Policy Fireside Chat sub-programme
- Fireside chat page now has an event accordion with Gender Backlash (past event: video + outputs from WP) and Follow the Money (upcoming event: registration link + ACF files from WP)
- All descriptive text content now comes from WordPress; only functional navigation labels (button text, link text) and user-specified event metadata (title, date, registration URL for Follow the Money) remain hardcoded
- File titles for Follow the Money ACF files are derived from the WordPress filenames (not hardcoded)

---
Task ID: 8
Agent: About Us Cleanup Agent
Task: Remove all non-WordPress content from About Us page

Work Log:
- Read worklog.md to understand the pattern established by Tasks 6 and 7 (removing non-WordPress content / sub-headlines / hardcoded marketing copy)
- Read the full AboutPageClient.tsx (642 lines) and the PageHeader component to confirm subtitle/description are conditionally rendered only when truthy
- Used MultiEdit to make 16 atomic edits to /home/z/my-project/src/components/pages/AboutPageClient.tsx:
  1. Removed `import { Badge } from '@/components/ui/badge';` (Badge no longer used anywhere after removals)
  2. PageHeader: changed `subtitle="Gilead Trust Economic Empowerment Project"` → `subtitle={undefined}` and `description="Evidence-driven policy analysis for socially inclusive development in Africa."` → `description={undefined}` (matching the pattern from Task 6)
  3. About Section: removed `<Badge>About Us</Badge>` and `<h2>Gilead Trust Economic Empowerment Project</h2>`; kept the gradient divider, the `aboutDescription.split('\n\n')` WordPress paragraphs, and the two CTA buttons ("Our Activities" with ArrowRight, "Contact Us" with Mail) as functional navigation labels
  4. About Section visual: removed the centered overlay text block (`<Handshake>` icon + "GTEEP" heading + "Gilead Trust Economic Empowerment Project" paragraph) but kept the Image, the gradient overlay, and the decorative blurred circles
  5. Philosophy Section: removed `<Badge>Our Philosophy</Badge>`, `<h2>Our Philosophy</h2>`, and the description `<p>` "Our vision, mission, goal and the core principles..." (left the wrapping `<div className="text-center mb-16"></div>` empty)
  6. Vision / Mission / Goal cards: removed the three `<h3>` headings ("Our Vision", "Our Mission", "Our Goal") while keeping the card containers, the Eye/Target/Crosshair icons, and the WordPress `{aboutVision}` / `{aboutMission}` / `{aboutGoal}` paragraphs
  7. Leadership Section: removed `<Badge>Our Team</Badge>`, `<h2>Our Team</h2>`, and the description `<p>` "A dedicated team of researchers, policy analysts, and development practitioners..."
  8. Executive Director card: removed the `<Badge>Executive Director</Badge>` element and the "Click to view full profile →" hover span; kept avatar, name (h3), role, bio, onClick handler
  9. Directors card: removed the `<Badge variant="secondary">Director</Badge>` element and the "View full profile →" hover span; kept avatar, name (h3), role, bio, onClick
  10. Advisory Board Section: removed `<Badge>Advisory Board</Badge>`, `<h2>Our Advisory Board</h2>`, the description `<p>` "Distinguished experts who provide strategic guidance and direction to our work.", and the "View profile →" hover span (used replace_all=true since the same span markup appears in both Advisory Board and Board of Trustees cards)
  11. Board of Trustees Section: removed `<Badge>Board of Trustees</Badge>`, `<h2>Board of Trustees</h2>`, the description `<p>` "Providing governance oversight and strategic direction for GTEEP's mission.", and the "View profile →" hover span
  12. CTA Section: removed the entire `<section aria-label="Call to Action">` block plus its preceding comment header ("CTA SECTION") — this contained the H2 "Get Involved with GTEEP", the "Whether you're a researcher..." paragraph, and the two CTA buttons (Contact Us, View Our Outputs). Left no replacement.
- Import audit: confirmed Handshake is still used in the `getPhilosophyIcon` iconMap (lines 52 + 58 fallback), Eye/Target/Crosshair still used in the Vision/Mission/Goal card icons, ArrowRight still used in the "Our Activities" button, Mail still used in the "Contact Us" button. All other icon imports (Microscope, TrendingUp, UserCheck, Scale) remain valid via the iconMap. Only the Badge import was removed.
- Ran `bun run lint` — passes with no errors and no warnings
- Verified via Grep: zero remaining `<Badge` occurrences in the file; all retained icon imports are still referenced
- File shrank from 642 lines to 482 lines

Stage Summary:
- About Us page now displays only WordPress-sourced content: aboutSummary (page editor content, split on \n\n), aboutVision / aboutMission / aboutGoal (ACF), philosophy items (ACF title + description + icon), team members (ACF name + role + bio + image + category)
- All hardcoded sub-headlines (Badge labels, H2 section titles, descriptive paragraphs) removed from the About, Philosophy, Leadership, Advisory Board, and Board of Trustees sections
- All hardcoded UI affordance text ("Click to view full profile →", "View full profile →", "View profile →") removed from member cards
- The image overlay text block (Handshake icon + "GTEEP" + tagline) removed from the About section visual; Image + gradient overlay + decorative circles preserved
- Entire CTA Section ("Get Involved with GTEEP") removed; no replacement content
- PageHeader subtitle and description set to undefined (matching the Task 6 pattern); H1 "About Us" and breadcrumb kept
- Functional elements preserved: section containers, id anchors (#philosophy, #team), AnimatedSection/motion.div animations, card grids, icon containers, TeamAvatar, TeamMemberModal, onClick handlers, the two About CTA buttons (functional navigation)
- Badge import removed; all Lucide icon imports retained (each is still referenced either in the iconMap or in the About CTA buttons or the Vision/Mission/Goal card icons)
- Lint passes with zero errors

---
Task ID: 9
Agent: What We Do + Outputs Cleanup Agent
Task: Remove all non-WordPress content from What We Do and Outputs pages

Work Log:
- Read worklog.md to understand prior cleanup patterns established in Task IDs 6 and 7 (PageHeader subtitle/description → undefined; remove hardcoded sub-headlines/Badges/descriptions/fallbacks; keep functional navigation and WP-sourced content; leave blank if no WP content)
- Read WhatWeDoPageClient.tsx and OutputsPageClient.tsx in full to identify every hardcoded string vs. WP-sourced value
- Verified eslint.config.mjs: @typescript-eslint/no-unused-vars and no-unused-vars are disabled, so unused imports do not fail lint (explains pre-existing unused Plus/Eye imports in OutputsPageClient.tsx)

WhatWeDoPageClient.tsx edits:
- PageHeader: removed subtitle="Our Activities" and description="Driving evidence-based policy change through research, engagement, and empowerment across Africa." (kept title="What We Do", breadcrumb, backgroundImage)
- Activities Overview section: removed the entire <AnimatedSection> wrapper that contained the "Our Programme Areas" H2 and the "GTEEP operates across six interconnected programme areas..." description. Kept the quick-nav cards grid (each card shows WP-sourced activity.title + functional anchor link)
- ActivitySection component:
  - Removed the <Badge>Activity {index + 1}</Badge> chip above the activity title
  - Replaced the fallback <p>"Content for this activity is being developed. Check back soon for detailed information about our {activity.title.toLowerCase()} work."</p> with `{activity.content ? <WpContent .../> : null}` (renders nothing when WP content is empty)
  - Removed the "Sub-Programmes ({N})" outline Button (redundant with the Learn More button — both link to the same activity page)
  - Removed the "Sub-Programmes under {activity.title}" <h3> heading above the children grid (kept the grid of WP-sourced child cards below)
  - Removed the "View details" + ChevronRight affordance text inside each child card (kept the image, icon, WP-sourced child.title and content snippet)
  - Kept the activity <h2>{activity.title}</h2> (WP-sourced) and the "Learn More" Button (functional nav)
- PolicyFirechatSection component:
  - Removed the hardcoded "Development Conversations • Under Policy Engagement" <p> subtitle
  - Changed `{childPage?.title || 'Policy Firechat'}` to `{childPage?.title}` (no hardcoded fallback)
  - Replaced the entire <details>/<summary> "Read more about Policy Firechats" block with a plain `<div><WpContent html={rest} /></div>` when `rest` exists (no hardcoded summary text)
  - Kept the "View Fireside Chats" and "Learn More" Buttons (functional nav, button text acceptable per Task 7 precedent)
- Removed the entire "Activities Coming Soon" fallback section (was shown when sortedActivities.length === 0 — contained hardcoded H2, description, FileSearch icon, "Learn About GTEEP" and "Contact Us" buttons). Page now renders nothing when there are no WP activities.
- Removed the entire bottom CTA section ("Explore Our Work" H2, description, "View Our Outputs" and "Contact Us" buttons, decorative gradient blurs). No replacement content.
- Cleaned up unused Lucide imports: removed Mail (was only in CTA + Coming Soon buttons) and ChevronRight (was only in removed summary + "View details" text). Verified FileSearch is still used in activityIcons fallback, BookOpen still used in activityIcons map, ArrowRight still used in "Learn More" buttons, Badge still used in "+N sub" quick-nav badge, Flame still used in PolicyFirechatSection and sub-programme cards.

OutputsPageClient.tsx edits:
- PageHeader: removed subtitle="Research & Knowledge Products" and description="Browse our comprehensive collection of research outputs, policy briefs, data resources, videos, and knowledge products." (kept title="Our Outputs", breadcrumb)
- Empty-state fallback (shown when filteredOutputs.length === 0): removed the entire block — BarChart3 icon, "No outputs found" H3, "There are no outputs in this category yet. Check back soon." paragraph. Tab content now renders `null` when empty.
- DownloadableCard: removed the entire `{output.relatedActivity && (<div className="mb-3">...</div>)}` block that contained the Flame icon + "Related: Policy Fireside Chat" hardcoded link text. The clickable Fireside Chat badge at the top of the card (with Flame icon) already provides the same visual indicator and is kept.
- DownloadableCard: removed the `<span className="text-sm text-[#94a3b8]">No document available</span>` fallback. Now renders `null` when no downloadUrl (ViewDocumentButton only renders when downloadUrl exists).
- OutputCard: removed the entire "Read More" <Button variant="link"> block (was the fallback when an output had no downloadUrl AND no externalUrl — a non-functional button that didn't link anywhere). Now renders `null` in that case.
- OutputCard: kept the `<p>{output.excerpt}</p>` (WP-sourced — renders empty <p> if excerpt is undefined, which is fine per "if no content leave it blank")
- Cleaned up unused imports: removed BarChart3 (was only in empty state) and ArrowRight (was only in Read More button) from lucide-react import list. Also removed the now-unused `import { Button } from '@/components/ui/button'` (no plain <Button> usage remains after Read More removal — only ViewDocumentButton is used, which is imported separately). Pre-existing unused Plus and Eye imports left untouched (they were unused before this task and ESLint config disables no-unused-vars).

Verification:
- Ran `bun run lint` — passes cleanly with exit code 0
- Skipped Agent Browser verification per task instructions (main agent will verify)

Stage Summary:
- What We Do page: all hardcoded marketing copy removed — PageHeader subtitle/description, "Our Programme Areas" heading + description, "Activity N" badges, "Content coming soon" fallback, "Sub-Programmes (N)" button, "Sub-Programmes under X" headings, "View details" affordance text, "Development Conversations • Under Policy Engagement" subtitle, "Read more about Policy Firechats" summary, "Activities Coming Soon" fallback section, and the bottom CTA section. Page now shows only WP-sourced activity titles, content, sub-programme cards (WP titles + content snippets), the PolicyFirechatSection (WP intro + WP rest content), and functional "Learn More" / "View Fireside Chats" navigation buttons. If WP returns no activities, the page renders nothing below the header.
- Outputs page: PageHeader subtitle/description removed; "No outputs found" empty state removed (renders blank when empty); "Related: Policy Fireside Chat" link text removed (kept the Fireside Chat badge with Flame icon as visual indicator); "No document available" fallback removed; fake "Read More" button removed. Page now shows only WP-sourced output titles, descriptions, excerpts, dates, tags, download/external links, and the Fireside Chat badge. If a tab has no outputs, it renders blank.
- All WP-sourced content preserved (activity.title, activity.content, activity.image, activity.icon, child.title, child.content, child.image, child.slug, output.title, output.description, output.excerpt, output.date, output.downloadUrl, output.externalUrl, output.fileType, output.tags, output.relatedActivity, output.relatedSubActivity)
- All functional structure preserved (sections, AnimatedSection animations, layout grids, icons, tabs, tab navigation, ViewDocumentButton modal trigger, anchor links, breadcrumb, backgroundImage)
- Lint passes with zero errors; both files compile cleanly

---
Task ID: 10
Agent: Contact Page Cleanup Agent
Task: Remove all non-WordPress content from Contact page

Work Log:
- Read worklog.md to understand prior cleanup patterns (Tasks 6 & 7: removing non-WP content + sub-headlines from ActivityDetailClient, HomePageClient, etc.)
- Read full ContactPageClient.tsx (758 lines) to map all hardcoded content vs WP-sourced content (contactDetails.email/phone/address)
- Imports cleanup: removed `motion` (framer-motion), `Separator`, `Accordion`/`AccordionContent`/`AccordionItem`/`AccordionTrigger`, and Lucide icons `Clock`, `CheckCircle2`, `MessageSquare`, `Handshake`, `BookOpen`, `Users`, `Building2`, `HelpCircle` (all unused after section removals)
- Removed `OFFICE_HOURS` constant (hardcoded string)
- Kept `SUBJECT_OPTIONS` constant (functional form dropdown options, not marketing content)
- Removed entire `FAQ_ITEMS` constant (hardcoded Q&A marketing copy)
- Removed entire `getContactCards` function (4 cards with hardcoded titles/descriptions + derived emails not actually in WP)
- Removed `containerVariants` and `itemVariants` animation constants (only used by removed contact cards motion.div)
- Removed `isSuccess` state declaration and `setIsSuccess(true)` call in handleSubmit; removed `contactCards` derived variable
- Updated `toast.success('Message sent!')` to remove hardcoded description "Thank you for reaching out..."
- PageHeader: changed `subtitle` and `description` to `undefined` (kept "Contact Us" title + breadcrumb)
- Removed entire "Quick Contact Options" section (4-card grid with motion.div + contactCards.map)
- Removed entire success state block (CheckCircle2, "Message Sent Successfully!" heading, "Thank you for reaching out..." description, "A confirmation email..." sub-text, "Send Another Message" button). The form now always renders directly inside CardContent (no ternary).
- Removed "Send a Message" h2 heading + "Fill out the form below..." description from form
- Removed "Office Information" h3 heading from sidebar card
- Removed hardcoded "Email", "Phone", "Address" field labels (icons provide visual context; WP-sourced values remain)
- Removed Office Hours block (used removed OFFICE_HOURS constant)
- Removed "GTEEP Headquarters" text from Map Card (kept Globe2 icon + WP-sourced address)
- Removed entire Quick Response Notice card (hardcoded heading + marketing copy)
- Removed entire FAQ section (badge, "Frequently Asked Questions" heading, description, Accordion, "Still have questions?" text)
- Left toast.error calls unchanged (functional error feedback, not marketing content)
- Left form field labels (Full Name, Email Address, Organization, Phone Number, Inquiry Type, Subject, Message), placeholders, validation messages, consent checkbox label, "Sending..." and "Send Message" button text, and character counter all unchanged (functional UI affordances)
- Verified: `bun run lint` passes with zero errors. `bunx tsc --noEmit` reports zero errors in ContactPageClient.tsx (other files have pre-existing errors unrelated to this task)

Stage Summary:
- ContactPageClient.tsx reduced from 758 lines to 427 lines (~44% reduction)
- All hardcoded marketing copy removed; only WP-sourced content (contactEmail, contactPhone, contactAddress from contactDetails ACF) + functional form structure remain
- Page now consists of: PageHeader (title + breadcrumb only), Contact Form section (form fields, validation, submit handler, toast notifications), and a slim Contact Info sidebar (icon + WP value for each of email/phone/address) plus a Map Card showing the WP address
- Lint and TypeScript checks pass for the modified file

---
Task ID: 11
Agent: Main Agent
Task: Remove PageHeader subtitle + description from remaining activity detail pages and Publications page

Work Log:
- User requested removal of "What We Do / GTEEP's <X> programme — driving evidence-based policy change across Africa." from the headers of:
  - /what-we-do/policy-research
  - /what-we-do/citizen-enlightenment
  - /what-we-do/data-speaks
  - /what-we-do/youth-mentoring
  - /what-we-do/womens-economic-livelihood
- User also requested removal of "Academic Research & Policy Output / Browse the complete catalogue of academic publications..." from the Publications page header.
- In `src/components/pages/ActivityDetailClient.tsx`, extended the existing `hideHeaderSubtitle` flag (previously only `policy-engagement` and `policy-firechat`) to include all activity slugs: `policy-research`, `citizen-enlightenment`, `data-speaks`, `youth-mentoring`, `womens-economic-livelihood`, `our-publication`. Refactored from boolean OR to array `.includes()` for clarity.
- In `src/components/pages/PublicationsPageClient.tsx`, set PageHeader `subtitle={undefined}` and `description={undefined}` (kept `title="Publications"` and breadcrumb).
- Lint passes with zero errors.
- Verified via Agent Browser:
  - /what-we-do/policy-research: "GTEEP's Policy Research programme" desc REMOVED ✓, "driving evidence-based policy change across Africa" REMOVED ✓
  - /what-we-do/citizen-enlightenment: desc REMOVED ✓
  - /what-we-do/data-speaks: desc REMOVED ✓
  - /what-we-do/youth-mentoring: desc REMOVED ✓
  - /what-we-do/womens-economic-livelihood: desc REMOVED ✓
  - /publications: "Academic Research & Policy Output" REMOVED ✓, "Browse the complete catalogue" REMOVED ✓, "Publications" title still PRESENT ✓
  - "What We Do" only appears in nav menu links (header/footer) and in the breadcrumb trail (Home / What We Do / Page Title) — both are functional navigation, not page header subtitle.
- All routes returning 200, no errors in dev log.

Stage Summary:
- All activity detail page headers now show only the WP-sourced page title (no hardcoded "What We Do" subtitle or "GTEEP's X programme..." description).
- Publications page header now shows only "Publications" title (no hardcoded subtitle or description).
- Pattern consistent with Tasks 6 and 7: PageHeader receives `subtitle={undefined}` and `description={undefined}` when no WordPress content is available, leaving the header area blank rather than showing hardcoded marketing copy.

---
Task ID: 12
Agent: Main Agent
Task: Reduce home hero to single "What We Do" button; truncate fireside chat write-up to first 2 paragraphs with Read More button opening Development Conversations document

Work Log:
- User requested: (1) leave only 1 button on home page hero, linking to /what-we-do; (2) on the policy fireside chat page, show only the first 2 paragraphs of the long write-up with a Read More button that opens the Development Conversations related output document (without removing it from the Related Outputs section).

HOME PAGE HERO (HomePageClient.tsx):
- Removed the "Join Fireside Chat" button (was linking to /what-we-do/policy-engagement/policy-firechat with Flame icon).
- Kept only the "Explore Our Work" button linking to /what-we-do, styled as the solid amber primary button for visual prominence.
- Updated comment from "CTA Buttons" to "CTA Button — single button to What We Do".
- Flame import kept (still used in Sections 2 and 8).

FIRESIDE CHAT PAGE (ActivityDetailClient.tsx):
- Added import of DocumentViewer component (alongside existing ViewDocumentButton import).
- Created extractFirstParagraphs() helper function:
  - First tries to match <p>...</p> HTML tags (for WordPress block editor content).
  - Falls back to splitting plain text by double newlines for ACF textarea content.
  - Handles both \r\n\r\n (Windows) and \n\n (Unix) line breaks — critical because the WordPress policyFirechat ACF field uses \r\n\r\n separators.
  - Identifies "paragraphs" as blocks longer than 50 chars (short blocks are headings).
  - Returns the first `count` paragraph blocks plus any preceding headings, each wrapped in <p> tags with single newlines converted to <br>.
- Created FirechatIntro component:
  - Renders only the first 2 paragraphs via extractFirstParagraphs().
  - Finds the "Development Conversations" related output by title.
  - Shows a "Read More" button (amber, with ArrowRight icon) that opens the DocumentViewer modal for the Development Conversations document.
  - The document is NOT removed from the Related Outputs section below — it stays where it is.
- Updated the policy-firechat page rendering to use <FirechatIntro> instead of <WpContent> for the intro content.

VERIFICATION (Agent Browser):
- Home page hero: exactly 1 CTA button ("Explore Our Work" → /what-we-do). "Join Fireside Chat" button removed. ✓
- Fireside chat page intro: 3 <p> tags rendered (Introduction heading + 2 content paragraphs). Text length reduced from 6678 → 1320 chars. Paragraph 3+ content absent. ✓
- "Read More" button present below the intro paragraphs. ✓
- Clicking "Read More" opens the DocumentViewer modal with "Development Conversations Website.docx" loaded via Google Docs Viewer. ✓
- "Development Conversations Website" document still present in the Related Outputs section below (not removed). ✓
- Event Accordion (Gender Backlash + Follow the Money) still renders below the intro. ✓
- Lint passes with zero errors. All routes returning 200.

Stage Summary:
- Home page hero now has a single CTA button linking to /what-we-do.
- Fireside chat page write-up is truncated to the first 2 paragraphs with a Read More button that opens the Development Conversations document in the read-only DocumentViewer.
- The Development Conversations document remains in the Related Outputs section (not removed or duplicated).
- extractFirstParagraphs() helper handles both HTML <p> content and plain-text ACF content with Windows/Unix newline variants.

---
Task ID: 13
Agent: Main Agent
Task: Show the Follow the Money event output files on the Our Outputs page (in addition to the Fireside Chat page)

Work Log:
- Read worklog.md (Tasks 1-12) to understand prior work. Task 12 already completed the home hero single-button + fireside chat read-more changes.
- Read src/graphql/fetchers.ts to understand the data flow:
  - getOutputDownloadables() fetches 5 ACF fields from the "Our Outputs" page (ourOutputDownloadables) and maps them to GTEEPOutput[] via DOWNLOADABLE_FIELD_MAP.
  - getFollowTheMoneyFiles() fetches the followTheMoney ACF field group from posts (briefForRegistration + fullConceptNote) and returns a FollowTheMoneyFiles object.
  - The Outputs page server component (src/app/outputs/page.tsx) merges downloadables + outputs into allOutputs.
- Read src/app/outputs/page.tsx, OutputsPageClient.tsx, and the EventAccordion section of ActivityDetailClient.tsx to confirm how Follow the Money files are currently rendered (titleFromFilename() derives titles from the WP file URLs) and how outputs are tab-categorised (concept-note merges into knowledge-product tab; relatedSubActivity === 'policy-firechat' triggers the Fireside Chat badge).
- Added a new fetcher getFollowTheMoneyOutputs() to src/graphql/fetchers.ts (after getFollowTheMoneyFiles):
  - Added a local titleFromFilename() helper that mirrors the one in ActivityDetailClient.tsx so titles are consistent across both pages.
  - Added FOLLOW_THE_MONEY_FIELD_MAP mapping the two ACF field names to title fallbacks.
  - The fetcher calls getFollowTheMoneyFiles(), then converts each present file URL into a GTEEPOutput with: type 'concept-note' (so it shows under Knowledge Products tab, consistent with the other fireside chat documents), relatedActivity 'policy-engagement' + relatedSubActivity 'policy-firechat' (so it displays the Fireside Chat badge that links to the firechat page), fileType derived from the URL extension, and title/description/excerpt generated the same way as getOutputDownloadables().
  - Reuses the existing module-level getFileExtension() and getFileTypeIcon() helpers.
- Updated src/app/outputs/page.tsx:
  - Imported getFollowTheMoneyOutputs.
  - Added it to the Promise.all and merged into allOutputs as [...downloadables, ...followTheMoneyOutputs, ...outputs].
  - Added a comment clarifying the Follow the Money files ALSO remain on the Fireside Chat page (additive listing, not moved).
- Ran `bun run lint` — passes with zero errors.
- Verified via Agent Browser:
  - /outputs "All" tab now shows 7 outputs (was 5): Development Conversations Website, Gender Backlash Architecture, Oluponna Gender Backlash Response, Policy Fireside Chat Outcomes & Next Steps, Graphics on Book Talk, PLUS the 2 new Follow the Money files: "Concept Brief For Registration" (DOCX) and "Concept Note 05 01 Fin" (DOCX).
  - Both new files display the "Fireside Chat" badge (links to /what-we-do/policy-engagement/policy-firechat).
  - "Knowledge Products" tab count is 7 and shows the same 7 outputs (concept-note merges into knowledge-product).
  - "View DOCX" buttons present on both new cards.
  - /what-we-do/policy-engagement/policy-firechat still shows the Follow the Money event accordion with both files ("Concept Brief For Registration", "Concept Note 05 01 Fin"), the Register Now link, and the Gender Backlash section — nothing was removed.
  - No page errors, no console errors, both routes return 200.
  - Titles match exactly between the Outputs page and the Fireside Chat page (both derived from the same filenames via titleFromFilename).

Stage Summary:
- The two Follow the Money event files (brief for registration + full concept note) now ALSO appear on the Our Outputs page under both the "All" and "Knowledge Products" tabs, with the Fireside Chat badge linking back to the firechat page.
- The files were NOT removed from the Fireside Chat page — they remain in the Follow the Money event accordion there. This is an additive listing for discoverability from either entry point.
- New fetcher getFollowTheMoneyOutputs() is reusable; the Outputs page server component fetches it in parallel with the existing fetchers via Promise.all.
- Lint passes with zero errors; Agent Browser confirms the files render correctly on both pages with consistent titles.

---
Task ID: 14
Agent: Main Agent
Task: Update the "Development Conversations Website" document name to reflect the new file the WP admin uploaded to the ACF field whatIsFiresideChat (ourOutputDownloadables)

Work Log:
- User reported that the document name "Development Conversations Website" no longer matches the file currently in the WordPress ACF field `ourOutputDownloadables > whatIsFiresideChat` (the admin swapped the file in WP).
- Root cause: in src/graphql/fetchers.ts, DOWNLOADABLE_FIELD_MAP hardcodes `title: 'Development Conversations Website'` for the whatIsFiresideChat field, and getOutputDownloadables() uses metadata.title directly. The title never reflected the actual WP file.
- Investigated downstream dependency: FirechatIntro (Task 12) finds the Development Conversations output by searching `o.title.toLowerCase().includes('development conversation')`. Deriving the title from the new filename would break this lookup if the new filename does not contain "development conversation".

FETCHERS.TS CHANGES (src/graphql/fetchers.ts):
- Added a `deriveTitleFromFilename?: boolean` flag to the DOWNLOADABLE_FIELD_MAP value type.
- Set `deriveTitleFromFilename: true` on the whatIsFiresideChat entry (kept `title: 'Development Conversations Website'` as a fallback).
- Updated getOutputDownloadables() loop: `const derivedTitle = metadata.deriveTitleFromFilename ? (titleFromFilename(url) || metadata.title) : metadata.title;` — reuses the existing titleFromFilename() helper (hoisted function declaration) that is already used by getFollowTheMoneyOutputs(). The derived title and excerpt both use the new value.
- Left all other fields (genderBacklashArchitecture, oluponnaGenderBacklashResponse60, thePolicyFiresideChatOutcomesAndNextSteps0323, graphicsOnBookTalk) unchanged — their hardcoded titles are still used (surgical change, only the field the user mentioned is affected).

ACTIVITYDETAILCLIENT.TSX CHANGES (FirechatIntro):
- Changed the Development Conversations output lookup from title-text matching to the stable ACF field slug: `relatedOutputs.find((o) => o.slug === 'whatIsFiresideChat')`. The slug is the ACF field name (constant), so the Read More button keeps working no matter what the WP admin renames the file to. Updated the comment to explain the rationale.

VERIFICATION (Agent Browser):
- /outputs page: first output card title is now "What Is A Fireside Chat" (derived from the new WP filename "What-Is-A-Fireside-Chat.docx" → "What Is A Fireside Chat"). The other 6 output titles are unchanged (Gender Backlash Architecture, Oluponna Gender Backlash Response, Policy Fireside Chat Outcomes & Next Steps, Graphics on Book Talk, Concept Brief For Registration, Concept Note 05 01 Fin).
- /what-we-do/policy-engagement/policy-firechat: Related Outputs section shows the updated "What Is A Fireside Chat" title with a "View What Is A Fireside Chat" button.
- Clicked the "Read More" button on the intro → DocumentViewer modal opens with "What Is A Fireside Chat.docx" loaded via Google Docs Viewer. The slug-based lookup works correctly.
- No page errors, no console errors/warnings, both routes return 200.
- `bun run lint` passes with zero errors.

Stage Summary:
- The whatIsFiresideChat document title is now derived from the actual WordPress file URL's filename (via titleFromFilename()), so it auto-updates whenever the WP admin changes the file in the ACF field — no code change needed for future file swaps.
- The hardcoded "Development Conversations Website" string is kept only as a fallback (used if filename derivation somehow fails).
- The FirechatIntro "Read More" button now finds the output by its stable slug (`whatIsFiresideChat`) instead of by title text, making it robust to file renames in WordPress.
- Other downloadable titles are unchanged (surgical change limited to the field the user mentioned).
- Verified end-to-end: new title shows on Outputs page + Fireside Chat Related Outputs, and Read More opens the correct document.
