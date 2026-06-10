// =============================================================================
// GTEEP - Gilead Trust Economic Empowerment Project
// Mock Data for the website
//
// Comprehensive mock data that allows the site to function fully without
// a live WordPress backend. When the WP backend is connected later,
// this data will be replaced by live GraphQL queries.
// =============================================================================

import type {
  GTEEPActivity,
  GTEEPPhilosophy,
  GTEEPTeamMember,
  GTEEPOutput,
  GTEEPBlogPost,
  GTEEPPartner,
  WPSiteSettings,
} from '@/types';

// =============================================================================
// Site Settings
// =============================================================================

export const mockSiteSettings: WPSiteSettings = {
  siteTitle: 'GTEEP',
  siteDescription:
    'Gilead Trust Economic Empowerment Project — Evidence-driven policy analysis for socially inclusive development in Africa.',
  siteUrl: 'https://gteep.com',
  siteLogo: {
    sourceUrl: '/images/gteep-banner.png',
    altText: 'GTEEP Logo',
    mediaItemId: 1,
    width: 200,
    height: 60,
  },
  favicon: null,
  acfOptions: {
    heroTitle: 'GTEEP',
    heroSubtitle: 'Gilead Trust Economic Empowerment Project',
    heroDescription:
      'Evidence-driven policy analysis for socially inclusive development. We champion partnerships for African development, people-centered growth, and gender equitable economic transformation.',
    heroImage: null,
    heroCtaText: 'Explore Our Work',
    heroCtaUrl: '/what-we-do',
    aboutSummary:
      'GTEEP is a non-profit organization dedicated to advancing socially inclusive development in Africa through evidence-driven policy research, strategic engagement, and community empowerment. Founded on the belief that data speaks more than rhetoric, we work to ensure that policy decisions are grounded in rigorous analysis and that the voices of ordinary citizens are heard in the policy process.',
    aboutImage: null,
    contactEmail: 'info@gteep.com',
    contactPhone: '+234 801 234 5678',
    contactAddress: 'Lagos, Nigeria',
    officeHours: 'Monday - Friday, 9:00 AM - 5:00 PM WAT',
    footerText: 'Empowering communities through evidence-based policy.',
  },
};

// =============================================================================
// Activities (What We Do)
// =============================================================================

export const mockActivities: GTEEPActivity[] = [
  {
    id: 'act-1',
    title: 'Policy Research',
    description:
      'Conducting rigorous, evidence-based research on trade policy, regional integration, economic development, and social inclusion to inform policy decisions across Africa. Our research agenda spans macroeconomic policy, trade facilitation, and structural transformation.',
    icon: 'FileSearch',
    image: '/images/data-speaks.png',
  },
  {
    id: 'act-2',
    title: 'Policy Engagement',
    description:
      'Bridging the gap between research and policy by engaging governments, regional organizations, civil society, and the private sector. We facilitate policy dialogues, convene stakeholder forums, and provide advisory services to ensure research findings translate into actionable policy.',
    icon: 'Users',
    image: '/images/gteep-community-outreach.png',
  },
  {
    id: 'act-3',
    title: 'Citizen Enlightenment',
    description:
      'Empowering citizens with accessible information about policies that affect their lives and livelihoods. Through community outreach, media engagement, and plain-language publications, we demystify complex policy issues and promote informed public participation in governance.',
    icon: 'Lightbulb',
    image: '/images/gteep-community-outreach.png',
  },
  {
    id: 'act-4',
    title: '"Data Speaks"',
    description:
      'Our flagship data-driven advocacy program that uses compelling data visualizations, infographics, and evidence briefs to influence public discourse and policy outcomes. We believe that when data speaks, decision-makers listen — and act.',
    icon: 'BarChart3',
    image: '/images/data-speaks.png',
  },
  {
    id: 'act-5',
    title: 'Youth Mentoring',
    description:
      'Investing in the next generation of African policy leaders through structured mentoring programs, research internships, and capacity-building workshops. We pair emerging scholars and practitioners with experienced mentors to develop skills in research, analysis, and policy communication.',
    icon: 'GraduationCap',
    image: '/images/youth-mentoring.png',
  },
  {
    id: 'act-6',
    title: "Women's Economic Livelihood",
    description:
      'Promoting gender-equitable economic growth by supporting women\'s economic empowerment, enhancing livelihood opportunities, and advocating for policy frameworks that address gender-based barriers to economic participation. Our work focuses on women in informal trade, agriculture, and entrepreneurship.',
    icon: 'Heart',
    image: '/images/women-livelihood.png',
  },
];

