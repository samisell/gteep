import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { contactFormLimiter } from '@/lib/rate-limiter';
import { sanitizeInput } from '@/utils';

// ---------------------------------------------------------------------------
// Validation schema — matches the frontend ContactPageClient form exactly
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  organization: z.string().max(200).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  consent: z.boolean().refine((v) => v === true, 'Consent is required'),
});

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!contactFormLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Parse & validate body
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    const { name, email, organization, subject, message, consent } = result.data;

    // 3. Save to database
    const submission = await db.contactSubmission.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        organization: organization ? sanitizeInput(organization) : null,
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
        consent,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // 4. Send notification emails (fire-and-forget, never block the response)
    try {
      const { sendContactNotification, sendContactConfirmation } = await import('@/lib/email');
      await Promise.allSettled([
        sendContactNotification({
          name: submission.name,
          email: submission.email,
          organization: submission.organization || undefined,
          subject: submission.subject,
          message: submission.message,
        }),
        sendContactConfirmation({
          name: submission.name,
          email: submission.email,
          subject: submission.subject,
        }),
      ]);

      // Mark notifications as sent
      await db.contactSubmission.update({
        where: { id: submission.id },
        data: { adminNotified: true, senderNotified: true },
      });
    } catch (emailError) {
      console.error('[Contact] Email notification error (non-blocking):', emailError);
      // Don't fail the request if email fails — the submission is already saved
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('[Contact] Form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
