// =============================================================================
// Mock Data - WordPress Headless CMS
// Professor Bola Akanji - Economics, Trade & Development Research Website
//
// Comprehensive mock data that allows the site to function fully without
// a live WordPress backend. All content is realistic for a Professor of
// Economics focusing on African trade, development, and policy research.
// =============================================================================

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
  WPMenuItem,
} from '@/types';

// =============================================================================
// Hero Content
// =============================================================================

export const mockHeroContent = {
  heroTitle: 'Prof. Bola Akanji',
  heroSubtitle: 'Leading Research in African Trade & Economic Development',
  heroDescription:
    'Professor of Economics with over 25 years of research experience in international trade policy, regional integration, and sustainable economic development across Africa. Dedicated to evidence-based policy that transforms livelihoods.',
  heroImage: {
    sourceUrl: '/images/hero-professor.jpg',
    altText: 'Professor Bola Akanji at a trade policy conference',
    mediaItemId: 1,
    width: 1200,
    height: 600,
  },
  heroCtaText: 'Explore Research',
  heroCtaUrl: '/publications',
};

// =============================================================================
// Pages
// =============================================================================

export const mockPages: WPPage[] = [
  {
    id: 'page-home',
    databaseId: 2,
    title: 'Home',
    slug: 'home',
    content:
      '<p>Welcome to the academic and research portal of Professor Bola Akanji. This site showcases decades of research in African trade policy, regional economic integration, and sustainable development.</p>',
    excerpt:
      'Welcome to the academic and research portal of Professor Bola Akanji.',
    date: '2024-01-15T10:00:00',
    modified: '2025-03-01T14:30:00',
    status: 'publish',
    featuredImage: null,
    uri: '/',
    isFrontPage: true,
    acfPageFields: {
      heroTitle: 'Prof. Bola Akanji',
      heroSubtitle: 'Leading Research in African Trade & Economic Development',
      heroDescription:
        'Professor of Economics with over 25 years of research experience in international trade policy, regional integration, and sustainable economic development across Africa.',
      heroImage: {
        sourceUrl: '/images/hero-professor.jpg',
        altText: 'Professor Bola Akanji',
        mediaItemId: 1,
        width: 1200,
        height: 600,
      },
      heroCtaText: 'Explore Research',
      heroCtaUrl: '/publications',
      sections: [
        {
          sectionTitle: 'About the Research',
          sectionContent:
            'My research focuses on the intersection of trade policy, regional integration, and economic development in Africa. I have published extensively on the African Continental Free Trade Area (AfCFTA), ECOWAS trade protocols, and the impact of trade agreements on livelihoods across the continent.',
          sectionLayout: 'split-left',
          sectionBackground: 'default',
        },
        {
          sectionTitle: 'Impact & Outreach',
          sectionContent:
            'Through collaborative research with international organizations, governments, and academic institutions, my work has informed policy decisions at national and regional levels. I am committed to making academic research accessible and actionable for policy-makers and practitioners.',
          sectionLayout: 'split-right',
          sectionBackground: 'accent',
        },
      ],
    },
    seo: {
      title: 'Prof. Bola Akanji - African Trade & Economic Development Research',
      metaDesc:
        'Academic research portal for Professor Bola Akanji. Explore publications, projects, and insights on African trade policy, regional integration, and sustainable economic development.',
    },
  },
  {
    id: 'page-about',
    databaseId: 3,
    title: 'About',
    slug: 'about',
    content: `<p>Professor Bola Akanji is a distinguished economist and academic with over 25 years of experience in research, teaching, and policy advisory across Africa and globally.</p>
<h3>Academic Background</h3>
<p>With a PhD in Economics from the University of Ibadan, Prof. Akanji has built a career at the intersection of academic research and real-world policy impact. Specializing in international trade, regional integration, and development economics, the research portfolio spans multiple African countries and regional economic communities.</p>
<h3>Research Focus</h3>
<p>The core research areas include:</p>
<ul>
<li>African Continental Free Trade Area (AfCFTA) implementation and impacts</li>
<li>Regional trade integration in ECOWAS and COMESA</li>
<li>Trade facilitation and non-tariff barriers</li>
<li>Gender dimensions of trade policy</li>
<li>Industrialization and structural transformation in Africa</li>
<li>Agricultural value chains and food security</li>
</ul>
<h3>Policy Engagement</h3>
<p>Beyond academic research, Prof. Akanji serves as a policy advisor to several African governments and regional organizations, including the African Union Commission, ECOWAS Commission, and the United Nations Economic Commission for Africa (UNECA). This dual role ensures that research findings translate into actionable policy recommendations.</p>`,
    excerpt:
      'Professor Bola Akanji is a distinguished economist and academic with over 25 years of experience in research, teaching, and policy advisory.',
    date: '2024-01-15T10:00:00',
    modified: '2025-02-20T09:15:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/about-prof.jpg',
      altText: 'Professor Bola Akanji in her office',
      mediaItemId: 2,
      width: 800,
      height: 600,
    },
    uri: '/about',
    acfPageFields: {
      heroTitle: 'About Prof. Akanji',
      heroSubtitle: 'Academic • Researcher • Policy Advisor',
      heroDescription:
        'A distinguished economist dedicated to advancing knowledge and policy in African trade and development.',
      sections: [
        {
          sectionTitle: 'Professional Experience',
          sectionContent:
            'Over two decades of academic and policy research experience, with positions at leading African and international institutions.',
          sectionLayout: 'full',
          sectionBackground: 'default',
        },
        {
          sectionTitle: 'Teaching & Mentorship',
          sectionContent:
            'Committed to nurturing the next generation of African economists through graduate teaching, thesis supervision, and mentorship programs.',
          sectionLayout: 'split-left',
          sectionBackground: 'accent',
        },
      ],
    },
    seo: {
      title: 'About - Prof. Bola Akanji',
      metaDesc:
        'Learn about Professor Bola Akanji, a distinguished economist with 25+ years of research in African trade policy, regional integration, and development economics.',
    },
  },
  {
    id: 'page-publications',
    databaseId: 4,
    title: 'Publications',
    slug: 'publications',
    content:
      '<p>Browse the complete catalogue of academic publications, including journal articles, book chapters, working papers, and policy briefs.</p>',
    excerpt:
      'Browse the complete catalogue of academic publications by Prof. Akanji.',
    date: '2024-01-15T10:00:00',
    modified: '2025-03-01T14:30:00',
    status: 'publish',
    featuredImage: null,
    uri: '/publications',
    seo: {
      title: 'Publications - Prof. Bola Akanji',
      metaDesc:
        'Academic publications by Professor Bola Akanji, including journal articles, book chapters, working papers, and policy briefs on African trade and development.',
    },
  },
  {
    id: 'page-projects',
    databaseId: 5,
    title: 'Research Projects',
    slug: 'projects',
    content:
      '<p>Current and past research projects spanning African trade policy, regional integration, and economic development.</p>',
    excerpt:
      'Current and past research projects by Prof. Akanji and collaborators.',
    date: '2024-01-15T10:00:00',
    modified: '2025-02-15T11:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/projects',
    seo: {
      title: 'Research Projects - Prof. Bola Akanji',
      metaDesc:
        'Research projects led by Professor Bola Akanji on African trade policy, AfCFTA, ECOWAS integration, and sustainable economic development.',
    },
  },
  {
    id: 'page-events',
    databaseId: 6,
    title: 'Events',
    slug: 'events',
    content:
      '<p>Upcoming and past events including conferences, workshops, seminars, and public lectures.</p>',
    excerpt:
      'Upcoming and past events including conferences, workshops, and lectures.',
    date: '2024-01-15T10:00:00',
    modified: '2025-03-01T14:30:00',
    status: 'publish',
    featuredImage: null,
    uri: '/events',
    seo: {
      title: 'Events - Prof. Bola Akanji',
      metaDesc:
        'Conferences, workshops, seminars, and public lectures featuring Professor Bola Akanji.',
    },
  },
  {
    id: 'page-resources',
    databaseId: 7,
    title: 'Resources',
    slug: 'resources',
    content:
      '<p>Downloadable resources including datasets, presentations, policy notes, and research tools.</p>',
    excerpt:
      'Downloadable research resources, datasets, and policy documents.',
    date: '2024-01-15T10:00:00',
    modified: '2025-02-10T16:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/resources',
    seo: {
      title: 'Resources - Prof. Bola Akanji',
      metaDesc:
        'Download research datasets, presentations, policy notes, and tools from Professor Bola Akanji\'s work on African trade and development.',
    },
  },
  {
    id: 'page-contact',
    databaseId: 8,
    title: 'Contact',
    slug: 'contact',
    content:
      '<p>Get in touch for research collaborations, speaking engagements, policy advisory, or academic inquiries.</p>',
    excerpt:
      'Get in touch for research collaborations, speaking engagements, or inquiries.',
    date: '2024-01-15T10:00:00',
    modified: '2025-01-20T08:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/contact',
    seo: {
      title: 'Contact - Prof. Bola Akanji',
      metaDesc:
        'Contact Professor Bola Akanji for research collaborations, speaking engagements, policy advisory, or academic inquiries.',
    },
  },
];

