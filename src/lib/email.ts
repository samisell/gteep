// =============================================================================
// Email Service - Auto-detects SMTP or Resend for email delivery
// =============================================================================

import type { ContactFormData, DownloadLeadData } from '@/types';

// Configuration from environment
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@bolaoakanji.net';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'Prof. Bola Akanji <noreply@bolaoakanji.net>';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'b.akanji@bolaoakanji.net';

/**
 * Detect which email provider is configured
 */
function getEmailProvider(): 'smtp' | 'resend' | 'none' {
  if (RESEND_API_KEY) return 'resend';
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) return 'smtp';
  return 'none';
}

/**
 * Send email via Resend API
 */
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
        from: RESEND_FROM,
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

/**
 * Send email via SMTP (nodemailer)
 */
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
        pass: SMTP_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
      text,
    });

    return result.messageId ? true : false;
  } catch (error) {
    console.error('[Email] SMTP error:', error);
    return false;
  }
}

/**
 * Core send email function - auto-detects provider
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  const provider = getEmailProvider();

  if (provider === 'none') {
    console.warn(
      '[Email] No email provider configured. Email would have been sent to:',
      to,
      'Subject:',
      subject
    );
    // In development, log the email instead of failing
    console.info('[Email] Content:', text);
    return true; // Don't block the flow in development
  }

  if (provider === 'resend') {
    return sendViaResend(to, subject, html, text);
  }

  return sendViaSmtp(to, subject, html, text);
}

/**
 * Send contact form notification to the site owner
 */
export async function sendContactNotification(data: ContactFormData): Promise<boolean> {
  const subject = `New Contact Form Submission: ${data.subject}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 150px;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      ${data.phone ? `<tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td>
      </tr>` : ''}
      ${data.organization ? `<tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Organization</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.organization}</td>
      </tr>` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.subject}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Message</td>
        <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${data.message}</td>
      </tr>
    </table>
    <p style="margin-top: 16px; color: #666; font-size: 12px;">
      This email was sent from the contact form on bolaoakanji.net
    </p>
  `;
  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.organization ? `Organization: ${data.organization}` : ''}
Subject: ${data.subject}

Message:
${data.message}

---
This email was sent from the contact form on bolaoakanji.net
  `;

  return sendEmail(CONTACT_EMAIL, subject, html, text);
}

/**
 * Send confirmation email to the person who submitted the contact form
 */
export async function sendContactConfirmation(data: ContactFormData): Promise<boolean> {
  const subject = 'Thank you for your message - Prof. Bola Akanji';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
      <h2 style="color: #1a365d;">Thank you for reaching out</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for your message. I have received your inquiry and will respond as soon as possible, typically within 2-3 business days.</p>
      <p>For your records, here is a summary of your message:</p>
      <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong> ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}</p>
      </div>
      <p>If your inquiry is urgent, please don't hesitate to call the office at +234 801 234 5678 during business hours (Monday-Friday, 9 AM - 5 PM WAT).</p>
      <p>Best regards,<br>Prof. Bola Akanji</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="color: #718096; font-size: 12px;">
        This is an automated confirmation. Please do not reply to this email.
      </p>
    </div>
  `;
  const text = `
Thank you for reaching out

Dear ${data.name},

Thank you for your message. I have received your inquiry and will respond as soon as possible, typically within 2-3 business days.

Subject: ${data.subject}

If your inquiry is urgent, please call the office at +234 801 234 5678 during business hours.

Best regards,
Prof. Bola Akanji

---
This is an automated confirmation. Please do not reply to this email.
  `;

  return sendEmail(data.email, subject, html, text);
}

/**
 * Send a download link email to a lead
 */
export async function sendDownloadLink(
  data: DownloadLeadData,
  downloadUrl: string
): Promise<boolean> {
  const subject = `Your Download: ${data.resourceTitle}`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
      <h2 style="color: #1a365d;">Your Download is Ready</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for your interest in <strong>${data.resourceTitle}</strong>. Your download link is ready:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${downloadUrl}" style="background: #2d3748; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Download Now
        </a>
      </div>
      <p style="color: #718096; font-size: 14px;">
        This download link will expire in 24 hours. If you need additional time, please contact us.
      </p>
      ${data.organization ? `<p style="color: #718096; font-size: 14px;">Organization: ${data.organization}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="color: #718096; font-size: 12px;">
        If you did not request this download, please ignore this email.
      </p>
    </div>
  `;
  const text = `
Your Download is Ready

Dear ${data.name},

Thank you for your interest in "${data.resourceTitle}".

Download link: ${downloadUrl}

This link expires in 24 hours.

Best regards,
Prof. Bola Akanji

---
If you did not request this download, please ignore this email.
  `;

  return sendEmail(data.email, subject, html, text);
}

/**
 * Send notification to the site owner about a download lead
 */
export async function sendDownloadNotification(
  data: DownloadLeadData
): Promise<boolean> {
  const subject = `New Download Lead: ${data.resourceTitle}`;
  const html = `
    <h2>New Download Lead</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 150px;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      ${data.organization ? `<tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Organization</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.organization}</td>
      </tr>` : ''}
      ${data.purpose ? `<tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Purpose</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.purpose}</td>
      </tr>` : ''}
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Resource</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.resourceTitle}</td>
      </tr>
    </table>
  `;
  const text = `
New Download Lead

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}` : ''}
${data.purpose ? `Purpose: ${data.purpose}` : ''}
Resource: ${data.resourceTitle}
  `;

  return sendEmail(CONTACT_EMAIL, subject, html, text);
}
