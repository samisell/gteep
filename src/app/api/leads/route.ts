import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { downloadLimiter } from '@/lib/rate-limiter';
import { sanitizeInput } from '@/utils';
import { generateDownloadToken } from '@/lib/encryption';

const downloadLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  organization: z.string().max(200).optional(),
  resourceName: z.string().min(1, 'Resource name is required'),
  resourceSlug: z.string().min(1, 'Resource slug is required'),
  resourceUrl: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';
    if (!downloadLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Thank you! Check your email for the download link.',
      });
    }

    // Validate
    const result = downloadLeadSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    const { name, email, organization, resourceName, resourceSlug, resourceUrl } = result.data;

    // Generate download token
    const token = generateDownloadToken(name + email + Date.now());

    // Save to database
    const lead = await db.downloadLead.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        organization: organization ? sanitizeInput(organization) : null,
        resourceName: sanitizeInput(resourceName),
        resourceSlug: sanitizeInput(resourceSlug),
        resourceUrl: resourceUrl || null,
        downloadToken: token,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Fire-and-forget: Send download link email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gteep.com';
    try {
      const { sendDownloadLink, sendDownloadNotification } = await import('@/lib/email');
      await Promise.allSettled([
        sendDownloadLink(
          { name: lead.name, email: lead.email },
          `${siteUrl}/api/download/${lead.downloadToken}`,
          lead.resourceName
        ),
        sendDownloadNotification({
          name: lead.name,
          email: lead.email,
          organization: lead.organization || undefined,
          resourceName: lead.resourceName,
        }),
      ]);

      await db.downloadLead.update({
        where: { id: lead.id },
        data: { emailSent: true, emailSentAt: new Date() },
      });
    } catch (emailError) {
      console.error('Download email error (non-blocking):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Check your email for the download link.',
      data: { token: lead.downloadToken },
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