// =============================================================================
// Posts (Blog / News)
// =============================================================================

export const mockPosts: WPPost[] = [
  {
    id: 'post-1',
    databaseId: 101,
    title: 'AfCFTA Year Two: Assessing Trade Flows and Implementation Progress',
    slug: 'afcfta-year-two-assessing-trade-flows',
    content: `<p>The African Continental Free Trade Area (AfCFTA) has now been operational for over two years, and the initial trade flows under the agreement are beginning to reveal both promises and challenges. This analysis examines the key trends emerging from intra-African trade data since the agreement's operational phase began.</p>
<h3>Key Findings</h3>
<p>Our analysis of customs data from 15 participating countries reveals that intra-African trade under the AfCFTA tariff preferences has grown by approximately 4.2% in value terms during the first year of full implementation. However, this growth has been unevenly distributed across regions and sectors.</p>
<p>East African Community (EAC) member states have seen the most significant uptake, with Kenya and Rwanda reporting the highest volume of preferential trade under the AfCFTA framework. In contrast, West African trade under the agreement remains constrained by non-tariff barriers and rules of origin compliance challenges.</p>`,
    excerpt:
      'An analysis of trade flows and implementation progress two years into the African Continental Free Trade Area, revealing both promising trends and persistent challenges.',
    date: '2025-02-15T09:00:00',
    modified: '2025-02-15T09:00:00',
    status: 'publish',
    author: { name: 'Prof. Bola Akanji', slug: 'bola-akanji' },
    featuredImage: {
      sourceUrl: '/images/afcfta-trade.jpg',
      altText: 'AfCFTA trade implementation conference',
      mediaItemId: 101,
      width: 1200,
      height: 675,
    },
    categories: [
      { id: 'cat-trade', name: 'Trade Policy', slug: 'trade-policy' },
      { id: 'cat-afcfta', name: 'AfCFTA', slug: 'afcfta' },
    ],
    tags: [
      { id: 'tag-afcfta', name: 'AfCFTA', slug: 'afcfta' },
      { id: 'tag-trade', name: 'Intra-African Trade', slug: 'intra-african-trade' },
    ],
    uri: '/afcfta-year-two-assessing-trade-flows',
    seo: {
      title: 'AfCFTA Year Two: Assessing Trade Flows and Implementation Progress',
      metaDesc:
        'Analysis of trade flows and implementation progress two years into the African Continental Free Trade Area.',
    },
  },
  {
    id: 'post-2',
    databaseId: 102,
    title: 'Gender and Trade: How African Women Navigate Cross-Border Commerce',
    slug: 'gender-and-trade-african-women-cross-border',
    content: `<p>Women constitute over 70% of informal cross-border traders in many African countries, yet their experiences and challenges remain under-documented in mainstream trade policy discourse. This article draws on field research conducted across five border posts in West Africa to illuminate the lived realities of women traders.</p>
<p>Our findings reveal that while women traders demonstrate remarkable resilience and entrepreneurship, they face systemic barriers including limited access to trade information, bureaucratic hurdles at border crossings, and vulnerability to harassment. These challenges are compounded by gender-specific constraints such as care responsibilities and limited access to finance.</p>`,
    excerpt:
      'Exploring how African women navigate the challenges and opportunities of cross-border trade, based on field research across West African border posts.',
    date: '2025-01-20T11:30:00',
    modified: '2025-01-22T08:45:00',
    status: 'publish',
    author: { name: 'Prof. Bola Akanji', slug: 'bola-akanji' },
    featuredImage: {
      sourceUrl: '/images/gender-trade.jpg',
      altText: 'Women traders at a West African border crossing',
      mediaItemId: 102,
      width: 1200,
      height: 675,
    },
    categories: [
      { id: 'cat-gender', name: 'Gender & Trade', slug: 'gender-trade' },
      { id: 'cat-policy', name: 'Policy', slug: 'policy' },
    ],
    tags: [
      { id: 'tag-gender', name: 'Gender', slug: 'gender' },
      { id: 'tag-informal', name: 'Informal Trade', slug: 'informal-trade' },
    ],
    uri: '/gender-and-trade-african-women-cross-border',
    seo: {
      title: 'Gender and Trade: How African Women Navigate Cross-Border Commerce',
      metaDesc:
        'Field research on the experiences of women informal cross-border traders in West Africa.',
    },
  },
  {
    id: 'post-3',
    databaseId: 103,
    title: 'ECOWAS at 50: Reflecting on Regional Integration Milestones',
    slug: 'ecowas-at-50-regional-integration',
    content: `<p>As the Economic Community of West African States (ECOWAS) marks its 50th anniversary, it is timely to reflect on the region's integration journey—the achievements, the setbacks, and the road ahead. This retrospective examines the evolution of ECOWAS from a customs union aspiration to a complex regional body navigating contemporary challenges.</p>
<p>Over five decades, ECOWAS has achieved notable milestones including the establishment of a free trade area, the introduction of the ECOWAS passport, and protocols on free movement of persons. However, the gap between protocol commitments and implementation reality remains wide, particularly in trade facilitation and monetary cooperation.</p>`,
    excerpt:
      'A retrospective on the Economic Community of West African States at 50, examining integration milestones and ongoing challenges.',
    date: '2024-12-10T14:00:00',
    modified: '2024-12-12T09:00:00',
    status: 'publish',
    author: { name: 'Prof. Bola Akanji', slug: 'bola-akanji' },
    featuredImage: {
      sourceUrl: '/images/ecowas-50.jpg',
      altText: 'ECOWAS headquarters in Abuja',
      mediaItemId: 103,
      width: 1200,
      height: 675,
    },
    categories: [
      { id: 'cat-regional', name: 'Regional Integration', slug: 'regional-integration' },
      { id: 'cat-ecowas', name: 'ECOWAS', slug: 'ecowas' },
    ],
    tags: [
      { id: 'tag-ecowas', name: 'ECOWAS', slug: 'ecowas' },
      { id: 'tag-integration', name: 'Regional Integration', slug: 'regional-integration' },
    ],
    uri: '/ecowas-at-50-regional-integration',
    seo: {
      title: 'ECOWAS at 50: Reflecting on Regional Integration Milestones',
      metaDesc:
        'Reflecting on 50 years of ECOWAS regional integration—achievements, setbacks, and the road ahead for West Africa.',
    },
  },
  {
    id: 'post-4',
    databaseId: 104,
    title: 'Trade Facilitation in Africa: Measuring the Impact of Single Window Systems',
    slug: 'trade-facilitation-single-window-systems',
    content: `<p>Single window systems for trade facilitation have been adopted by several African countries as part of their commitments under the WTO Trade Facilitation Agreement and the AfCFTA. This article presents findings from a comparative study of single window implementations in Ghana, Kenya, and Rwanda.</p>
<p>Our research shows that effective single window systems can reduce border clearance times by up to 60% and decrease trade transaction costs by 30-40%. However, the success of these systems depends critically on inter-agency coordination, IT infrastructure, and stakeholder engagement.</p>`,
    excerpt:
      'Comparative analysis of single window trade facilitation systems in Africa, measuring their impact on border clearance efficiency.',
    date: '2024-11-05T10:00:00',
    modified: '2024-11-05T10:00:00',
    status: 'publish',
    author: { name: 'Prof. Bola Akanji', slug: 'bola-akanji' },
    featuredImage: {
      sourceUrl: '/images/trade-facilitation.jpg',
      altText: 'Trade facilitation single window systems',
      mediaItemId: 104,
      width: 1200,
      height: 675,
    },
    categories: [
      { id: 'cat-facilitation', name: 'Trade Facilitation', slug: 'trade-facilitation' },
    ],
    tags: [
      { id: 'tag-facilitation', name: 'Trade Facilitation', slug: 'trade-facilitation' },
      { id: 'tag-digital', name: 'Digital Trade', slug: 'digital-trade' },
    ],
    uri: '/trade-facilitation-single-window-systems',
    seo: {
      title: 'Trade Facilitation in Africa: Measuring the Impact of Single Window Systems',
      metaDesc:
        'Comparative study of single window trade facilitation implementations in Ghana, Kenya, and Rwanda.',
    },
  },
];

