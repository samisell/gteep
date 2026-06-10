// =============================================================================
// YouTube Video Gallery API
// Returns channel videos + other videos as JSON
// =============================================================================

import { NextResponse } from 'next/server';
import { getAllYouTubeVideos } from '@/lib/youtube';

export async function GET() {
  try {
    const data = await getAllYouTubeVideos();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
