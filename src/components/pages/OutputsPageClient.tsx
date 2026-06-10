'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  FileText,
  BarChart3,
  Database,
  Video,
  Camera,
  BookOpen,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import type { GTEEPOutput, YouTubeVideo } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface OutputsPageClientProps {
  outputs: GTEEPOutput[];
}

// =============================================================================
// Helpers
// =============================================================================

function getOutputTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'concept-note': 'Concept Note',
    'policy-brief': 'Policy Brief',
    'data-stock': 'Data Stock',
    'video': 'Video Gallery',
    'photo': 'Photo Gallery',
    'knowledge-product': 'Knowledge Product',
  };
  return labels[type] || 'Output';
}

function getOutputTypeIcon(type: string) {
  const iconMap: Record<string, React.ElementType> = {
    'concept-note': FileText,
    'policy-brief': FileText,
    'data-stock': Database,
    'video': Video,
    'photo': Camera,
    'knowledge-product': BookOpen,
  };
  return iconMap[type] || FileText;
}

function getOutputTypeBadgeColor(type: string) {
  switch (type) {
    case 'concept-note': return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    case 'policy-brief': return 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20';
    case 'data-stock': return 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]/20';
    case 'video': return 'bg-[#faf5ff] text-[#7c3aed] border-[#7c3aed]/20';
    case 'photo': return 'bg-[#fff1f2] text-[#e11d48] border-[#e11d48]/20';
    case 'knowledge-product': return 'bg-[#f0fdfa] text-[#0d9488] border-[#0d9488]/20';
    default: return 'bg-[#f1f5f9] text-[#64748b] border-[#64748b]/20';
  }
}

function getOutputTypeBgGradient(type: string) {
  switch (type) {
    case 'concept-note': return 'from-[#065f46] to-[#047857]';
    case 'policy-brief': return 'from-[#d97706] to-[#b45309]';
    case 'data-stock': return 'from-[#1d4ed8] to-[#1e40af]';
    case 'video': return 'from-[#7c3aed] to-[#6d28d9]';
    case 'photo': return 'from-[#e11d48] to-[#be123c]';
    case 'knowledge-product': return 'from-[#0d9488] to-[#0f766e]';
    default: return 'from-[#065f46] to-[#0f172a]';
  }
}

const tabDefs = [
  { value: 'all', label: 'All' },
  { value: 'concept-note', label: 'Concept Notes' },
  { value: 'policy-brief', label: 'Policy Briefs' },
  { value: 'data-stock', label: 'Data Stock' },
  { value: 'video', label: 'Video Gallery' },
  { value: 'photo', label: 'Photo Gallery' },
  { value: 'knowledge-product', label: 'Knowledge Products' },
];

// =============================================================================
// Output Card Component
// =============================================================================