// =============================================================================
// Publications
// =============================================================================

export const mockPublications: WPPublication[] = [
  {
    id: 'pub-1',
    databaseId: 201,
    title:
      'Implementation of the AfCFTA: Early Trade Outcomes and Emerging Policy Challenges',
    slug: 'implementation-afcfta-early-trade-outcomes',
    content:
      '<p>This paper examines the early trade outcomes under the African Continental Free Trade Area, analyzing customs data and tariff schedules from participating member states to assess the agreement\'s initial impact on intra-African trade flows.</p>',
    excerpt:
      'Examining early trade outcomes under the AfCFTA and the policy challenges emerging from the first phase of implementation.',
    date: '2025-01-15T00:00:00',
    modified: '2025-01-15T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/pub-afcfta.jpg',
      altText: 'AfCFTA implementation research publication',
      mediaItemId: 201,
      width: 800,
      height: 450,
    },
    uri: '/publications/implementation-afcfta-early-trade-outcomes',
    acfPublicationFields: {
      publicationType: 'journal-article',
      authors:
        'Akanji, B.O., Mensah, J.K., & Okafor, C.N.',
      journal: 'Journal of African Trade',
      year: '2025',
      volume: '12',
      issue: '1',
      pages: '45-72',
      doi: '10.1016/j.joat.2025.01.003',
      publisher: 'Elsevier',
      abstract:
        'This paper examines the early trade outcomes under the African Continental Free Trade Area (AfCFTA), analyzing customs data from 15 participating member states. We find that intra-African trade under preferential tariffs has grown modestly, with significant variation across regions. East Africa shows the strongest uptake while West Africa faces implementation challenges related to rules of origin compliance and non-tariff barriers. Policy recommendations focus on harmonizing trade documentation and strengthening customs capacity.',
      keywords:
        'AfCFTA, intra-African trade, regional integration, trade policy, rules of origin',
      downloadUrl: '/downloads/afcfta-early-outcomes-2025.pdf',
      externalUrl:
        'https://doi.org/10.1016/j.joat.2025.01.003',
      citationCount: 12,
      isFeatured: true,
    },
    seo: {
      title:
        'Implementation of the AfCFTA: Early Trade Outcomes and Emerging Policy Challenges',
      metaDesc:
        'Journal article examining early trade outcomes under the African Continental Free Trade Area and policy challenges from the first phase of implementation.',
    },
  },
  {
    id: 'pub-2',
    databaseId: 202,
    title:
      'Gender Dimensions of Trade Policy in West Africa: Evidence from Informal Cross-Border Traders',
    slug: 'gender-dimensions-trade-policy-west-africa',
    content:
      '<p>This study investigates the gender-specific impacts of trade policy on informal cross-border traders in West Africa, drawing on primary survey data from over 500 women traders across five border posts.</p>',
    excerpt:
      'Investigating the gender-specific impacts of trade policy on informal cross-border traders in West Africa.',
    date: '2024-09-20T00:00:00',
    modified: '2024-10-05T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/pub-gender.jpg',
      altText: 'Gender and trade policy research',
      mediaItemId: 202,
      width: 800,
      height: 450,
    },
    uri: '/publications/gender-dimensions-trade-policy-west-africa',
    acfPublicationFields: {
      publicationType: 'journal-article',
      authors: 'Akanji, B.O. & Diop, F.',
      journal: 'World Development',
      year: '2024',
      volume: '178',
      issue: '',
      pages: '106258',
      doi: '10.1016/j.worlddev.2024.106258',
      publisher: 'Elsevier',
      abstract:
        'This study investigates the gender-specific impacts of trade policy on informal cross-border traders in West Africa. Drawing on primary survey data from over 500 women traders across five border posts, we find that existing trade policies systematically disadvantage women through information asymmetries, procedural complexities, and gender-blind institutional frameworks. We propose a gender-responsive trade facilitation framework that addresses these structural barriers.',
      keywords:
        'gender, trade policy, informal trade, West Africa, cross-border traders',
      downloadUrl: '/downloads/gender-trade-west-africa-2024.pdf',
      externalUrl: 'https://doi.org/10.1016/j.worlddev.2024.106258',
      citationCount: 28,
      isFeatured: true,
    },
    seo: {
      title:
        'Gender Dimensions of Trade Policy in West Africa: Evidence from Informal Cross-Border Traders',
      metaDesc:
        'Journal article on gender-specific impacts of trade policy on informal cross-border traders in West Africa.',
    },
  },
  {
    id: 'pub-3',
    databaseId: 203,
    title:
      'Non-Tariff Barriers and Agricultural Trade in ECOWAS: A Quantitative Assessment',
    slug: 'non-tariff-barriers-agricultural-trade-ecowas',
    content:
      '<p>A quantitative assessment of the impact of non-tariff barriers on agricultural trade flows within the ECOWAS region, using gravity model estimation techniques.</p>',
    excerpt:
      'Quantitative assessment of non-tariff barriers\' impact on agricultural trade flows within the ECOWAS region.',
    date: '2024-06-10T00:00:00',
    modified: '2024-06-10T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/publications/non-tariff-barriers-agricultural-trade-ecowas',
    acfPublicationFields: {
      publicationType: 'journal-article',
      authors:
        'Akanji, B.O., Souley, A.M., & Boateng, K.',
      journal: 'African Development Review',
      year: '2024',
      volume: '36',
      issue: '2',
      pages: '112-130',
      doi: '10.1111/1467-8268.13045',
      publisher: 'Wiley',
      abstract:
        'Non-tariff barriers (NTBs) remain a significant impediment to agricultural trade within ECOWAS despite the region\'s commitment to a customs union. Using an augmented gravity model with panel data from 2005-2022, we estimate the trade-restrictive effects of specific NTBs including sanitary and phytosanitary measures, technical barriers to trade, and administrative procedures. Results indicate that NTBs reduce agricultural trade volumes by approximately 35% compared to a no-NTB scenario.',
      keywords:
        'non-tariff barriers, agricultural trade, ECOWAS, gravity model, regional integration',
      downloadUrl: '/downloads/ntb-agricultural-ecowas-2024.pdf',
      externalUrl:
        'https://doi.org/10.1111/1467-8268.13045',
      citationCount: 19,
      isFeatured: false,
    },
    seo: {
      title:
        'Non-Tariff Barriers and Agricultural Trade in ECOWAS: A Quantitative Assessment',
      metaDesc:
        'Quantitative assessment of NTBs\' impact on agricultural trade in ECOWAS using gravity model estimation.',
    },
  },
  {
    id: 'pub-4',
    databaseId: 204,
    title:
      'Regional Value Chains and Industrialization in Africa: Prospects Under the AfCFTA',
    slug: 'regional-value-chains-industrialization-afcfta',
    content:
      '<p>This book chapter explores how the AfCFTA can serve as a catalyst for developing regional value chains and promoting industrialization across the African continent.</p>',
    excerpt:
      'Exploring how the AfCFTA can catalyze regional value chain development and industrialization in Africa.',
    date: '2024-03-15T00:00:00',
    modified: '2024-03-15T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/pub-value-chains.jpg',
      altText: 'Regional value chains research publication',
      mediaItemId: 204,
      width: 800,
      height: 450,
    },
    uri: '/publications/regional-value-chains-industrialization-afcfta',
    acfPublicationFields: {
      publicationType: 'book-chapter',
      authors: 'Akanji, B.O.',
      journal: '',
      year: '2024',
      volume: '',
      issue: '',
      pages: '89-118',
      doi: '',
      publisher: 'Oxford University Press',
      abstract:
        'This chapter examines the potential of the African Continental Free Trade Area to catalyze the development of regional value chains (RVCs) as a pathway to industrialization. Drawing on case studies from the automotive, pharmaceutical, and agro-processing sectors, we analyze the conditions under which RVCs can thrive in Africa and the policy interventions required to overcome existing constraints including infrastructure gaps, regulatory harmonization needs, and skills development.',
      keywords:
        'regional value chains, industrialization, AfCFTA, automotive, pharmaceutical, agro-processing',
      downloadUrl: '',
      externalUrl: '',
      citationCount: 8,
      isFeatured: true,
    },
    seo: {
      title:
        'Regional Value Chains and Industrialization in Africa: Prospects Under the AfCFTA',
      metaDesc:
        'Book chapter on how the AfCFTA can catalyze regional value chain development and industrialization in Africa.',
    },
  },
  {
    id: 'pub-5',
    databaseId: 205,
    title:
      'Trade Policy Space for Industrial Development: Lessons from African Economic Zones',
    slug: 'trade-policy-space-industrial-development',
    content:
      '<p>A working paper analyzing how African countries can leverage trade policy space for industrial development, with evidence from special economic zones across the continent.</p>',
    excerpt:
      'Analyzing how African countries can leverage trade policy space for industrial development through special economic zones.',
    date: '2024-01-30T00:00:00',
    modified: '2024-02-15T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/publications/trade-policy-space-industrial-development',
    acfPublicationFields: {
      publicationType: 'working-paper',
      authors: 'Akanji, B.O. & Ndlovu, T.',
      journal: '',
      year: '2024',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      publisher: 'African Economic Research Consortium',
      abstract:
        'This working paper examines the trade policy space available to African countries for pursuing industrial development objectives. Through comparative analysis of special economic zones (SEZs) in Ethiopia, Nigeria, Rwanda, and Tanzania, we identify the policy instruments and institutional arrangements that have been most effective in attracting investment and promoting industrial upgrading. The paper also considers the constraints imposed by WTO rules and regional trade agreements on industrial policy.',
      keywords:
        'trade policy, industrial development, special economic zones, Africa, WTO',
      downloadUrl: '/downloads/trade-policy-space-2024.pdf',
      externalUrl: '',
      citationCount: 5,
      isFeatured: false,
    },
    seo: {
      title:
        'Trade Policy Space for Industrial Development: Lessons from African Economic Zones',
      metaDesc:
        'Working paper on leveraging trade policy space for industrial development in Africa through special economic zones.',
    },
  },
  {
    id: 'pub-6',
    databaseId: 206,
    title:
      'Navigating the AfCFTA: A Policy Guide for West African Small and Medium Enterprises',
    slug: 'navigating-afcfta-policy-guide-smes',
    content:
      '<p>A policy brief providing practical guidance for West African SMEs seeking to benefit from the AfCFTA.</p>',
    excerpt:
      'Policy brief providing practical guidance for West African SMEs on leveraging the AfCFTA.',
    date: '2023-11-20T00:00:00',
    modified: '2023-12-01T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/pub-sme-guide.jpg',
      altText: 'AfCFTA policy guide for SMEs',
      mediaItemId: 206,
      width: 800,
      height: 450,
    },
    uri: '/publications/navigating-afcfta-policy-guide-smes',
    acfPublicationFields: {
      publicationType: 'policy-brief',
      authors: 'Akanji, B.O.',
      journal: '',
      year: '2023',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      publisher: 'Trade Policy Research Centre',
      abstract:
        'This policy brief provides practical guidance for West African small and medium enterprises (SMEs) seeking to leverage the opportunities created by the African Continental Free Trade Area. It covers key aspects including understanding tariff preferences, meeting rules of origin requirements, navigating customs procedures, and accessing trade facilitation support. The brief draws on case studies of successful SME cross-border expansion.',
      keywords: 'AfCFTA, SMEs, trade policy, West Africa, business guide',
      downloadUrl: '/downloads/afcfta-sme-guide-2023.pdf',
      externalUrl: '',
      citationCount: 15,
      isFeatured: false,
    },
    seo: {
      title:
        'Navigating the AfCFTA: A Policy Guide for West African SMEs',
      metaDesc:
        'Policy brief providing practical AfCFTA guidance for West African small and medium enterprises.',
    },
  },
];