// =============================================================================
// Our Philosophy
// =============================================================================

export const mockPhilosophy: GTEEPPhilosophy[] = [
  {
    id: 'phil-1',
    title: 'Partnerships for African Development',
    description:
      'We believe that meaningful development in Africa requires collaborative partnerships across governments, civil society, academia, and the private sector. No single actor can address the continent\'s complex challenges alone.',
    icon: 'Handshake',
  },
  {
    id: 'phil-2',
    title: 'Evidence-driven Policy Analysis for Socially Inclusive Development',
    description:
      'Our analysis is grounded in rigorous evidence, not ideology. We are committed to producing policy research that prioritizes social inclusion and ensures that development benefits reach the most vulnerable populations.',
    icon: 'Microscope',
  },
  {
    id: 'phil-3',
    title: 'Data Speaks More Than Rhetoric',
    description:
      'In an era of information overload, we let the data lead. Our "Data Speaks" approach ensures that policy recommendations are backed by solid evidence and that our advocacy is compelling because it is credible.',
    icon: 'TrendingUp',
  },
  {
    id: 'phil-4',
    title: 'People-centered Development',
    description:
      'Development must serve people, not just economic indicators. We center our research and advocacy on the lived experiences of ordinary Africans, ensuring that policy outcomes improve real lives and livelihoods.',
    icon: 'UserCheck',
  },
  {
    id: 'phil-5',
    title: 'Gender Equitable Economic Growth and Transformation',
    description:
      'Economic growth that excludes women is neither sustainable nor just. We champion gender-equitable approaches to economic policy that recognize and address the structural barriers women face in accessing economic opportunities.',
    icon: 'Scale',
  },
];

// =============================================================================
// Team Members
// =============================================================================

