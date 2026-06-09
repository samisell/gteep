import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [
      publicationsData,
      projectsData,
      eventsData,
      partners,
      postsData,
      downloadLeads,
      contactSubmissions,
      newsletterSubs,
    ] = await Promise.all([
      import('@/graphql/fetchers').then((f) => f.getPublications(100)),
      import('@/graphql/fetchers').then((f) => f.getProjects(100)),
      import('@/graphql/fetchers').then((f) => f.getEvents(100)),
      import('@/graphql/fetchers').then((f) => f.getPartners()),
      import('@/graphql/fetchers').then((f) => f.getPosts(100)),
      db.downloadLead.count(),
      db.contactSubmission.count(),
      db.newsletterSubscription.count({ where: { active: true } }),
    ]);

    const recentDownloads = await db.downloadLead.count({
      where: { downloaded: true, downloadedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });

    const recentContacts = await db.contactSubmission.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });

    return NextResponse.json({
      success: true,
      data: {
        publications: publicationsData.publications.length,
        projects: projectsData.projects.length,
        events: eventsData.events.length,
        partners: partners.length,
        posts: postsData.posts.length,
        downloadLeads,
        contactSubmissions,
        newsletterSubscribers: newsletterSubs,
        recentDownloads,
        recentContacts,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
