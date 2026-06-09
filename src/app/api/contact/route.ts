import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { contactFormLimiter } from '@/lib/rate-limiter';
import { sanitizeInput } from '@/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';
    if (!contactFormLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check - bots fill this field
    if (body.honeypot && body.honeypot.length > 0) {
      // Silently accept but don't save
      return NextResponse.json({
        success: true,
        message: 'Your message has been received. We will get back to you shortly.',
      });
    }

    // Validate with Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Save to database
    const submission = await db.contactSubmission.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        phone: phone ? sanitizeInput(phone) : null,
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Fire-and-forget: Send notification emails
    // In production, these would use the email service
    try {
      const { sendContactNotification, sendContactConfirmation } = await import('@/lib/email');
      await Promise.allSettled([
        sendContactNotification({
          name: submission.name,
          email: submission.email,
          phone: submission.phone || undefined,
          subject: submission.subject,
          message: submission.message,
        }),
        sendContactConfirmation({
          name: submission.name,
          email: submission.email,
        }),
      ]);

      // Mark notifications as sent
      await db.contactSubmission.update({
        where: { id: submission.id },
        data: { adminNotified: true, senderNotified: true },
      });
    } catch (emailError) {
      console.error('Email notification error (non-blocking):', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