function OutputCard({ output }: { output: GTEEPOutput }) {
  return (
    <Card className="group h-full overflow-hidden border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image / Gradient area */}
      <div className={`h-40 bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} relative flex items-center justify-center`}>
        <div className="text-center text-white/80">
          {React.createElement(getOutputTypeIcon(output.type), { className: 'w-12 h-12 mx-auto mb-2 opacity-50' })}
          <p className="text-sm font-medium">{getOutputTypeLabel(output.type)}</p>
        </div>
        {/* Type badge overlay */}
        <Badge className={`absolute top-4 left-4 ${getOutputTypeBadgeColor(output.type)} text-xs`}>
          {getOutputTypeLabel(output.type)}
        </Badge>
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3
          className="text-base font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {output.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-3 flex-grow">
          {output.excerpt}
        </p>

        {/* Date & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
          <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
            <Calendar className="w-3 h-3" />
            {output.date && (
              <span>
                {new Date(output.date + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
          {output.downloadUrl ? (
            <Button
              variant="link"
              className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Read More
            </Button>
          ) : output.externalUrl ? (
            <Button
              variant="link"
              className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Read More
            </Button>
          ) : (
            <Button
              variant="link"
              className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
            >
              Read More
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>

        {/* Tags */}
        {output.tags && output.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {output.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] bg-[#f1f5f9] text-[#64748b] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// YouTube Video Card Component
// =============================================================================

function YouTubeVideoCard({
  video,
  onPlay,
}: {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}) {
  return (
    <Card
      className="group h-full overflow-hidden border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video overflow-hidden bg-[#0f172a]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Other video badge */}
        {video.isOtherVideo && (
          <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] border-0">
            Other Video
          </Badge>
        )}
        {/* View count badge */}
        {video.viewCount !== undefined && video.viewCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
            {video.viewCount.toLocaleString()} views
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3
          className="text-sm font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {video.title}
        </h3>

        {/* Channel name & date */}
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          {video.channelTitle && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {video.channelTitle}
            </span>
          )}
          {video.publishedAt && (
            <>
              <span>·</span>
              <span>{new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </>
          )}
        </div>

        {/* Description preview */}
        {video.description && (
          <p className="text-xs text-[#94a3b8] mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Video Gallery Section
// =============================================================================

function VideoGallerySection() {
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [otherVideos, setOtherVideos] = useState<YouTubeVideo[]>([]);
  const [channelTitle, setChannelTitle] = useState<string | null>(null);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setChannelVideos(data.channelVideos || []);
      setOtherVideos(data.otherVideos || []);
      setChannelTitle(data.channelTitle || null);
      setChannelUrl(data.channelUrl || null);
    } catch (err) {
      console.error('Failed to fetch YouTube videos:', err);
      setError('Unable to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const hasChannelVideos = channelVideos.length > 0;
  const hasOtherVideos = otherVideos.length > 0;
  const hasAnyVideos = hasChannelVideos || hasOtherVideos;

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-12 h-12 mx-auto text-[#059669] mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Loading videos...</h3>
        <p className="text-sm text-[#64748b]">
          Fetching videos from YouTube channel
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <Video className="w-16 h-16 mx-auto text-[#cbd5e1] mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Could not load videos</h3>
        <p className="text-sm text-[#64748b] mb-4">{error}</p>
        <Button
          onClick={fetchVideos}
          variant="outline"
          className="text-[#059669] border-[#059669] hover:bg-[#059669] hover:text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Channel Videos */}
      {hasChannelVideos && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-xl font-bold text-[#0f172a] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <Video className="w-5 h-5 text-red-500" />
                {channelTitle ? `${channelTitle} Channel` : 'Channel Videos'}
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                Latest videos from our YouTube channel · {channelVideos.length} video{channelVideos.length !== 1 ? 's' : ''}
              </p>
            </div>
            {channelUrl && (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-sm text-[#059669] hover:text-[#047857] font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Channel
              </a>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelVideos.map((video) => (
              <YouTubeVideoCard
                key={video.videoId}
                video={video}
                onPlay={setSelectedVideo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Videos */}
      <div className="mb-8">
        <div className="mb-6">
          <h3
            className="text-xl font-bold text-[#0f172a] flex items-center gap-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <FileText className="w-5 h-5 text-amber-500" />
            Other Videos
          </h3>
          <p className="text-sm text-[#64748b] mt-1">
            Featured videos from other channels and sources
            {hasOtherVideos && ` · ${otherVideos.length} video${otherVideos.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {hasOtherVideos ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVideos.map((video) => (
              <YouTubeVideoCard
                key={video.videoId}
                video={video}
                onPlay={setSelectedVideo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0]">
            <FileText className="w-10 h-10 mx-auto text-[#cbd5e1] mb-3" />
            <p className="text-sm text-[#94a3b8]">
              No additional videos added yet.
            </p>
            <p className="text-xs text-[#cbd5e1] mt-1">
              Add YouTube video URLs to the <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#64748b] font-mono">OTHER_YOUTUBE_VIDEO_URLS</code> environment variable to display them here.
            </p>
          </div>
        )}
      </div>

      {/* No videos */}
      {!hasAnyVideos && (
        <div className="text-center py-16">
          <Video className="w-16 h-16 mx-auto text-[#cbd5e1] mb-4" />
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No videos available</h3>
          <p className="text-sm text-[#64748b]">
            Videos will appear here once they are added to the YouTube channel.
          </p>
        </div>
      )}

      {/* Video Player Dialog */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-[95vw] max-w-4xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`${selectedVideo.embedUrl}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {/* Video info */}
            <div className="p-4 bg-[#0f172a]">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {selectedVideo.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/60">
                {selectedVideo.channelTitle && (
                  <span>{selectedVideo.channelTitle}</span>
                )}
                {selectedVideo.publishedAt && (
                  <span>{new Date(selectedVideo.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                )}
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function OutputsPageClient({
  outputs,
}: OutputsPageClientProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOutputs = useMemo(() => {
    if (activeTab === 'all') return outputs;
    if (activeTab === 'video') return [];
    return outputs.filter((o) => o.type === activeTab);
  }, [outputs, activeTab]);

  // Compute tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: outputs.length,
    };

    for (const output of outputs) {
      counts[output.type] = (counts[output.type] || 0) + 1;
    }

    return counts;
  }, [outputs]);

  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="Our Outputs"
        subtitle="Research & Knowledge Products"
        description="Browse our comprehensive collection of research outputs, policy briefs, data resources, videos, and knowledge products."
        breadcrumb={[{ label: 'Our Outputs' }]}
      />

      {/* ================================================================== */}
      {/* TAB-BASED OUTPUT LISTING */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="Outputs Listing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="mb-10 overflow-x-auto">
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-[#f1f5f9] p-1.5 rounded-xl">
                {tabDefs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {tab.label}
                    {tab.value === 'video' ? (
                      <svg className="ml-1.5 w-3.5 h-3.5 text-red-500 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : (
                      <span className="ml-1.5 text-[10px] opacity-60">
                        ({tabCounts[tab.value] ?? 0})
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Non-video tab content */}
            {tabDefs
              .filter((tab) => tab.value !== 'video')
              .map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {filteredOutputs.length === 0 ? (
                    <div className="text-center py-16">
                      <BarChart3 className="w-16 h-16 mx-auto text-[#cbd5e1] mb-4" />
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No outputs found</h3>
                      <p className="text-sm text-[#64748b]">
                        There are no outputs in this category yet. Check back soon.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOutputs.map((output) => (
                        <OutputCard key={output.id} output={output} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}

            {/* Video Gallery tab content - fetches YouTube data client-side */}
            <TabsContent value="video">
              <VideoGallerySection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
