import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyDownloadToken } from '@/lib/encryption';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify token cryptographic signature and expiration
    const leadId = verifyDownloadToken(token);
    if (!leadId) {
      return NextResponse.redirect(
        new URL('/resources?error=expired', request.url)
      );
    }

    // Find lead by token in database
    const lead = await db.downloadLead.findUnique({
      where: { downloadToken: token },
    });

    if (!lead) {
      return NextResponse.redirect(
        new URL('/resources?error=not_found', request.url)
      );
    }

    // Mark as downloaded
    await db.downloadLead.update({
      where: { id: lead.id },
      data: { downloaded: true, downloadedAt: new Date() },
    });

    // If there's a resource URL (e.g., WordPress media file), redirect to it
    if (lead.resourceUrl) {
      return NextResponse.redirect(lead.resourceUrl);
    }

    // If no resource URL, redirect back to the resource page
    return NextResponse.redirect(
      new URL(`/resources/${lead.resourceSlug}`, request.url)
    );
  } catch (error) {
    console.error('Download verification error:', error);
    return NextResponse.redirect(
      new URL('/resources?error=download_failed', request.url)
    );
  }
}
