import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { newsletterLimiter } from '@/lib/rate-limiter';
import { getAdminEmail } from '@/graphql/fetchers';
import { sendEmail } from '@/lib/email';

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

        // Send admin notification about re-subscription (fire-and-forget)
        sendNewsletterAdminNotification(email, name, true).catch(() => {});
      }
      return NextResponse.json({
        success: true,
        message: 'Welcome back! You are already subscribed to our newsletter.',
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

    // Send emails (fire-and-forget, never block the response)
    sendNewsletterAdminNotification(email, name, false).catch(() => {});
    sendNewsletterConfirmation(email, name).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! You'll receive our latest policy insights and updates.",
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Newsletter — Admin Notification Email
// ---------------------------------------------------------------------------

async function sendNewsletterAdminNotification(
  subscriberEmail: string,
  subscriberName?: string | null,
  isResubscription?: boolean
): Promise<void> {
  try {
    const adminEmail = await getAdminEmail();
    const subject = isResubscription
      ? `[GTEEP] Newsletter Re-subscription: ${subscriberEmail}`
      : `[GTEEP] New Newsletter Subscriber: ${subscriberEmail}`;

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
        <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;color:#fff;font-size:18px;">${isResubscription ? 'Newsletter Re-subscription' : 'New Newsletter Subscriber'}</h2>
        </div>
        <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <table style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;width:160px;color:#0f172a;">Email</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;"><a href="mailto:${subscriberEmail}" style="color:#059669;">${subscriberEmail}</a></td>
            </tr>
            ${subscriberName ? `<tr>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Name</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${subscriberName}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 12px;font-weight:bold;color:#0f172a;">Source</td>
              <td style="padding:10px 12px;color:#334155;">Website Footer</td>
            </tr>
          </table>
        </div>
        <p style="margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
          This notification was sent from the GTEEP website newsletter form.
        </p>
      </div>
    `;
    const text = `
${isResubscription ? 'Newsletter Re-subscription' : 'New Newsletter Subscriber'} — GTEEP

Email: ${subscriberEmail}
${subscriberName ? `Name: ${subscriberName}` : ''}
Source: Website Footer

---
This notification was sent from the GTEEP website newsletter form.
    `;

    await sendEmail(adminEmail, subject, html, text);
  } catch (error) {
    console.error('[Newsletter] Admin notification error (non-blocking):', error);
  }
}

// ---------------------------------------------------------------------------
// Newsletter — Subscriber Confirmation Email
// ---------------------------------------------------------------------------

async function sendNewsletterConfirmation(
  subscriberEmail: string,
  subscriberName?: string | null
): Promise<void> {
  try {
    const greeting = subscriberName ? `Dear ${subscriberName}` : 'Hello';
    const subject = 'Welcome to the GTEEP Newsletter!';
    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
        <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;color:#fff;font-size:18px;">Welcome to GTEEP Newsletter!</h2>
        </div>
        <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <p style="color:#0f172a;font-size:16px;">${greeting},</p>
          <p style="color:#334155;line-height:1.6;">
            Thank you for subscribing to the GTEEP newsletter! You will now receive our latest policy insights, research updates, and event announcements.
          </p>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #059669;">
            <p style="margin:0;font-size:14px;color:#065f46;">
              <strong>What to expect:</strong>
            </p>
            <ul style="margin:8px 0 0 0;padding-left:20px;color:#334155;font-size:14px;">
              <li>Policy briefs and research highlights</li>
              <li>Event invitations and Fireside Chat updates</li>
              <li>Insights on African trade and economic development</li>
            </ul>
          </div>
          <p style="color:#334155;line-height:1.6;">
            If you did not subscribe, please ignore this email. You can unsubscribe at any time.
          </p>
          <p style="color:#334155;">
            Best regards,<br>
            <strong style="color:#065f46;">The GTEEP Team</strong><br>
            <span style="color:#64748b;font-size:13px;">Gilead Trust Economic Empowerment Project</span>
          </p>
        </div>
        <p style="margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
          This is an automated message from GTEEP. Please do not reply to this email.
        </p>
      </div>
    `;
    const text = `
Welcome to GTEEP Newsletter!

${greeting},

Thank you for subscribing to the GTEEP newsletter! You will now receive our latest policy insights, research updates, and event announcements.

What to expect:
- Policy briefs and research highlights
- Event invitations and Fireside Chat updates
- Insights on African trade and economic development

If you did not subscribe, please ignore this email. You can unsubscribe at any time.

Best regards,
The GTEEP Team
Gilead Trust Economic Empowerment Project

---
This is an automated message from GTEEP. Please do not reply to this email.
    `;

    await sendEmail(subscriberEmail, subject, html, text);
  } catch (error) {
    console.error('[Newsletter] Confirmation email error (non-blocking):', error);
  }
}
