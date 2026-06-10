import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { newsletterLimiter } from '@/lib/rate-limiter';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';

    if (!newsletterLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { email, name } = result.data;

    // Check if email already exists
    const existing = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        // Reactivate
        await db.newsletterSubscription.update({
          where: { id: existing.id },
          data: { active: true, name: name || existing.name },
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
      });
    }

    // Create new subscription
    await db.newsletterSubscription.create({
      data: {
        email,
        name: name || null,
        ipAddress: ip,
        source: 'website',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
