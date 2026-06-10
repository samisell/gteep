// =============================================================================
// Email Service - GTEEP
// Auto-detects SMTP or Resend for email delivery.
// All SMTP variables are configured in the .env file.
// =============================================================================

import type { ContactFormData, DownloadLeadData } from '@/types';

// ---------------------------------------------------------------------------
// Configuration from environment variables
// ---------------------------------------------------------------------------

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'noreply@gteep.com';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'GTEEP';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@gteep.com';

// The admin email that receives contact form notifications
const ADMIN_NOTIFICATION_EMAIL =
  process.env.CONTACT_RECEIVER_EMAIL || process.env.SITE_EMAIL || 'info@gteep.com';

// ---------------------------------------------------------------------------
// Provider detection
// ---------------------------------------------------------------------------

function getEmailProvider(): 'smtp' | 'resend' | 'none' {
  if (RESEND_API_KEY) return 'resend';
  if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) return 'smtp';
  return 'none';
}

// ---------------------------------------------------------------------------
// Send via Resend API
// ---------------------------------------------------------------------------

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${SMTP_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email] Resend error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Email] Resend fetch error:', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Send via SMTP (nodemailer)
// ---------------------------------------------------------------------------

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    const result = await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });

    return !!result.messageId;
  } catch (error) {
    console.error('[Email] SMTP error:', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Core send function — auto-detects provider
// ---------------------------------------------------------------------------

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  const provider = getEmailProvider();

  if (provider === 'none') {
    console.warn(
      '[Email] No email provider configured (SMTP or Resend).',
      '\n  Would have sent to:',
      to,
      '\n  Subject:',
      subject
    );
    console.info('[Email] Content preview:', text.substring(0, 200));
    // In development / before SMTP is configured, return true so the flow doesn't break
    return true;
  }

  if (provider === 'resend') {
    return sendViaResend(to, subject, html, text);
  }

  return sendViaSmtp(to, subject, html, text);
}

// ---------------------------------------------------------------------------
// Contact Form — Admin Notification
// ---------------------------------------------------------------------------

export async function sendContactNotification(data: ContactFormData): Promise<boolean> {
  const subject = `[GTEEP Contact] ${data.subject}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;color:#fff;font-size:18px;">New Contact Form Submission</h2>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;width:140px;color:#0f172a;">Name</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Email</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;"><a href="mailto:${data.email}" style="color:#059669;">${data.email}</a></td>
          </tr>
          ${data.organization ? `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Organization</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.organization}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Subject</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;vertical-align:top;color:#0f172a;">Message</td>
            <td style="padding:10px 12px;color:#334155;white-space:pre-wrap;line-height:1.6;">${data.message}</td>
          </tr>
        </table>
        <div style="margin-top:20px;padding:12px;background:#f0fdf4;border-radius:6px;border-left:4px solid #059669;">
          <p style="margin:0;font-size:13px;color:#065f46;">
            <strong>Reply to this person:</strong> <a href="mailto:${data.email}" style="color:#059669;">${data.email}</a>
          </p>
        </div>
      </div>
      <p style="margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
        This notification was sent from the GTEEP website contact form.
      </p>
    </div>
  `;
  const text = `
New Contact Form Submission — GTEEP

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}` : ''}
Subject: ${data.subject}

Message:
${data.message}

---
Reply to: ${data.email}
This notification was sent from the GTEEP website contact form.
  `;

  return sendEmail(ADMIN_NOTIFICATION_EMAIL, subject, html, text);
}

// ---------------------------------------------------------------------------
// Contact Form — Sender Confirmation
// ---------------------------------------------------------------------------