export const mockTeamMembers: GTEEPTeamMember[] = [
  // Executive Leadership
  {
    id: 'team-1',
    name: 'Bola Akanji',
    role: 'Executive Director',
    category: 'executive',
    bio: 'Bola Akanji is a distinguished economist and policy researcher with over 25 years of experience in international trade policy, African economic integration, and development economics. As the founder and Executive Director of GTEEP, she leads the organization\'s mission to promote evidence-driven, socially inclusive policy across Africa. A PhD holder from the University of Ibadan, she has published extensively on the AfCFTA, ECOWAS trade protocols, and the gender dimensions of trade policy.',
    image: '',
  },
  // Directors
  {
    id: 'team-2',
    name: 'Tomi Adu',
    role: 'Director',
    category: 'director',
    bio: 'Tomi Adu brings extensive experience in development finance and institutional management to GTEEP. With a background in banking and international development, she oversees strategic partnerships and organizational development, ensuring GTEEP\'s operations align with its mission of empowering African communities through evidence-based policy.',
    image: '',
  },
  {
    id: 'team-3',
    name: 'Michael Akanji',
    role: 'Director',
    category: 'director',
    bio: 'Michael Akanji contributes expertise in project management and community development to GTEEP\'s board. His work focuses on translating research findings into practical interventions that benefit grassroots communities, particularly in the areas of youth empowerment and agricultural value chains.',
    image: '',
  },
  {
    id: 'team-4',
    name: 'Yemi Akanji',
    role: 'Director',
    category: 'director',
    bio: 'Yemi Akanji brings a wealth of experience in organizational strategy and governance. With a keen interest in capacity building and institutional strengthening, Yemi supports GTEEP\'s efforts to build the next generation of African policy leaders and researchers.',
    image: '',
  },
  // Board of Trustees
  {
    id: 'trustee-1',
    name: 'Abayomi Akanji',
    role: 'Board of Trustees',
    category: 'board-of-trustees',
    bio: 'Abayomi Akanji serves on the Board of Trustees, providing strategic oversight and governance guidance to GTEEP. With decades of experience in business and community leadership, he ensures the organization remains true to its founding mission and values.',
    image: '',
  },
  {
    id: 'trustee-2',
    name: 'Tomi Adu',
    role: 'Board of Trustees',
    category: 'board-of-trustees',
    bio: 'In addition to her role as Director, Tomi Adu serves on the Board of Trustees, contributing her expertise in financial governance and institutional accountability to ensure GTEEP operates with the highest standards of transparency and impact.',
    image: '',
  },
  {
    id: 'trustee-3',
    name: 'Adenike Shoyinka',
    role: 'Board of Trustees',
    category: 'board-of-trustees',
    bio: 'Adenike Shoyinka brings a distinguished background in education and social development to GTEEP\'s Board of Trustees. Her commitment to women\'s empowerment and community development aligns closely with GTEEP\'s mission of inclusive economic growth.',
    image: '',
  },
  // Advisory Board
  {
    id: 'adv-1',
    name: 'Olaide Adedokun',
    role: 'Advisory Board',
    category: 'advisory-board',
    bio: 'Olaide Adedokun is a seasoned policy analyst and development practitioner who provides strategic guidance to GTEEP\'s research agenda. With expertise in public policy and governance reforms, Olaide helps ensure GTEEP\'s work remains relevant and impactful.',
    image: '',
  },
  {
    id: 'adv-2',
    name: 'Funmi Soetan',
    role: 'Advisory Board',
    category: 'advisory-board',
    bio: 'Funmi Soetan brings deep expertise in financial inclusion and economic empowerment to GTEEP\'s Advisory Board. Her work on expanding access to financial services for underserved populations informs GTEEP\'s approach to people-centered development.',
    image: '',
  },
  {
    id: 'adv-3',
    name: 'Mike Faborode',
    role: 'Advisory Board',
    category: 'advisory-board',
    bio: 'Mike Faborode is an accomplished academic and policy advisor who contributes strategic insight on education policy, human capital development, and institutional capacity building. His guidance strengthens GTEEP\'s youth mentoring and citizen enlightenment programs.',
    image: '',
  },
  {
    id: 'adv-4',
    name: 'Joseph Oluponna',
    role: 'Advisory Board',
    category: 'advisory-board',
    bio: 'Joseph Oluponna provides expert guidance on agricultural policy, rural development, and food security. His extensive field experience across West Africa enriches GTEEP\'s research on agricultural value chains and livelihood improvement strategies.',
    image: '',
  },
  {
    id: 'adv-5',
    name: 'Funke Mojubaolu Okome',
    role: 'Advisory Board',
    category: 'advisory-board',
    bio: 'Funke Mojubaolu Okome is a renowned scholar of African political economy and gender studies. Her expertise in gender analysis and women\'s economic empowerment provides critical direction to GTEEP\'s work on gender-equitable economic growth and transformation.',
    image: '',
  },
];

// =============================================================================
// Outputs
// =============================================================================

