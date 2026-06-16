'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Plus,
  Presentation,
  Flame,
  FileSpreadsheet,
  FileIcon,
} from 'lucide-react';
import type { GTEEPOutput, YouTubeVideo } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface OutputsPageClientProps {
  outputs: GTEEPOutput[];
  videos: YouTubeVideo[];
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

function getFileTypeIcon(ext: string): React.ElementType {
  switch (ext) {
    case 'pptx': case 'ppt': return Presentation;
    case 'docx': case 'doc': return FileText;
    case 'pdf': return FileText;
    case 'xlsx': case 'xls': return FileSpreadsheet;
    default: return FileIcon;
  }
}

function getFileTypeLabel(ext: string): string {
  switch (ext) {
    case 'pptx': case 'ppt': return 'PowerPoint';
    case 'docx': case 'doc': return 'Word Document';
    case 'pdf': return 'PDF Document';
    case 'xlsx': case 'xls': return 'Excel Spreadsheet';
    default: return ext.toUpperCase() || 'File';
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
// Downloadable File Card Component
// =============================================================================

function DownloadableCard({ output }: { output: GTEEPOutput }) {
  const ext = output.fileType || '';
  const isFirechatRelated = output.relatedSubActivity === 'policy-firechat';

  // Render file icon based on extension
  const renderFileIcon = (className: string) => {
    switch (ext) {
      case 'pptx': case 'ppt': return <Presentation className={className} />;
      case 'docx': case 'doc': return <FileText className={className} />;
      case 'pdf': return <FileText className={className} />;
      case 'xlsx': case 'xls': return <FileSpreadsheet className={className} />;
      default: return <FileIcon className={className} />;
    }
  };

  return (
    <Card className="group h-full overflow-hidden border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Gradient header with file icon */}
      <div className={`h-36 bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} relative flex items-center justify-center`}>
        <div className="text-center text-white/80">
          {renderFileIcon('w-12 h-12 mx-auto mb-2 opacity-70')}
          <p className="text-sm font-medium">{getFileTypeLabel(ext)}</p>
        </div>
        {/* Type badge overlay */}
        <Badge className={`absolute top-4 left-4 ${getOutputTypeBadgeColor(output.type)} text-xs`}>
          {getOutputTypeLabel(output.type)}
        </Badge>
        {/* File type badge */}
        {ext && (
          <Badge className="absolute top-4 right-4 bg-white/90 text-[#0f172a] text-[10px] font-mono border-0">
            .{ext}
          </Badge>
        )}
        {/* Firechat related indicator */}
        {isFirechatRelated && (
          <Badge className="absolute bottom-4 left-4 bg-[#d97706]/90 text-white text-[10px] border-0">
            <Flame className="w-3 h-3 mr-1" />
            Firechat
          </Badge>
        )}
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3
          className="text-base font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {output.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-2 flex-grow">
          {output.description}
        </p>

        {/* Related activity link */}
        {output.relatedActivity && (
          <div className="mb-3">
            <Link
              href={`/what-we-do/${output.relatedActivity}${output.relatedSubActivity ? `/${output.relatedSubActivity}` : ''}`}
              className="text-xs text-[#059669] hover:text-[#047857] flex items-center gap-1 transition-colors"
            >
              <Flame className="w-3 h-3" />
              Related: Policy Firechat
            </Link>
          </div>
        )}

        {/* Download button */}
        <div className="pt-4 border-t border-[#f1f5f9]">
          {output.downloadUrl ? (
            <a
              href={output.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download {ext.toUpperCase()}
            </a>
          ) : (
            <span className="text-sm text-[#94a3b8]">No download available</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Output Card Component (non-downloadable outputs)
// =============================================================================

function OutputCard({ output }: { output: GTEEPOutput }) {
  // If this output has a downloadUrl and fileType, render as DownloadableCard
  if (output.downloadUrl && output.fileType) {
    return <DownloadableCard output={output} />;
  }

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
            <a
              href={output.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          ) : output.externalUrl ? (
            <a
              href={output.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
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
// YouTube Video Card Component (ACF-based)
// =============================================================================

function ACFVideoCard({
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
        {/* Video badge */}
        <Badge className="absolute top-3 left-3 bg-[#065f46]/90 text-white text-[10px] border-0">
          <Video className="w-3 h-3 mr-1" />
          GTEEP Video
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3
          className="text-sm font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {video.title}
        </h3>

        {/* Channel name */}
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          {video.channelTitle && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {video.channelTitle}
            </span>
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
// Video Gallery Section (ACF-driven)
// =============================================================================

function VideoGallerySection({ videos }: { videos: YouTubeVideo[] }) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const hasVideos = videos.length > 0;

  if (!hasVideos) {
    return (
      <div className="text-center py-16">
        <Video className="w-16 h-16 mx-auto text-[#cbd5e1] mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No videos available yet</h3>
        <p className="text-sm text-[#64748b] max-w-md mx-auto">
          Videos will appear here once they are added through the WordPress ACF Video Gallery fields.
        </p>
        <div className="mt-6 p-4 bg-[#f0fdf4] rounded-lg border border-[#065f46]/10 max-w-lg mx-auto text-left">
          <h4 className="text-sm font-semibold text-[#065f46] mb-2 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            How to add videos:
          </h4>
          <ol className="text-xs text-[#64748b] space-y-1 list-decimal list-inside">
            <li>Go to WordPress Admin → Pages → Video Gallery</li>
            <li>Add a YouTube URL in the &quot;Firechat Event&quot; ACF field</li>
            <li>For multiple videos, add a Repeater field called &quot;Videos&quot; with sub-fields</li>
            <li>Update the page — videos will appear automatically</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-xl font-bold text-[#0f172a] flex items-center gap-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <Video className="w-5 h-5 text-[#065f46]" />
            Video Gallery
          </h3>
          <p className="text-sm text-[#64748b] mt-1">
            Videos managed through WordPress ACF &middot; {videos.length} video{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <ACFVideoCard
            key={video.videoId}
            video={video}
            onPlay={setSelectedVideo}
          />
        ))}
      </div>

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
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`${selectedVideo.embedUrl}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4 bg-[#0f172a]">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {selectedVideo.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/60">
                {selectedVideo.channelTitle && (
                  <span>{selectedVideo.channelTitle}</span>
                )}
              </div>
            </div>
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
  videos,
}: OutputsPageClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  // Use URL param as initial value; tab changes via user interaction
  const [activeTab, setActiveTab] = useState(tabParam && tabDefs.some(t => t.value === tabParam) ? tabParam : 'all');

  const filteredOutputs = useMemo(() => {
    if (activeTab === 'all') return outputs;
    if (activeTab === 'video') return [];
    return outputs.filter((o) => o.type === activeTab);
  }, [outputs, activeTab]);

  // Compute tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: outputs.length,
      video: videos.length,
    };

    for (const output of outputs) {
      counts[output.type] = (counts[output.type] || 0) + 1;
    }

    return counts;
  }, [outputs, videos]);

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

            {/* Video Gallery tab content - ACF-driven from WordPress */}
            <TabsContent value="video">
              <VideoGallerySection videos={videos} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