export async function sendContactConfirmation(data: ContactFormData): Promise<boolean> {
  const subject = 'Thank you for contacting GTEEP';
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;color:#fff;font-size:18px;">Thank You for Reaching Out</h2>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <p style="color:#0f172a;font-size:16px;">Dear ${data.name},</p>
        <p style="color:#334155;line-height:1.6;">
          Thank you for your message. We have received your inquiry and our team will get back to you as soon as possible, typically within 2&ndash;3 business days.
        </p>
        <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #d97706;">
          <p style="margin:0 0 8px 0;font-size:14px;color:#0f172a;"><strong>Your Subject:</strong> ${data.subject}</p>
          <p style="margin:0;font-size:14px;color:#64748b;">We will respond to your email at <strong>${data.email}</strong></p>
        </div>
        <p style="color:#334155;line-height:1.6;">
          If your inquiry is urgent, please don't hesitate to call us during business hours (Monday&ndash;Friday, 9 AM &ndash; 5 PM WAT).
        </p>
        <p style="color:#334155;">
          Best regards,<br>
          <strong style="color:#065f46;">The GTEEP Team</strong><br>
          <span style="color:#64748b;font-size:13px;">Gilead Trust Economic Empowerment Project</span>
        </p>
      </div>
      <p style="margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
        This is an automated confirmation. Please do not reply to this email.<br>
        Contact us at info@gteep.com if you need further assistance.
      </p>
    </div>
  `;
  const text = `
Thank You for Contacting GTEEP

Dear ${data.name},

Thank you for your message. We have received your inquiry and our team will get back to you as soon as possible, typically within 2-3 business days.

Your Subject: ${data.subject}

If your inquiry is urgent, please call us during business hours (Monday-Friday, 9 AM - 5 PM WAT).

Best regards,
The GTEEP Team
Gilead Trust Economic Empowerment Project

---
This is an automated confirmation. Please do not reply to this email.
Contact us at info@gteep.com if you need further assistance.
  `;

  return sendEmail(data.email, subject, html, text);
}

// ---------------------------------------------------------------------------
// Download Lead — Send download link to the user
// ---------------------------------------------------------------------------

export async function sendDownloadLink(
  data: DownloadLeadData,
  downloadUrl: string
): Promise<boolean> {
  const subject = `Your Download: ${data.resourceTitle}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;color:#fff;font-size:18px;">Your Download is Ready</h2>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <p style="color:#0f172a;">Dear ${data.name},</p>
        <p style="color:#334155;line-height:1.6;">
          Thank you for your interest in <strong>${data.resourceTitle}</strong>. Your download link is ready:
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${downloadUrl}" style="background:#065f46;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;font-size:16px;">
            Download Now
          </a>
        </div>
        <p style="color:#64748b;font-size:14px;">
          This download link will expire in 24 hours. If you need additional time, please contact us.
        </p>
        ${data.organization ? `<p style="color:#64748b;font-size:14px;">Organization: ${data.organization}</p>` : ''}
      </div>
      <p style="margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
        If you did not request this download, please ignore this email.
      </p>
    </div>
  `;
  const text = `
Your Download is Ready — GTEEP

Dear ${data.name},

Thank you for your interest in "${data.resourceTitle}".

Download link: ${downloadUrl}

This link expires in 24 hours.

Best regards,
The GTEEP Team

---
If you did not request this download, please ignore this email.
  `;

  return sendEmail(data.email, subject, html, text);
}

// ---------------------------------------------------------------------------
// Download Lead — Admin notification
// ---------------------------------------------------------------------------

export async function sendDownloadNotification(
  data: DownloadLeadData
): Promise<boolean> {
  const subject = `[GTEEP] New Download Lead: ${data.resourceTitle}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#065f46;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;color:#fff;font-size:18px;">New Download Lead</h2>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;width:140px;color:#0f172a;">Name</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Email</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;"><a href="mailto:${data.email}" style="color:#059669;">${data.email}</a></td>
          </tr>
          ${data.organization ? `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Organization</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.organization}</td>
          </tr>` : ''}
          ${data.purpose ? `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#0f172a;">Purpose</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${data.purpose}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:10px 12px;font-weight:bold;color:#0f172a;">Resource</td>
            <td style="padding:10px 12px;color:#334155;">${data.resourceTitle}</td>
          </tr>
        </table>
      </div>
    </div>
  `;
  const text = `
New Download Lead — GTEEP

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}` : ''}
${data.purpose ? `Purpose: ${data.purpose}` : ''}
Resource: ${data.resourceTitle}
  `;

  return sendEmail(ADMIN_NOTIFICATION_EMAIL, subject, html, text);
}
