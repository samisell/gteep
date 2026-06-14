import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateDownloadToken } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, fileUrl, fileName } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = request.headers.get('user-agent') || null;

    // Generate a unique download token
    const downloadToken = generateDownloadToken(
      `pending-${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '')}`
    );

    // Save the lead to the database
    const lead = await db.downloadLead.create({
      data: {
        name: name || 'Anonymous',
        email: email.toLowerCase().trim(),
        resourceName: fileName || 'Unknown Resource',
        resourceSlug: fileName
          ? fileName.replace(/\.[^/.]+$/, '').toLowerCase()
          : 'unknown',
        resourceUrl: fileUrl || null,
        downloadToken,
        ipAddress,
        userAgent,
      },
    });

    // Re-generate token with the actual lead ID for proper verification
    const realToken = generateDownloadToken(lead.id);
    await db.downloadLead.update({
      where: { id: lead.id },
      data: { downloadToken: realToken },
    });

    // Construct the download link (for email)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const downloadLink = `${protocol}://${host}/api/download/${realToken}`;

    // In a production environment, you would send an email here
    // using a service like Resend, SendGrid, etc.
    // For now, we log it and return success
    console.log(`[Download Request] Email: ${email}, File: ${fileName}`);
    console.log(`[Download Request] Download link: ${downloadLink}`);

    // Mark email as "sent" (in production, this would be after actual email delivery)
    await db.downloadLead.update({
      where: { id: lead.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message:
        'Your download has started. A confirmation has been sent to your email.',
      downloadLink, // In production, remove this from the response
    });
  } catch (error) {
    console.error('Download request error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