// =============================================================================
// Projects
// =============================================================================

export const mockProjects: WPProject[] = [
  {
    id: 'proj-1',
    databaseId: 301,
    title: 'AfCFTA Implementation Monitoring and Impact Assessment',
    slug: 'afcfta-implementation-monitoring',
    content: `<p>This multi-year research project monitors the implementation of the African Continental Free Trade Area across participating member states, tracking trade flows, tariff liberalization schedules, and the real-world impacts on businesses and livelihoods.</p>
<h3>Research Objectives</h3>
<ul>
<li>Track the pace and quality of AfCFTA implementation across participating states</li>
<li>Assess the impact of preferential tariff treatment on intra-African trade volumes</li>
<li>Evaluate the effects on small and medium enterprises and informal traders</li>
<li>Identify implementation bottlenecks and propose policy solutions</li>
</ul>`,
    excerpt:
      'Multi-year research project monitoring AfCFTA implementation across participating member states and assessing impacts on trade and livelihoods.',
    date: '2023-06-01T00:00:00',
    modified: '2025-02-28T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/proj-afcfta.jpg',
      altText: 'AfCFTA implementation monitoring research',
      mediaItemId: 301,
      width: 1200,
      height: 675,
    },
    uri: '/projects/afcfta-implementation-monitoring',
    acfProjectFields: {
      projectStatus: 'ongoing',
      startDate: '2023-06-01',
      endDate: '2026-05-31',
      fundingAgency: 'African Development Bank',
      grantAmount: '$450,000',
      principalInvestigator: 'Prof. Bola Akanji',
      coInvestigators: 'Dr. James Mensah (University of Ghana), Dr. Chioma Okafor (University of Nigeria)',
      partnerInstitutions:
        'University of Ghana, University of Nairobi, University of Pretoria',
      projectUrl: '',
      publications:
        'Implementation of the AfCFTA: Early Trade Outcomes and Emerging Policy Challenges (2025)',
      highlights:
        'Presented preliminary findings at the African Union Trade Ministers meeting, January 2025. Published two working papers and one journal article. Established a network of trade policy researchers across 10 African countries.',
      isFeatured: true,
    },
    seo: {
      title: 'AfCFTA Implementation Monitoring and Impact Assessment',
      metaDesc:
        'Multi-year research project monitoring AfCFTA implementation and assessing impacts on trade and livelihoods across Africa.',
    },
  },
  {
    id: 'proj-2',
    databaseId: 302,
    title: 'Gender-Responsive Trade Facilitation in West Africa',
    slug: 'gender-responsive-trade-facilitation',
    content: `<p>This project investigates the gender dimensions of trade facilitation in West Africa, with a focus on developing practical tools and policy recommendations to make trade processes more inclusive and accessible for women traders.</p>
<h3>Research Objectives</h3>
<ul>
<li>Document the experiences of women informal cross-border traders at selected border posts</li>
<li>Identify gender-specific barriers to trade facilitation</li>
<li>Develop a gender-responsive trade facilitation assessment toolkit</li>
<li>Pilot and validate the toolkit with border agencies in Ghana and Nigeria</li>
</ul>`,
    excerpt:
      'Investigating gender dimensions of trade facilitation in West Africa and developing inclusive trade policy tools.',
    date: '2022-09-01T00:00:00',
    modified: '2025-01-15T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/proj-gender.jpg',
      altText: 'Gender-responsive trade facilitation research',
      mediaItemId: 302,
      width: 1200,
      height: 675,
    },
    uri: '/projects/gender-responsive-trade-facilitation',
    acfProjectFields: {
      projectStatus: 'ongoing',
      startDate: '2022-09-01',
      endDate: '2025-08-31',
      fundingAgency: 'International Development Research Centre (IDRC)',
      grantAmount: '$380,000',
      principalInvestigator: 'Prof. Bola Akanji',
      coInvestigators: 'Dr. Fatou Diop (Cheikh Anta Diop University), Dr. Amina Souley (Université Abdou Moumouni)',
      partnerInstitutions:
        'Cheikh Anta Diop University, Université Abdou Moumouni, Trade Policy Research Centre',
      projectUrl: '',
      publications:
        'Gender Dimensions of Trade Policy in West Africa: Evidence from Informal Cross-Border Traders (2024)',
      highlights:
        'Developed a gender-responsive trade facilitation toolkit currently being piloted at three border posts. Trained 45 border agency officials on gender-sensitive trade procedures. Published one article in World Development.',
      isFeatured: true,
    },
    seo: {
      title: 'Gender-Responsive Trade Facilitation in West Africa',
      metaDesc:
        'Research project on gender dimensions of trade facilitation in West Africa, developing inclusive policy tools.',
    },
  },
  {
    id: 'proj-3',
    databaseId: 303,
    title:
      'ECOWAS Agricultural Trade Integration: Overcoming Non-Tariff Barriers',
    slug: 'ecowas-agricultural-trade-ntbs',
    content: `<p>This project quantifies the impact of non-tariff barriers on agricultural trade within the ECOWAS region and develops policy recommendations for their removal or reduction, with a focus on food security and smallholder farmer welfare.</p>`,
    excerpt:
      'Quantifying the impact of non-tariff barriers on agricultural trade in ECOWAS and developing policy solutions.',
    date: '2021-03-01T00:00:00',
    modified: '2024-06-30T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/proj-ecowas.jpg',
      altText: 'ECOWAS agricultural trade research',
      mediaItemId: 303,
      width: 1200,
      height: 675,
    },
    uri: '/projects/ecowas-agricultural-trade-ntbs',
    acfProjectFields: {
      projectStatus: 'completed',
      startDate: '2021-03-01',
      endDate: '2024-02-28',
      fundingAgency: 'European Union Delegation to ECOWAS',
      grantAmount: '$320,000',
      principalInvestigator: 'Prof. Bola Akanji',
      coInvestigators: 'Dr. Kwame Boateng (University of Cape Coast), Dr. Abdoulaye Souley (University of Niamey)',
      partnerInstitutions:
        'ECOWAS Commission, University of Cape Coast, University of Niamey',
      projectUrl: '',
      publications:
        'Non-Tariff Barriers and Agricultural Trade in ECOWAS: A Quantitative Assessment (2024)',
      highlights:
        'Presented findings to ECOWAS Trade Ministers. Contributed to the ECOWAS NTB monitoring and elimination mechanism. Published one journal article and three policy briefs.',
      isFeatured: false,
    },
    seo: {
      title:
        'ECOWAS Agricultural Trade Integration: Overcoming Non-Tariff Barriers',
      metaDesc:
        'Research on non-tariff barriers to agricultural trade in ECOWAS and policy recommendations for removal.',
    },
  },
  {
    id: 'proj-4',
    databaseId: 304,
    title: 'Digital Trade Infrastructure and E-Commerce Development in Africa',
    slug: 'digital-trade-infrastructure-africa',
    content: `<p>This upcoming project will examine the state of digital trade infrastructure across Africa and develop frameworks for e-commerce development that support inclusive growth, with particular attention to the AfCFTA Protocol on Digital Trade.</p>`,
    excerpt:
      'Examining digital trade infrastructure and e-commerce development opportunities across Africa under the AfCFTA.',
    date: '2025-01-15T00:00:00',
    modified: '2025-01-15T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/proj-digital.jpg',
      altText: 'Digital trade infrastructure research',
      mediaItemId: 304,
      width: 1200,
      height: 675,
    },
    uri: '/projects/digital-trade-infrastructure-africa',
    acfProjectFields: {
      projectStatus: 'upcoming',
      startDate: '2025-07-01',
      endDate: '2028-06-30',
      fundingAgency: 'Bill & Melinda Gates Foundation',
      grantAmount: '$520,000',
      principalInvestigator: 'Prof. Bola Akanji',
      coInvestigators: 'To be confirmed',
      partnerInstitutions:
        'University of Nairobi, Stellenbosch University, Cairo University',
      projectUrl: '',
      publications: '',
      highlights:
        'Project approved for funding. Scoping study underway. Expected to launch in July 2025.',
      isFeatured: false,
    },
    seo: {
      title: 'Digital Trade Infrastructure and E-Commerce Development in Africa',
      metaDesc:
        'Upcoming research on digital trade infrastructure and e-commerce development in Africa under the AfCFTA.',
    },
  },
];

