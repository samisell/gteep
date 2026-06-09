import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOutputs, getPartners, getBlogPosts } from '@/graphql/fetchers';

export async function GET() {
  try {
    const [
      outputs,
      partners,
      blogPosts,
      downloadLeads,
      contactSubmissions,
      newsletterSubs,
    ] = await Promise.all([
      getOutputs(),
      getPartners(),
      getBlogPosts(),
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
        outputs: outputs.length,
        partners: partners.length,
        blogPosts: blogPosts.length,
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