export const mockOutputs: GTEEPOutput[] = [
  // Concept Notes
  {
    id: 'out-1',
    title: 'Conceptual Framework for Intra-African Trade Under the AfCFTA',
    slug: 'concept-framework-afcfta',
    type: 'concept-note',
    description: 'A comprehensive concept note outlining the analytical framework for assessing intra-African trade flows under the African Continental Free Trade Area, including key indicators, methodology, and policy dimensions.',
    excerpt: 'Analytical framework for assessing intra-African trade flows under the AfCFTA.',
    date: '2025-01-15',
    downloadUrl: '#',
    image: '/images/data-speaks.png',
    authors: 'Akanji, B.O.',
    tags: ['AfCFTA', 'Trade Policy', 'Regional Integration'],
  },
  {
    id: 'out-2',
    title: 'Gender-Responsive Trade Policy: A Conceptual Approach for West Africa',
    slug: 'gender-responsive-trade-concept',
    type: 'concept-note',
    description: 'This concept note proposes a gender-responsive framework for trade policy analysis in West Africa, drawing on feminist economics and trade theory to identify structural barriers facing women in cross-border trade.',
    excerpt: 'Proposing a gender-responsive framework for trade policy analysis in West Africa.',
    date: '2024-09-20',
    downloadUrl: '#',
    image: '/images/women-livelihood.png',
    authors: 'Akanji, B.O. & Diop, F.',
    tags: ['Gender', 'Trade Policy', 'West Africa'],
  },
  // Policy Briefs
  {
    id: 'out-3',
    title: 'Policy Brief: Navigating the AfCFTA — A Guide for West African SMEs',
    slug: 'policy-brief-afcfta-smes',
    type: 'policy-brief',
    description: 'A practical policy brief providing guidance for West African small and medium enterprises seeking to leverage the opportunities created by the AfCFTA. Covers tariff preferences, rules of origin, customs procedures, and trade facilitation support.',
    excerpt: 'Practical guidance for West African SMEs on leveraging the AfCFTA.',
    date: '2025-02-10',
    downloadUrl: '#',
    image: '/images/gteep-community-outreach.png',
    authors: 'Akanji, B.O.',
    tags: ['AfCFTA', 'SMEs', 'Policy Brief'],
  },
  {
    id: 'out-4',
    title: 'Policy Brief: Reducing Non-Tariff Barriers in ECOWAS Agricultural Trade',
    slug: 'policy-brief-ntb-ecowas',
    type: 'policy-brief',
    description: 'This policy brief summarizes findings from a quantitative assessment of non-tariff barriers in ECOWAS agricultural trade and proposes actionable recommendations for policy-makers to reduce trade frictions and improve food security.',
    excerpt: 'Actionable recommendations for reducing NTBs in ECOWAS agricultural trade.',
    date: '2024-06-15',
    downloadUrl: '#',
    image: '/images/data-speaks.png',
    authors: 'Akanji, B.O., Souley, A.M., & Boateng, K.',
    tags: ['ECOWAS', 'Agriculture', 'Non-Tariff Barriers'],
  },
  // Data Stock
  {
    id: 'out-5',
    title: 'Intra-African Trade Flow Database (2018-2024)',
    slug: 'data-stock-intra-african-trade',
    type: 'data-stock',
    description: 'A comprehensive dataset of intra-African trade flows compiled from customs data across 35 African countries, covering the period 2018-2024. Includes values, volumes, product categories, and preferential tariff utilization rates under the AfCFTA.',
    excerpt: 'Comprehensive dataset of intra-African trade flows from 35 countries (2018-2024).',
    date: '2025-01-30',
    downloadUrl: '#',
    image: '/images/data-speaks.png',
    authors: 'GTEEP Research Team',
    tags: ['Trade Data', 'AfCFTA', 'Database'],
  },
  {
    id: 'out-6',
    title: 'Women in Informal Cross-Border Trade: Survey Data from Five Border Posts',
    slug: 'data-stock-women-icbt',
    type: 'data-stock',
    description: 'Survey data from over 500 women informal cross-border traders at five border posts in West Africa. Covers trade volumes, income, barriers encountered, and access to information and finance.',
    excerpt: 'Survey data from 500+ women informal cross-border traders in West Africa.',
    date: '2024-08-15',
    downloadUrl: '#',
    image: '/images/women-livelihood.png',
    authors: 'Akanji, B.O. & Diop, F.',
    tags: ['Gender', 'Informal Trade', 'Survey Data'],
  },
  // Video Gallery
  {
    id: 'out-7',
    title: 'Data Speaks: Visualizing AfCFTA Trade Flows',
    slug: 'video-afcfta-trade-flows',
    type: 'video',
    description: 'An animated data visualization presenting key findings from GTEEP\'s research on intra-African trade flows under the AfCFTA. This video illustrates how preferential tariffs are being utilized and identifies bottlenecks in trade implementation.',
    excerpt: 'Animated visualization of AfCFTA trade flow data and implementation insights.',
    date: '2025-02-20',
    externalUrl: '#',
    image: '/images/data-speaks.png',
    tags: ['Data Visualization', 'AfCFTA', 'Video'],
  },
  {
    id: 'out-8',
    title: 'Voices from the Border: Women Traders in West Africa',
    slug: 'video-women-traders',
    type: 'video',
    description: 'A documentary-style video featuring interviews with women informal cross-border traders at key border posts in West Africa. Their stories illuminate the challenges and resilience of women navigating trade policy in practice.',
    excerpt: 'Documentary featuring women informal cross-border traders in West Africa.',
    date: '2024-11-05',
    externalUrl: '#',
    image: '/images/women-livelihood.png',
    tags: ['Gender', 'Documentary', 'West Africa'],
  },
  // Photo Gallery
  {
    id: 'out-9',
    title: 'GTEEP Policy Dialogue — AfCFTA Implementation Forum 2025',
    slug: 'photo-afcfta-forum-2025',
    type: 'photo',
    description: 'Photo highlights from GTEEP\'s Policy Dialogue on AfCFTA Implementation, held in Abuja, Nigeria, in January 2025. The forum brought together trade ministers, private sector leaders, and civil society representatives.',
    excerpt: 'Photos from GTEEP\'s AfCFTA Implementation Policy Dialogue in Abuja.',
    date: '2025-01-25',
    image: '/images/gteep-community-outreach.png',
    tags: ['Event', 'AfCFTA', 'Policy Dialogue'],
  },
  {
    id: 'out-10',
    title: 'Youth Mentoring Workshop — Lagos 2024',
    slug: 'photo-youth-workshop-2024',
    type: 'photo',
    description: 'Moments captured from GTEEP\'s Youth Mentoring Workshop in Lagos, where emerging policy researchers and practitioners were paired with experienced mentors for intensive capacity-building sessions.',
    excerpt: 'Highlights from GTEEP\'s Youth Mentoring Workshop in Lagos.',
    date: '2024-07-20',
    image: '/images/youth-mentoring.png',
    tags: ['Youth', 'Mentoring', 'Workshop'],
  },
  // Knowledge Products
  {
    id: 'out-11',
    title: 'Gender-Responsive Trade Facilitation Assessment Toolkit',
    slug: 'toolkit-gender-trade-facilitation',
    type: 'knowledge-product',
    description: 'A practical toolkit developed by GTEEP for assessing the gender responsiveness of trade facilitation measures at border crossings. Includes assessment checklists, interview guides, data collection templates, and analysis frameworks.',
    excerpt: 'Practical toolkit for assessing gender responsiveness of trade facilitation measures.',
    date: '2024-10-10',
    downloadUrl: '#',
    image: '/images/women-livelihood.png',
    authors: 'Akanji, B.O. & Diop, F.',
    tags: ['Toolkit', 'Gender', 'Trade Facilitation'],
  },
  {
    id: 'out-12',
    title: 'AfCFTA Implementation Monitoring Dashboard — Methodology Guide',
    slug: 'methodology-afcfta-dashboard',
    type: 'knowledge-product',
    description: 'A detailed methodology guide for GTEEP\'s AfCFTA Implementation Monitoring Dashboard, explaining the indicators tracked, data sources used, analytical methods applied, and how to interpret the dashboard findings.',
    excerpt: 'Methodology guide for GTEEP\'s AfCFTA Implementation Monitoring Dashboard.',
    date: '2025-02-01',
    downloadUrl: '#',
    image: '/images/data-speaks.png',
    authors: 'GTEEP Research Team',
    tags: ['Methodology', 'AfCFTA', 'Dashboard'],
  },
];