// =============================================================================
// Events
// =============================================================================

export const mockEvents: WPEvent[] = [
  {
    id: 'event-1',
    databaseId: 401,
    title: 'African Trade Policy Conference 2025',
    slug: 'african-trade-policy-conference-2025',
    content: `<p>The 2025 African Trade Policy Conference brings together leading researchers, policy-makers, and practitioners to discuss the latest developments in African trade integration, with a special focus on the AfCFTA implementation progress and the emerging digital trade agenda.</p>
<p>Professor Akanji will deliver the keynote address on "AfCFTA at the Crossroads: From Agreement to Impact" and participate in a panel discussion on trade facilitation reforms.</p>`,
    excerpt:
      'Annual conference on African trade policy, featuring keynote by Prof. Akanji on AfCFTA implementation progress.',
    date: '2025-03-10T00:00:00',
    modified: '2025-03-01T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/event-conference-2025.jpg',
      altText: 'African Trade Policy Conference 2025',
      mediaItemId: 401,
      width: 1200,
      height: 675,
    },
    uri: '/events/african-trade-policy-conference-2025',
    acfEventFields: {
      eventStartDate: '2025-06-15',
      eventEndDate: '2025-06-18',
      eventTime: '09:00 - 17:00 GMT',
      venue: 'International Conference Centre',
      city: 'Abuja',
      country: 'Nigeria',
      eventType: 'conference',
      registrationUrl: 'https://atpc2025.org/register',
      organizer: 'African Trade Policy Network',
      isVirtual: false,
      isFeatured: true,
    },
    seo: {
      title: 'African Trade Policy Conference 2025',
      metaDesc:
        'Annual African trade policy conference in Abuja, featuring keynote by Prof. Akanji on AfCFTA implementation.',
    },
  },
  {
    id: 'event-2',
    databaseId: 402,
    title: 'Workshop: Gender-Responsive Trade Policy Tools for West Africa',
    slug: 'workshop-gender-responsive-trade-tools',
    content: `<p>This hands-on workshop presents the gender-responsive trade facilitation toolkit developed through the IDRC-funded research project. Participants will learn to apply the toolkit in their border operations and trade policy formulation.</p>
<p>The workshop is designed for border agency officials, trade ministry staff, and development practitioners working on trade facilitation in West Africa.</p>`,
    excerpt:
      'Hands-on workshop presenting the gender-responsive trade facilitation toolkit for West African border and trade officials.',
    date: '2025-02-20T00:00:00',
    modified: '2025-02-20T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/event-workshop.jpg',
      altText: 'Gender-responsive trade policy workshop',
      mediaItemId: 402,
      width: 1200,
      height: 675,
    },
    uri: '/events/workshop-gender-responsive-trade-tools',
    acfEventFields: {
      eventStartDate: '2025-04-22',
      eventEndDate: '2025-04-23',
      eventTime: '10:00 - 16:00 GMT',
      venue: 'ECOWAS Commission Headquarters',
      city: 'Abuja',
      country: 'Nigeria',
      eventType: 'workshop',
      registrationUrl: '',
      organizer: 'IDRC / Trade Policy Research Centre',
      isVirtual: false,
      isFeatured: true,
    },
    seo: {
      title: 'Workshop: Gender-Responsive Trade Policy Tools for West Africa',
      metaDesc:
        'Workshop on gender-responsive trade facilitation tools for West African officials and practitioners.',
    },
  },
  {
    id: 'event-3',
    databaseId: 403,
    title: 'Public Lecture: The Future of African Regional Integration',
    slug: 'public-lecture-future-african-integration',
    content: `<p>In this public lecture, Professor Akanji reflects on the achievements and challenges of African regional integration, drawing on three decades of research and policy engagement. The lecture will consider how the AfCFTA, digital transformation, and changing global trade dynamics are reshaping the integration agenda.</p>`,
    excerpt:
      'Public lecture on the future of African regional integration, reflecting on three decades of research and policy engagement.',
    date: '2025-01-10T00:00:00',
    modified: '2025-01-10T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/event-lecture.jpg',
      altText: 'Public lecture on African regional integration',
      mediaItemId: 403,
      width: 1200,
      height: 675,
    },
    uri: '/events/public-lecture-future-african-integration',
    acfEventFields: {
      eventStartDate: '2025-03-27',
      eventEndDate: '2025-03-27',
      eventTime: '17:00 - 19:00 GMT',
      venue: 'University of Ibadan, Arts Theatre',
      city: 'Ibadan',
      country: 'Nigeria',
      eventType: 'lecture',
      registrationUrl: '',
      organizer: 'University of Ibadan, Department of Economics',
      isVirtual: false,
      isFeatured: false,
    },
    seo: {
      title: 'Public Lecture: The Future of African Regional Integration',
      metaDesc:
        'Public lecture by Prof. Akanji on the future of African regional integration at the University of Ibadan.',
    },
  },
  {
    id: 'event-4',
    databaseId: 404,
    title: 'Webinar: AfCFTA Rules of Origin - Practical Guidance for Exporters',
    slug: 'webinar-afcfta-rules-origin',
    content: `<p>This webinar provides practical guidance for African exporters on understanding and complying with AfCFTA rules of origin requirements. The session covers the key provisions, documentation requirements, and common compliance pitfalls.</p>`,
    excerpt:
      'Webinar providing practical guidance on AfCFTA rules of origin compliance for African exporters.',
    date: '2024-12-05T00:00:00',
    modified: '2024-12-05T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/events/webinar-afcfta-rules-origin',
    acfEventFields: {
      eventStartDate: '2025-02-12',
      eventEndDate: '2025-02-12',
      eventTime: '14:00 - 15:30 GMT',
      venue: '',
      city: '',
      country: '',
      eventType: 'webinar',
      registrationUrl: 'https://zoom.us/meeting/register/abc123',
      organizer: 'Trade Policy Research Centre',
      isVirtual: true,
      isFeatured: false,
    },
    seo: {
      title: 'Webinar: AfCFTA Rules of Origin - Practical Guidance for Exporters',
      metaDesc:
        'Webinar on AfCFTA rules of origin compliance for African exporters.',
    },
  },
];

