import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const leads = await db.downloadLead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Name', 'Email', 'Organization', 'Resource', 'Slug', 'Downloaded', 'IP Address', 'Date'];
    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email}"`,
      `"${(lead.organization || '').replace(/"/g, '""')}"`,
      `"${lead.resourceName.replace(/"/g, '""')}"`,
      `"${lead.resourceSlug}"`,
      lead.downloaded ? 'Yes' : 'No',
      `"${lead.ipAddress || ''}"`,
      lead.createdAt.toISOString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="download-leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