// =============================================================================
// Partners
// =============================================================================

export const mockPartners: GTEEPPartner[] = [
  {
    id: 'partner-1',
    name: 'African Development Bank',
    type: 'international-organization',
    website: 'https://afdb.org',
    country: 'Côte d\'Ivoire',
    description: 'The African Development Bank Group is the premier development finance institution in Africa, supporting economic development and social progress across the continent.',
    logo: '',
  },
  {
    id: 'partner-2',
    name: 'International Development Research Centre',
    type: 'international-organization',
    website: 'https://idrc.ca',
    country: 'Canada',
    description: 'IDRC is a Canadian Crown corporation that supports research in developing countries to promote growth and development. A key funder of GTEEP\'s gender and trade research.',
    logo: '',
  },
  {
    id: 'partner-3',
    name: 'University of Ibadan',
    type: 'university',
    website: 'https://ui.edu.ng',
    country: 'Nigeria',
    description: 'Nigeria\'s premier university and a leading center for economic research in West Africa. GTEEP collaborates with UI on policy research and graduate mentoring programs.',
    logo: '',
  },
  {
    id: 'partner-4',
    name: 'ECOWAS Commission',
    type: 'government',
    website: 'https://ecowas.int',
    country: 'Nigeria',
    description: 'The Economic Community of West African States Commission, which facilitates regional economic integration. GTEEP provides policy advisory support to ECOWAS trade programs.',
    logo: '',
  },
  {
    id: 'partner-5',
    name: 'African Economic Research Consortium',
    type: 'research-institute',
    website: 'https://aercafrica.org',
    country: 'Kenya',
    description: 'AERC is a premier economic research network in Africa. GTEEP collaborates on collaborative research projects and capacity building for economic policy analysis.',
    logo: '',
  },
  {
    id: 'partner-6',
    name: 'United Nations Economic Commission for Africa',
    type: 'international-organization',
    website: 'https://uneca.org',
    country: 'Ethiopia',
    description: 'UNECA promotes the economic and social development of its member states. GTEEP partners with UNECA on trade policy research and the AfCFTA implementation monitoring.',
    logo: '',
  },
  {
    id: 'partner-7',
    name: 'University of Ghana',
    type: 'university',
    website: 'https://ug.edu.gh',
    country: 'Ghana',
    description: 'The University of Ghana is a leading research university in West Africa. GTEEP collaborates on trade policy research and joint publications.',
    logo: '',
  },
  {
    id: 'partner-8',
    name: 'Trade Policy Research Centre',
    type: 'research-institute',
    website: '#',
    country: 'Nigeria',
    description: 'A specialized research center focused on trade policy analysis and capacity building in Nigeria and the West African region.',
    logo: '',
  },
];

