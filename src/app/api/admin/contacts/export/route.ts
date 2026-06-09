import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'IP Address', 'Date'];
    const rows = submissions.map((sub) => [
      `"${sub.name.replace(/"/g, '""')}"`,
      `"${sub.email}"`,
      `"${sub.phone || ''}"`,
      `"${sub.subject.replace(/"/g, '""')}"`,
      `"${sub.message.replace(/"/g, '""').substring(0, 200)}"`,
      `"${sub.ipAddress || ''}"`,
      sub.createdAt.toISOString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contact-submissions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export contacts' },
      { status: 500 }
    );
  }
}
