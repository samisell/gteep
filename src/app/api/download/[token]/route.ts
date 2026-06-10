import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyDownloadToken } from '@/lib/encryption';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify token
    const isValid = verifyDownloadToken(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired download link' },
        { status: 400 }
      );
    }

    // Find lead by token
    const lead = await db.downloadLead.findUnique({
      where: { downloadToken: token },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Download link not found' },
        { status: 404 }
      );
    }

    // Mark as downloaded
    await db.downloadLead.update({
      where: { id: lead.id },
      data: { downloaded: true, downloadedAt: new Date() },
    });

    // If there's a resource URL, redirect to it
    if (lead.resourceUrl) {
      return NextResponse.redirect(new URL(lead.resourceUrl, request.url));
    }

    // Otherwise return success
    return NextResponse.json({
      success: true,
      message: 'Download verified',
      data: {
        resourceName: lead.resourceName,
        resourceSlug: lead.resourceSlug,
      },
    });
  } catch (error) {
    console.error('Download verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify download link' },
      { status: 500 }
    );
  }
}