// =============================================================================
// Blog Posts
// =============================================================================

export const mockBlogPosts: GTEEPBlogPost[] = [
  {
    id: 'blog-1',
    title: 'AfCFTA Year Two: Assessing Trade Flows and Implementation Progress',
    slug: 'afcfta-year-two-assessing-trade-flows',
    excerpt:
      'An analysis of trade flows and implementation progress two years into the African Continental Free Trade Area, revealing both promising trends and persistent challenges.',
    content: '<p>The African Continental Free Trade Area (AfCFTA) has now been operational for over two years, and the initial trade flows under the agreement are beginning to reveal both promises and challenges.</p>',
    date: '2025-02-15',
    author: 'Bola Akanji',
    image: '/images/gteep-banner.png',
    categories: ['Trade Policy', 'AfCFTA'],
  },
  {
    id: 'blog-2',
    title: 'Gender and Trade: How African Women Navigate Cross-Border Commerce',
    slug: 'gender-and-trade-african-women',
    excerpt:
      'Exploring how African women navigate the challenges and opportunities of cross-border trade, based on field research across West African border posts.',
    content: '<p>Women constitute over 70% of informal cross-border traders in many African countries, yet their experiences remain under-documented in mainstream trade policy discourse.</p>',
    date: '2025-01-20',
    author: 'Bola Akanji',
    image: '/images/women-livelihood.png',
    categories: ['Gender & Trade', 'Policy'],
  },
  {
    id: 'blog-3',
    title: 'Why Data Speaks: The Power of Evidence in African Policy-Making',
    slug: 'why-data-speaks-evidence-policy',
    excerpt:
      'How GTEEP\'s "Data Speaks" initiative is changing the conversation around policy in Africa by putting evidence at the center of public discourse.',
    content: '<p>In policy circles across Africa, decisions have too often been driven by political expediency rather than evidence. GTEEP\'s Data Speaks initiative aims to change that.</p>',
    date: '2024-12-05',
    author: 'GTEEP Team',
    image: '/images/data-speaks.png',
    categories: ['Data Speaks', 'Policy'],
  },
  {
    id: 'blog-4',
    title: 'Mentoring the Next Generation: Reflections from Our Youth Program',
    slug: 'mentoring-next-generation-reflections',
    excerpt:
      'Reflections from GTEEP\'s youth mentoring program, where emerging policy researchers are paired with experienced mentors to develop critical skills.',
    content: '<p>At GTEEP, we believe that investing in the next generation of African policy leaders is not optional — it is essential for the continent\'s future.</p>',
    date: '2024-10-15',
    author: 'GTEEP Team',
    image: '/images/youth-mentoring.png',
    categories: ['Youth Mentoring', 'Capacity Building'],
  },
];

// =============================================================================
// Legacy WordPress mock data (kept for backward compatibility until WP backend is connected)
// =============================================================================

export const mockPages: any[] = [];
export const mockPosts: any[] = [];
export const mockPublications: any[] = [];
export const mockProjects: any[] = [];
export const mockEvents: any[] = [];
export const mockResources: any[] = [];
export const mockMediaItems: any[] = [];
export const mockTestimonials: any[] = [];
export const mockMenus: any[] = [];
export const mockSocialLinks = {
  twitter: 'https://twitter.com/gteep_africa',
  linkedin: 'https://linkedin.com/company/gteep',
  facebook: 'https://facebook.com/gteepafrica',
  instagram: 'https://instagram.com/gteep_africa',
  youtube: '',
  researchgate: '',
  googlescholar: '',
};
