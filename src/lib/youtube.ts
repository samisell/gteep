// =============================================================================
// YouTube Video Fetcher Utility
// Fetches channel videos via RSS feed + individual video details via oEmbed
// Used by both the API route and server components
// =============================================================================

import type { YouTubeVideo } from '@/types';

// In-memory cache with TTL
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ---------------------------------------------------------------------------
// Extract video ID from various YouTube URL formats
// ---------------------------------------------------------------------------

export function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v');
    }

    // https://youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    // https://www.youtube.com/embed/VIDEO_ID
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split(/[?/]/)[0] || null;
    }

    // https://www.youtube.com/v/VIDEO_ID
    if (parsed.pathname.startsWith('/v/')) {
      return parsed.pathname.split('/v/')[1]?.split(/[?/]/)[0] || null;
    }

    // https://www.youtube.com/shorts/VIDEO_ID
    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split(/[?/]/)[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Fetch YouTube RSS feed and parse videos
// ---------------------------------------------------------------------------

export async function fetchChannelVideos(channelId: string): Promise<YouTubeVideo[]> {
  const cacheKey = `channel:${channelId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(rssUrl, {
      signal: controller.signal,
      next: { revalidate: 1800 }, // 30 min revalidation
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      console.error(`YouTube RSS feed error: ${response.status}`);
      return [];
    }

    const xml = await response.text();

    // Parse XML
    const videos: YouTubeVideo[] = [];

    // Extract channel name
    const channelNameMatch = xml.match(/<title>([^<]+)<\/title>/);
    const channelName = channelNameMatch ? channelNameMatch[1] : 'YouTube Channel';

    // Extract all <entry> blocks
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let entryMatch;

    while ((entryMatch = entryRegex.exec(xml)) !== null) {
      const entry = entryMatch[1];

      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const descriptionMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
      const thumbnailMatch = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/);
      const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);

      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        videos.push({
          videoId,
          title: titleMatch ? titleMatch[1] : 'Untitled Video',
          description: descriptionMatch ? descriptionMatch[1] : '',
          thumbnail: thumbnailMatch
            ? thumbnailMatch[1]
            : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: publishedMatch ? publishedMatch[1] : '',
          channelTitle: channelName,
          channelUrl: `https://www.youtube.com/channel/${channelId}`,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          viewCount: viewsMatch ? parseInt(viewsMatch[1], 10) : undefined,
          isOtherVideo: false,
        });
      }
    }

    setCache(cacheKey, videos);
    return videos;
  } catch (error) {
    console.error('Failed to fetch YouTube RSS feed:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Fetch individual video details via oEmbed
// ---------------------------------------------------------------------------

export async function fetchVideoByOembed(videoId: string): Promise<YouTubeVideo | null> {
  const cacheKey = `oembed:${videoId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(oembedUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 }, // 1 hour
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) return null;

    const data = await response.json();

    const video: YouTubeVideo = {
      videoId,
      title: data.title || 'Untitled Video',
      description: '',
      thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: '',
      channelTitle: data.author_name || '',
      channelUrl: data.author_url || '',
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      viewCount: undefined,
      isOtherVideo: true,
    };

    setCache(cacheKey, video);
    return video;
  } catch (error) {
    console.error(`Failed to fetch oEmbed for video ${videoId}:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Parse "Other Videos" from env string
// ---------------------------------------------------------------------------

export function parseOtherVideoUrls(envString: string): string[] {
  if (!envString.trim()) return [];
  return envString
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}

// ---------------------------------------------------------------------------
// Main fetcher: get all videos (channel + other)
// ---------------------------------------------------------------------------

export interface YouTubeVideosResponse {
  channelId: string | null;
  channelTitle: string | null;
  channelUrl: string | null;
  channelVideos: YouTubeVideo[];
  otherVideos: YouTubeVideo[];
}

export async function getAllYouTubeVideos(): Promise<YouTubeVideosResponse> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || '';
  const otherVideoUrls = parseOtherVideoUrls(process.env.OTHER_YOUTUBE_VIDEO_URLS || '');

  const [channelVideos, otherVideosResults] = await Promise.all([
    channelId ? fetchChannelVideos(channelId) : Promise.resolve([]),
    Promise.all(
      otherVideoUrls.map(async (url) => {
        const videoId = extractVideoId(url);
        if (!videoId) return null;
        return fetchVideoByOembed(videoId);
      })
    ),
  ]);

  // Filter out null results from other videos
  const otherVideos = otherVideosResults.filter(
    (v): v is NonNullable<typeof v> => v !== null
  );

  // De-duplicate: remove "other videos" that are already in channel videos
  const channelVideoIds = new Set(channelVideos.map((v) => v.videoId));
  const uniqueOtherVideos = otherVideos.filter(
    (v) => !channelVideoIds.has(v.videoId)
  );

  return {
    channelId: channelId || null,
    channelTitle: channelVideos.length > 0 ? channelVideos[0].channelTitle : null,
    channelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : null,
    channelVideos,
    otherVideos: uniqueOtherVideos,
  };
}