// =============================================================================
// Resources
// =============================================================================

export const mockResources: WPResource[] = [
  {
    id: 'res-1',
    databaseId: 501,
    title: 'AfCFTA Tariff Liberalization Schedule Tracker',
    slug: 'afcfta-tariff-liberalization-tracker',
    content:
      '<p>An interactive dataset tracking the tariff liberalization commitments of AfCFTA participating states across all tariff lines and implementation phases.</p>',
    excerpt:
      'Interactive dataset tracking AfCFTA tariff liberalization commitments across participating states.',
    date: '2025-01-30T00:00:00',
    modified: '2025-02-15T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/resources/afcfta-tariff-liberalization-tracker',
    acfResourceFields: {
      resourceType: 'dataset',
      fileSize: '12.5 MB',
      fileFormat: 'CSV/XLSX',
      downloadUrl: '/downloads/afcfta-tariff-tracker-2025.zip',
      externalUrl: '',
      version: '3.2',
      license: 'CC BY 4.0',
      isGated: false,
      isFeatured: true,
    },
    seo: {
      title: 'AfCFTA Tariff Liberalization Schedule Tracker',
      metaDesc:
        'Interactive dataset tracking AfCFTA tariff liberalization commitments across participating states.',
    },
  },
  {
    id: 'res-2',
    databaseId: 502,
    title: 'Gender-Responsive Trade Facilitation Assessment Toolkit',
    slug: 'gender-responsive-trade-toolkit',
    content:
      '<p>A comprehensive toolkit for assessing and improving the gender-responsiveness of trade facilitation processes at border posts and in trade policy formulation.</p>',
    excerpt:
      'Toolkit for assessing and improving gender-responsiveness of trade facilitation processes.',
    date: '2024-11-15T00:00:00',
    modified: '2024-12-20T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/res-toolkit.jpg',
      altText: 'Gender-responsive trade facilitation toolkit',
      mediaItemId: 502,
      width: 800,
      height: 450,
    },
    uri: '/resources/gender-responsive-trade-toolkit',
    acfResourceFields: {
      resourceType: 'tool',
      fileSize: '8.2 MB',
      fileFormat: 'PDF',
      downloadUrl: '/downloads/gender-trade-toolkit-2024.pdf',
      externalUrl: '',
      version: '1.0',
      license: 'CC BY-NC 4.0',
      isGated: true,
      isFeatured: true,
    },
    seo: {
      title: 'Gender-Responsive Trade Facilitation Assessment Toolkit',
      metaDesc:
        'Comprehensive toolkit for gender-responsive trade facilitation assessment and improvement.',
    },
  },
  {
    id: 'res-3',
    databaseId: 503,
    title: 'ECOWAS Non-Tariff Barriers Database',
    slug: 'ecowas-ntb-database',
    content:
      '<p>A comprehensive database of reported non-tariff barriers to trade within the ECOWAS region, compiled from official complaints, research surveys, and customs records.</p>',
    excerpt:
      'Comprehensive database of non-tariff barriers to trade within the ECOWAS region.',
    date: '2024-08-20T00:00:00',
    modified: '2024-10-15T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/resources/ecowas-ntb-database',
    acfResourceFields: {
      resourceType: 'dataset',
      fileSize: '25.3 MB',
      fileFormat: 'CSV/SQL',
      downloadUrl: '/downloads/ecowas-ntb-database-2024.zip',
      externalUrl: '',
      version: '2.1',
      license: 'CC BY 4.0',
      isGated: false,
      isFeatured: false,
    },
    seo: {
      title: 'ECOWAS Non-Tariff Barriers Database',
      metaDesc:
        'Comprehensive database of non-tariff barriers to trade within the ECOWAS region.',
    },
  },
  {
    id: 'res-4',
    databaseId: 504,
    title: 'AfCFTA Implementation: Key Policy Briefings 2024',
    slug: 'afcfta-policy-briefings-2024',
    content:
      '<p>A collection of policy briefings summarizing key findings and recommendations from AfCFTA implementation monitoring research conducted throughout 2024.</p>',
    excerpt:
      'Collection of policy briefings on AfCFTA implementation findings and recommendations from 2024.',
    date: '2024-12-10T00:00:00',
    modified: '2024-12-10T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/res-briefings.jpg',
      altText: 'AfCFTA policy briefings collection',
      mediaItemId: 504,
      width: 800,
      height: 450,
    },
    uri: '/resources/afcfta-policy-briefings-2024',
    acfResourceFields: {
      resourceType: 'policy-note',
      fileSize: '4.8 MB',
      fileFormat: 'PDF',
      downloadUrl: '/downloads/afcfta-policy-briefings-2024.pdf',
      externalUrl: '',
      version: '1.0',
      license: 'CC BY 4.0',
      isGated: true,
      isFeatured: true,
    },
    seo: {
      title: 'AfCFTA Implementation: Key Policy Briefings 2024',
      metaDesc:
        'Collection of policy briefings on AfCFTA implementation findings and recommendations.',
    },
  },
  {
    id: 'res-5',
    databaseId: 505,
    title: 'Presentation: Africa\'s Trade Integration at a Crossroads',
    slug: 'presentation-africa-trade-crossroads',
    content:
      '<p>Keynote presentation delivered at the African Trade Policy Network annual meeting, examining the critical decisions facing African trade integration in the context of global disruptions.</p>',
    excerpt:
      'Keynote presentation on Africa\'s trade integration challenges and opportunities.',
    date: '2024-09-30T00:00:00',
    modified: '2024-09-30T00:00:00',
    status: 'publish',
    featuredImage: null,
    uri: '/resources/presentation-africa-trade-crossroads',
    acfResourceFields: {
      resourceType: 'presentation',
      fileSize: '15.6 MB',
      fileFormat: 'PPTX/PDF',
      downloadUrl: '/downloads/africa-trade-crossroads-2024.pdf',
      externalUrl: '',
      version: '',
      license: 'CC BY-NC-ND 4.0',
      isGated: false,
      isFeatured: false,
    },
    seo: {
      title: 'Presentation: Africa\'s Trade Integration at a Crossroads',
      metaDesc:
        'Keynote presentation on Africa\'s trade integration challenges and opportunities.',
    },
  },
  {
    id: 'res-6',
    databaseId: 506,
    title: 'Infographic: Intra-African Trade Flows 2024',
    slug: 'infographic-intra-african-trade-2024',
    content:
      '<p>A visual overview of intra-African trade flows in 2024, highlighting key corridors, commodity compositions, and the impact of the AfCFTA on trade patterns.</p>',
    excerpt:
      'Visual overview of intra-African trade flows and AfCFTA impacts in 2024.',
    date: '2024-07-15T00:00:00',
    modified: '2024-07-15T00:00:00',
    status: 'publish',
    featuredImage: {
      sourceUrl: '/images/res-infographic.jpg',
      altText: 'Intra-African trade flows infographic 2024',
      mediaItemId: 506,
      width: 1200,
      height: 800,
    },
    uri: '/resources/infographic-intra-african-trade-2024',
    acfResourceFields: {
      resourceType: 'infographic',
      fileSize: '2.1 MB',
      fileFormat: 'PNG/PDF',
      downloadUrl: '/downloads/intra-african-trade-infographic-2024.pdf',
      externalUrl: '',
      version: '',
      license: 'CC BY 4.0',
      isGated: false,
      isFeatured: false,
    },
    seo: {
      title: 'Infographic: Intra-African Trade Flows 2024',
      metaDesc:
        'Visual overview of intra-African trade flows and AfCFTA impacts in 2024.',
    },
  },
];

// =============================================================================
// Media Items
// =============================================================================

export const mockMediaItems: WPMedia[] = [
  {
    id: 'media-1',
    databaseId: 1,
    title: 'Hero - Professor Akanji',
    slug: 'hero-professor-akanji',
    altText: 'Professor Bola Akanji at a trade policy conference',
    sourceUrl: '/images/hero-professor.jpg',
    mediaType: 'image',
    mimeType: 'image/jpeg',
    width: 1200,
    height: 600,
    caption: 'Prof. Bola Akanji delivering a keynote address at the African Trade Policy Conference',
    date: '2024-01-15T10:00:00',
  },
  {
    id: 'media-2',
    databaseId: 2,
    title: 'About - Professor Portrait',
    slug: 'about-professor-portrait',
    altText: 'Professor Bola Akanji in her office',
    sourceUrl: '/images/about-prof.jpg',
    mediaType: 'image',
    mimeType: 'image/jpeg',
    width: 800,
    height: 600,
    caption: 'Prof. Akanji in her research office at the University of Ibadan',
    date: '2024-01-15T10:00:00',
  },
  {
    id: 'media-3',
    databaseId: 101,
    title: 'AfCFTA Trade Conference',
    slug: 'afcfta-trade-conference',
    altText: 'AfCFTA trade implementation conference',
    sourceUrl: '/images/afcfta-trade.jpg',
    mediaType: 'image',
    mimeType: 'image/jpeg',
    width: 1200,
    height: 675,
    caption: 'Delegates at the AfCFTA implementation review meeting',
    date: '2025-02-10T09:00:00',
  },
];

// =============================================================================
// Partners
// =============================================================================

export const mockPartners: WPPartner[] = [
  {
    id: 'partner-1',
    databaseId: 601,
    title: 'University of Ibadan',
    slug: 'university-of-ibadan',
    content:
      '<p>The University of Ibadan is Nigeria\'s premier university and a leading institution for economics and trade policy research in West Africa.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-ui.jpg',
      altText: 'University of Ibadan logo',
      mediaItemId: 601,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'university',
      website: 'https://ui.edu.ng',
      country: 'Nigeria',
      partnershipSince: '2005',
      description:
        'Nigeria\'s premier university and the primary academic home for Prof. Akanji\'s research activities.',
      isFeatured: true,
    },
  },
  {
    id: 'partner-2',
    databaseId: 602,
    title: 'African Development Bank',
    slug: 'african-development-bank',
    content:
      '<p>The African Development Bank Group is a multilateral development finance institution focused on spurring sustainable economic development and social progress in Africa.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-afdb.jpg',
      altText: 'African Development Bank logo',
      mediaItemId: 602,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'international-organization',
      website: 'https://www.afdb.org',
      country: 'Côte d\'Ivoire',
      partnershipSince: '2018',
      description:
        'Funding partner for the AfCFTA Implementation Monitoring and Impact Assessment project.',
      isFeatured: true,
    },
  },
  {
    id: 'partner-3',
    databaseId: 603,
    title: 'International Development Research Centre',
    slug: 'idrc',
    content:
      '<p>IDRC is a Canadian Crown corporation that funds research in developing countries to promote growth, reduce poverty, and drive large-scale positive change.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-idrc.jpg',
      altText: 'IDRC logo',
      mediaItemId: 603,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'international-organization',
      website: 'https://www.idrc.ca',
      country: 'Canada',
      partnershipSince: '2022',
      description:
        'Funding partner for the Gender-Responsive Trade Facilitation in West Africa project.',
      isFeatured: true,
    },
  },
  {
    id: 'partner-4',
    databaseId: 604,
    title: 'University of Ghana',
    slug: 'university-of-ghana',
    content:
      '<p>The University of Ghana is the oldest and largest university in Ghana, with strong research programs in economics and international trade.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-ug.jpg',
      altText: 'University of Ghana logo',
      mediaItemId: 604,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'university',
      website: 'https://ug.edu.gh',
      country: 'Ghana',
      partnershipSince: '2015',
      description:
        'Research collaboration partner with co-investigator Dr. James Mensah.',
      isFeatured: false,
    },
  },
  {
    id: 'partner-5',
    databaseId: 605,
    title: 'ECOWAS Commission',
    slug: 'ecowas-commission',
    content:
      '<p>The ECOWAS Commission is the executive body of the Economic Community of West African States, responsible for implementing integration programs.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-ecowas.jpg',
      altText: 'ECOWAS Commission logo',
      mediaItemId: 605,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'government',
      website: 'https://ecowas.int',
      country: 'Nigeria',
      partnershipSince: '2012',
      description:
        'Policy advisory and research partnership on trade integration and NTB elimination.',
      isFeatured: true,
    },
  },
  {
    id: 'partner-6',
    databaseId: 606,
    title: 'African Economic Research Consortium',
    slug: 'aerc',
    content:
      '<p>AERC is a premier capacity-building institution in Africa, focused on advancing research and training in economic policy.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-aerc.jpg',
      altText: 'AERC logo',
      mediaItemId: 606,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'research-institute',
      website: 'https://aercafrica.org',
      country: 'Kenya',
      partnershipSince: '2010',
      description:
        'Long-standing research collaboration and co-publication partner.',
      isFeatured: false,
    },
  },
  {
    id: 'partner-7',
    databaseId: 607,
    title: 'United Nations Economic Commission for Africa',
    slug: 'uneca',
    content:
      '<p>UNECA is one of the UN\'s five regional commissions, mandated to promote the economic and social development of African member states.</p>',
    featuredImage: {
      sourceUrl: '/images/partner-uneca.jpg',
      altText: 'UNECA logo',
      mediaItemId: 607,
      width: 400,
      height: 200,
    },
    acfPartnerFields: {
      partnerType: 'international-organization',
      website: 'https://www.uneca.org',
      country: 'Ethiopia',
      partnershipSince: '2016',
      description:
        'Policy advisory collaboration on AfCFTA and regional integration research.',
      isFeatured: false,
    },
  },
];

// =============================================================================
// Testimonials
// =============================================================================

export const mockTestimonials: WPTestimonial[] = [
  {
    id: 'test-1',
    databaseId: 701,
    title: 'Dr. James Mensah - University of Ghana',
    slug: 'testimonial-james-mensah',
    content:
      'Professor Akanji\'s research on AfCFTA implementation has been instrumental in shaping our understanding of the agreement\'s practical impacts. Her ability to bridge academic rigor with policy relevance is unmatched in the field of African trade research.',
    acfTestimonialFields: {
      personName: 'Dr. James Mensah',
      personTitle: 'Senior Lecturer, Department of Economics',
      personOrganization: 'University of Ghana',
      personImage: null,
      rating: 5,
      isFeatured: true,
    },
  },
  {
    id: 'test-2',
    databaseId: 702,
    title: 'Amara Diallo - ECOWAS Commission',
    slug: 'testimonial-amara-diallo',
    content:
      'The gender-responsive trade facilitation toolkit developed by Prof. Akanji and her team has transformed how we approach trade facilitation at ECOWAS border posts. It has become an essential resource for our capacity-building programs.',
    acfTestimonialFields: {
      personName: 'Amara Diallo',
      personTitle: 'Director, Trade Facilitation Division',
      personOrganization: 'ECOWAS Commission',
      personImage: null,
      rating: 5,
      isFeatured: true,
    },
  },
  {
    id: 'test-3',
    databaseId: 703,
    title: 'Prof. Ngozi Okafor - Nigerian Ministry of Trade',
    slug: 'testimonial-ngozi-okafor',
    content:
      'I have relied on Prof. Akanji\'s policy briefings throughout Nigeria\'s AfCFTA negotiation and implementation process. Her evidence-based recommendations have directly influenced our national trade policy positions and implementation strategies.',
    acfTestimonialFields: {
      personName: 'Prof. Ngozi Okafor',
      personTitle: 'Director-General, Trade Policy',
      personOrganization: 'Nigerian Ministry of Industry, Trade and Investment',
      personImage: null,
      rating: 5,
      isFeatured: false,
    },
  },
  {
    id: 'test-4',
    databaseId: 704,
    title: 'Dr. Fatou Diop - Cheikh Anta Diop University',
    slug: 'testimonial-fatou-diop',
    content:
      'Working with Prof. Akanji on the gender and trade project has been one of the most enriching experiences of my career. Her mentorship and collaborative approach bring out the best in her research partners.',
    acfTestimonialFields: {
      personName: 'Dr. Fatou Diop',
      personTitle: 'Associate Professor, Faculty of Economics',
      personOrganization: 'Cheikh Anta Diop University, Dakar',
      personImage: null,
      rating: 5,
      isFeatured: false,
    },
  },
];

// =============================================================================
// Site Settings
// =============================================================================

export const mockSiteSettings: WPSiteSettings = {
  siteTitle: 'Prof. Bola Akanji',
  siteDescription:
    'Academic research portal for Professor Bola Akanji — African trade policy, regional integration, and sustainable economic development.',
  siteUrl: 'https://bolaoakanji.net',
  siteLogo: {
    sourceUrl: '/images/logo.svg',
    altText: 'Prof. Bola Akanji - Research Portal',
    mediaItemId: 0,
    width: 200,
    height: 60,
  },
  favicon: null,
  acfOptions: {
    heroTitle: 'Prof. Bola Akanji',
    heroSubtitle: 'Leading Research in African Trade & Economic Development',
    heroDescription:
      'Professor of Economics with over 25 years of research experience in international trade policy, regional integration, and sustainable economic development across Africa. Dedicated to evidence-based policy that transforms livelihoods.',
    heroImage: {
      sourceUrl: '/images/hero-professor.jpg',
      altText: 'Professor Bola Akanji',
      mediaItemId: 1,
      width: 1200,
      height: 600,
    },
    heroCtaText: 'Explore Research',
    heroCtaUrl: '/publications',
    aboutSummary:
      'Professor Bola Akanji is a distinguished economist specializing in African trade policy, regional integration, and development economics. With a PhD from the University of Ibadan and over 25 years of research experience, she has published extensively on the AfCFTA, ECOWAS trade protocols, and the gender dimensions of trade. Her research combines academic rigor with policy impact, informing decisions at national, regional, and continental levels.',
    aboutImage: {
      sourceUrl: '/images/about-prof.jpg',
      altText: 'Professor Bola Akanji',
      mediaItemId: 2,
      width: 800,
      height: 600,
    },
    contactEmail: 'b.akanji@bolaoakanji.net',
    contactPhone: '+234 801 234 5678',
    contactAddress:
      'Department of Economics, University of Ibadan, Ibadan, Oyo State, Nigeria',
    officeHours: 'Monday - Friday, 9:00 AM - 5:00 PM WAT',
    footerText:
      '© 2025 Prof. Bola Akanji. All rights reserved. Research and academic content licensed under CC BY 4.0 unless otherwise noted.',
    googleAnalyticsId: '',
    mailchimpListUrl: '',
  },
};

// =============================================================================
// Social Links
// =============================================================================

export const mockSocialLinks: WPSocialLinks = {
  twitter: 'https://twitter.com/bola_akanji',
  linkedin: 'https://linkedin.com/in/bolaakanji',
  facebook: '',
  instagram: '',
  youtube: '',
  researchgate: 'https://researchgate.net/profile/Bola-Akanji',
  googlescholar: 'https://scholar.google.com/citations?user=bolaakanji',
  orcid: 'https://orcid.org/0000-0002-1234-5678',
  academiaEdu: 'https://independent.academia.edu/BolaAkanji',
  ssrn: 'https://ssrn.com/author=bolaakanji',
};

// =============================================================================
// Menus
// =============================================================================

const mainMenuItems: WPMenuItem[] = [
  {
    id: 'menu-item-1',
    label: 'Home',
    url: '/',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
  {
    id: 'menu-item-2',
    label: 'About',
    url: '/about',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
  {
    id: 'menu-item-3',
    label: 'Publications',
    url: '/publications',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: [
      {
        id: 'menu-item-3-1',
        label: 'Journal Articles',
        url: '/publications?type=journal-article',
        target: '',
        cssClasses: [],
        description: '',
        parentId: 'menu-item-3',
      },
      {
        id: 'menu-item-3-2',
        label: 'Working Papers',
        url: '/publications?type=working-paper',
        target: '',
        cssClasses: [],
        description: '',
        parentId: 'menu-item-3',
      },
      {
        id: 'menu-item-3-3',
        label: 'Policy Briefs',
        url: '/publications?type=policy-brief',
        target: '',
        cssClasses: [],
        description: '',
        parentId: 'menu-item-3',
      },
    ],
  },
  {
    id: 'menu-item-4',
    label: 'Projects',
    url: '/projects',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
  {
    id: 'menu-item-5',
    label: 'Events',
    url: '/events',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
  {
    id: 'menu-item-6',
    label: 'Resources',
    url: '/resources',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
  {
    id: 'menu-item-7',
    label: 'Contact',
    url: '/contact',
    target: '',
    cssClasses: [],
    description: '',
    parentId: '',
    childItems: undefined,
  },
];

export const mockMenus: WPMenu[] = [
  {
    id: 'menu-primary',
    name: 'Primary Navigation',
    slug: 'primary-navigation',
    locations: ['PRIMARY'],
    menuItems: mainMenuItems,
  },
];
