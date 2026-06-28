'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  FileSearch,
  Users,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Heart,
  ArrowRight,
  BookOpen,
  Mail,
  ChevronRight,
  Flame,
  Home,
  Presentation,
  FileText,
  Eye,
  Video,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPActivity, GTEEPActivityChild, GTEEPOutput, YouTubeVideo, FollowTheMoneyFiles } from '@/types';
import { ViewDocumentButton, DocumentViewer } from '@/components/features/DocumentViewer';

// =============================================================================
// Props
// =============================================================================

interface ActivityDetailClientProps {
  activity: GTEEPActivity;
  parentPage?: {
    id: string;
    title: string;
    slug: string;
    uri: string;
  };
  relatedOutputs?: GTEEPOutput[];
  videos?: YouTubeVideo[];
  followTheMoney?: FollowTheMoneyFiles;
}

// =============================================================================
// Icon Map - Direct mapping object
// =============================================================================

const activityIcons: Record<string, React.ElementType> = {
  FileSearch,
  Users,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Heart,
};

// =============================================================================
// ActivityIcon Component
// =============================================================================

function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = activityIcons[name] || FileSearch;
  return <Icon className={className} />;
}

// =============================================================================
// Helper Functions for Related Outputs
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

function getOutputTypeBadgeColor(type: string): string {
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

function getOutputTypeBgGradient(type: string): string {
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

// =============================================================================
// Color Map
// =============================================================================

const activityColors: Record<string, {
  iconBg: string;
  iconText: string;
  accent: string;
  gradient: string;
}> = {
  'policy-research': {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    accent: 'bg-[#065f46]',
    gradient: 'from-[#065f46] to-[#047857]',
  },
  'policy-engagement': {
    iconBg: 'bg-[#fef3c7]',
    iconText: 'text-[#d97706]',
    accent: 'bg-[#d97706]',
    gradient: 'from-[#d97706] to-[#b45309]',
  },
  'citizen-enlightenment': {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    accent: 'bg-[#059669]',
    gradient: 'from-[#059669] to-[#047857]',
  },
  'data-speaks': {
    iconBg: 'bg-[#fef3c7]',
    iconText: 'text-[#d97706]',
    accent: 'bg-[#d97706]',
    gradient: 'from-[#d97706] to-[#b45309]',
  },
  'youth-mentoring': {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    accent: 'bg-[#065f46]',
    gradient: 'from-[#065f46] to-[#047857]',
  },
  'womens-economic-livelihood': {
    iconBg: 'bg-[#fef3c7]',
    iconText: 'text-[#d97706]',
    accent: 'bg-[#d97706]',
    gradient: 'from-[#d97706] to-[#b45309]',
  },
};

// =============================================================================
// HTML Content Renderer
// =============================================================================

function WpContent({ html, className }: { html: string; className?: string }) {
  if (!html || html.trim() === '') return null;
  return (
    <div
      className={`prose prose-slate max-w-none text-[#475569] leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0f172a] [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0f172a] [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0f172a] [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_a]:text-[#059669] [&_a]:underline [&_a:hover]:text-[#047857] [&_strong]:text-[#0f172a] [&_blockquote]:border-l-4 [&_blockquote]:border-[#065f46] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#64748b] ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// =============================================================================
// Helper: Extract the first N <p> paragraphs from an HTML string.
// Falls back to splitting on double-newlines if no <p> tags are present.
// =============================================================================

function extractFirstParagraphs(html: string, count: number = 2): string {
  if (!html) return '';

  // Try to match <p>...</p> blocks first (HTML content from WordPress editor)
  const matches: string[] = [];
  const regex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  let match;
  while ((match = regex.exec(html)) !== null && matches.length < count) {
    matches.push(match[0]);
  }

  if (matches.length > 0) {
    return matches.join('');
  }

  // Fallback: plain text content (e.g. from ACF textarea fields like policyFirechat)
  // Split by double newlines (handles both \r\n\r\n Windows and \n\n Unix styles).
  // Include headings + first `count` paragraph-like blocks
  // (a "paragraph" is any block longer than 50 chars; short blocks are headings).
  const blocks = html
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const result: string[] = [];
  let paragraphCount = 0;

  for (const block of blocks) {
    result.push(block);
    if (block.length > 50) {
      paragraphCount++;
    }
    if (paragraphCount >= count) {
      break;
    }
  }

  // Wrap each block in <p> and convert single newlines to <br> for line breaks
  return result.map((p) => `<p>${p.replace(/\r?\n/g, '<br>')}</p>`).join('');
}

// =============================================================================
// FirechatIntro — Renders only the first 2 paragraphs of the Fireside Chat
// write-up, plus a "Read More" button that opens the Development Conversations
// related output in the DocumentViewer. The Development Conversations document
// is NOT removed from the Related Outputs section below — it stays where it is.
// =============================================================================

function FirechatIntro({
  html,
  relatedOutputs,
}: {
  html: string;
  relatedOutputs: GTEEPOutput[];
}) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const firstTwoParagraphs = extractFirstParagraphs(html, 2);

  // Find the "Development Conversations" related output by its stable ACF field
  // slug (whatIsFiresideChat). Looking up by slug — not by title text — keeps the
  // Read More button working even when the WP admin renames the underlying file
  // (the title is now derived from the filename, but the slug stays constant).
  const developmentConversationOutput = relatedOutputs.find(
    (o) => o.slug === 'whatIsFiresideChat'
  );

  if (!firstTwoParagraphs) return null;

  return (
    <div className="space-y-4">
      <WpContent html={firstTwoParagraphs} />

      {developmentConversationOutput?.downloadUrl && (
        <>
          <div>
            <Button
              onClick={() => setIsViewerOpen(true)}
              className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl"
            >
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <DocumentViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            documentUrl={developmentConversationOutput.downloadUrl}
            documentTitle={developmentConversationOutput.title}
            fileType={developmentConversationOutput.fileType || ''}
          />
        </>
      )}
    </div>
  );
}

// =============================================================================
// Video Gallery Component (for Fireside Chat page)
// =============================================================================

function VideoGallery({ videos }: { videos: YouTubeVideo[] }) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.videoId}
            className="group rounded-xl border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video overflow-hidden bg-[#0f172a]">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4
                className="text-sm font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#d97706] transition-colors"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {video.title}
              </h4>
              {video.channelTitle && (
                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  {video.channelTitle}
                </div>
              )}
            </div>
          </div>
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
              {selectedVideo.channelTitle && (
                <div className="text-xs text-white/60">{selectedVideo.channelTitle}</div>
              )}
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
// Related Outputs Component (reusable)
// =============================================================================

function RelatedOutputs({ outputs }: { outputs: GTEEPOutput[] }) {
  return (
    <div className="pt-8 border-t border-[#e2e8f0]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#059669]" />
        </div>
        <h3
          className="text-lg font-bold text-[#0f172a]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Related Outputs
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {outputs.map((output) => (
          <div
            key={output.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-[#e2e8f0] hover:border-[#065f46]/30 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} flex items-center justify-center shrink-0`}>
              {output.fileType === 'pptx' || output.fileType === 'ppt' ? (
                <Presentation className="w-6 h-6 text-white/90" />
              ) : (
                <FileText className="w-6 h-6 text-white/90" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[#0f172a] leading-snug group-hover:text-[#065f46] transition-colors line-clamp-1">
                {output.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getOutputTypeBadgeColor(output.type)} text-[10px] px-1.5 py-0`}>
                  {output.fileType?.toUpperCase()}
                </Badge>
                <span className="text-xs text-[#94a3b8]">{getOutputTypeLabel(output.type)}</span>
              </div>
            </div>
            {output.downloadUrl && (
              <ViewDocumentButton
                documentUrl={output.downloadUrl}
                documentTitle={output.title}
                fileType={output.fileType || ''}
                iconOnly
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link
          href="/outputs"
          className="text-sm text-[#059669] hover:text-[#047857] font-medium flex items-center gap-1 transition-colors"
        >
          View all outputs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// Event Accordion (rendered on the Fireside Chat page)
// Two event topics: Gender Backlash (past) and Follow the Money (upcoming)
// All file/document content comes from WordPress ACF.
// =============================================================================

const FOLLOW_THE_MONEY_REGISTRATION_URL = 'https://forms.gle/2KKU6bGEjewBQ7xDA';

function getFileTypeLabel(ext: string): string {
  switch (ext) {
    case 'pptx': case 'ppt': return 'PowerPoint';
    case 'docx': case 'doc': return 'Word Document';
    case 'pdf': return 'PDF Document';
    case 'xlsx': case 'xls': return 'Excel Spreadsheet';
    default: return ext.toUpperCase() || 'Document';
  }
}

function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('.').pop()?.toLowerCase() || '';
  } catch {
    return '';
  }
}

/** Derive a human-readable title from a WordPress file URL filename. */
function titleFromFilename(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || 'Document';
  } catch {
    return 'Document';
  }
}

function EventFileCard({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const ext = getFileExtension(url);

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-[#e2e8f0] hover:border-[#d97706]/30 hover:shadow-md transition-all duration-200 group bg-white">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center shrink-0">
        {ext === 'pptx' || ext === 'ppt' ? (
          <Presentation className="w-6 h-6 text-white/90" />
        ) : (
          <FileText className="w-6 h-6 text-white/90" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4
          className="text-sm font-semibold text-[#0f172a] leading-snug group-hover:text-[#d97706] transition-colors"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-[#fef3c7] text-[#d97706] border-[#d97706]/20 text-[10px] px-1.5 py-0">
            .{ext}
          </Badge>
          <span className="text-[10px] text-[#94a3b8]">{getFileTypeLabel(ext)}</span>
        </div>
      </div>
      <ViewDocumentButton
        documentUrl={url}
        documentTitle={title}
        fileType={ext}
        iconOnly
      />
    </div>
  );
}

function EventAccordion({
  videos,
  relatedOutputs,
  followTheMoney,
}: {
  videos: YouTubeVideo[];
  relatedOutputs: GTEEPOutput[];
  followTheMoney?: FollowTheMoneyFiles;
}) {
  // Gender Backlash related outputs — filter by title keywords (titles come from WP ACF field names)
  const genderBacklashOutputs = relatedOutputs.filter(
    (o) =>
      o.title.toLowerCase().includes('gender') ||
      o.title.toLowerCase().includes('backlash') ||
      o.title.toLowerCase().includes('oluponna')
  );

  const hasGenderBacklashContent = videos.length > 0 || genderBacklashOutputs.length > 0;

  // Follow the Money files from WordPress ACF
  const ftmFiles: { url: string; title: string }[] = [];
  if (followTheMoney?.briefForRegistration) {
    ftmFiles.push({
      url: followTheMoney.briefForRegistration,
      title: titleFromFilename(followTheMoney.briefForRegistration),
    });
  }
  if (followTheMoney?.fullConceptNote) {
    ftmFiles.push({
      url: followTheMoney.fullConceptNote,
      title: titleFromFilename(followTheMoney.fullConceptNote),
    });
  }

  const hasFollowTheMoneyContent = ftmFiles.length > 0;

  if (!hasGenderBacklashContent && !hasFollowTheMoneyContent) return null;

  return (
    <Accordion type="single" collapsible defaultValue={hasFollowTheMoneyContent ? 'follow-the-money' : 'gender-backlash'} className="w-full">
      {hasGenderBacklashContent && (
        <AccordionItem value="gender-backlash" className="border border-[#e2e8f0] rounded-xl mb-4 px-4 overflow-hidden">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#fef3c7] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-[#d97706]" />
              </div>
              <span
                className="text-lg font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Gender Backlash
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-4">
            <div className="space-y-6">
              {videos.length > 0 && <VideoGallery videos={videos} />}
              {genderBacklashOutputs.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {genderBacklashOutputs.map((output) => (
                    output.downloadUrl && (
                      <EventFileCard
                        key={output.id}
                        url={output.downloadUrl}
                        title={output.title}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {hasFollowTheMoneyContent && (
        <AccordionItem value="follow-the-money" className="border border-[#d97706]/30 rounded-xl px-4 overflow-hidden bg-[#fffbeb]/30">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-lg font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Follow the Money
              </span>
              <Badge className="bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse mr-1" />
                July 25, 2026
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-4">
            <div className="space-y-6">
              {/* Registration link */}
              <div className="rounded-xl bg-[#fef3c7]/60 border border-[#d97706]/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#0f172a]">
                  Registration Link: Follow the Money
                </p>
                <a
                  href={FOLLOW_THE_MONEY_REGISTRATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-semibold transition-colors shrink-0"
                >
                  Register Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Files from WordPress ACF */}
              <div className="grid sm:grid-cols-2 gap-4">
                {ftmFiles.map((file, i) => (
                  <EventFileCard
                    key={i}
                    url={file.url}
                    title={file.title}
                  />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function ActivityDetailClient({ activity, parentPage, relatedOutputs = [], videos = [], followTheMoney }: ActivityDetailClientProps) {
  const color = activityColors[activity.slug] || activityColors['policy-research'];
  const hasChildren = activity.children && activity.children.length > 0;

  // Pages that should NOT show the generic "What We Do" subtitle and the
  // "GTEEP's <title> programme — driving evidence-based policy change..." description
  // in their header. Per the user's directive, all non-WordPress content is removed
  // from these page headers — leave blank if no WP content.
  const hideHeaderSubtitle = [
    'policy-engagement',
    'policy-firechat',
    'policy-research',
    'citizen-enlightenment',
    'data-speaks',
    'youth-mentoring',
    'womens-economic-livelihood',
    'our-publication',
  ].includes(activity.slug);

  // Build breadcrumb (PageHeader already adds "Home" as the first item)
  const breadcrumb: { label: string; href?: string }[] = [
    { label: 'What We Do', href: '/what-we-do' },
  ];
  if (parentPage && parentPage.slug !== 'what-we-do') {
    breadcrumb.push({ label: parentPage.title, href: `/what-we-do/${parentPage.slug}` });
  }
  breadcrumb.push({ label: activity.title });

  return (
    <main className="pt-20 scroll-smooth">
      {/* Page Header */}
      <PageHeader
        title={activity.title}
        subtitle={hideHeaderSubtitle ? undefined : 'What We Do'}
        description={
          hideHeaderSubtitle
            ? undefined
            : `GTEEP's ${activity.title} programme — driving evidence-based policy change across Africa.`
        }
        breadcrumb={breadcrumb}
        backgroundImage="/images/policy-engagement.jpg"
      />

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-white" aria-label={activity.title}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <AnimatedSection>
                <div className="sticky top-24 space-y-6">
                  {/* Activity Icon Card */}
                  <div className="rounded-2xl border border-[#e2e8f0] p-6 bg-[#f8fafc]">
                    <div className={`w-16 h-16 rounded-xl ${color.iconBg} flex items-center justify-center mb-4`}>
                      <ActivityIcon name={activity.icon} className={`w-8 h-8 ${color.iconText}`} />
                    </div>
                    <h3
                      className="text-lg font-bold text-[#0f172a] mb-2"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {activity.title}
                    </h3>
                  </div>

                  {/* Sub-Programmes */}
                  {hasChildren && (
                    <div className="rounded-2xl border border-[#e2e8f0] p-6 bg-white">
                      <ul className="space-y-2">
                        {activity.children!.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/what-we-do/${activity.slug}/${child.slug}`}
                              className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#065f46] transition-colors group"
                            >
                              {child.slug === 'policy-firechat' ? (
                                <Flame className="w-4 h-4 text-[#d97706] shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[#94a3b8] shrink-0 group-hover:text-[#065f46] transition-colors" />
                              )}
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="rounded-2xl border border-[#e2e8f0] p-6 bg-white">
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/what-we-do"
                          className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#065f46] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#94a3b8] shrink-0" />
                          All Activities
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/outputs"
                          className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#065f46] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#94a3b8] shrink-0" />
                          Our Outputs
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#065f46] transition-colors"
                        >
                          <Mail className="w-4 h-4 text-[#94a3b8] shrink-0" />
                          Contact Us
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${color.gradient} text-white rounded-xl shadow-md`}
                  >
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Get In Touch
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <AnimatedSection>
                <div className="space-y-8">
                  {/* Featured Image */}
                  {activity.image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 to-transparent" />
                    </div>
                  )}

                  {/* Policy Engagement page: list the Policy Fireside Chat sub-programme */}
                  {activity.slug === 'policy-engagement' ? (
                    <div className="space-y-8">
                      {activity.content && <WpContent html={activity.content} />}

                      {/* List sub-programmes (Policy Fireside Chat) */}
                      {hasChildren && activity.children && activity.children.length > 0 && (
                        <div className="space-y-4">
                          {activity.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/what-we-do/${activity.slug}/${child.slug}`}
                              className="group block rounded-2xl border border-[#e2e8f0] hover:border-[#d97706]/40 bg-white overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                              <div className="bg-gradient-to-br from-[#d97706] to-[#b45309] p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/4 translate-x-1/4" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
                                <div className="relative z-10 flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Flame className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <h4
                                      className="text-xl font-bold text-white"
                                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                                    >
                                      {child.title}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="flex items-center text-sm font-medium text-[#d97706] group-hover:text-[#b45309]">
                                  View {child.title}
                                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {relatedOutputs.length > 0 && (
                        <RelatedOutputs outputs={relatedOutputs} />
                      )}
                    </div>
                  ) : activity.slug === 'policy-firechat' ? (
                    /* Policy Fireside Chat page: First 2 paragraphs of WP content + Read More button + Event Accordion */
                    <div className="space-y-8">
                      {/* WordPress content — first 2 paragraphs only, with Read More button */}
                      {(activity.content || activity.policyFirechat) && (
                        <FirechatIntro
                          html={activity.content || activity.policyFirechat || ''}
                          relatedOutputs={relatedOutputs}
                        />
                      )}

                      {/* Event Accordion — Gender Backlash + Follow the Money */}
                      <EventAccordion
                        videos={videos}
                        relatedOutputs={relatedOutputs}
                        followTheMoney={followTheMoney}
                      />

                      {/* Remaining related outputs (not event-specific) */}
                      {relatedOutputs.filter(
                        (o) =>
                          !o.title.toLowerCase().includes('gender') &&
                          !o.title.toLowerCase().includes('backlash') &&
                          !o.title.toLowerCase().includes('oluponna')
                      ).length > 0 && (
                        <RelatedOutputs
                          outputs={relatedOutputs.filter(
                            (o) =>
                              !o.title.toLowerCase().includes('gender') &&
                              !o.title.toLowerCase().includes('backlash') &&
                              !o.title.toLowerCase().includes('oluponna')
                          )}
                        />
                      )}
                    </div>
                  ) : (
                    /* Default: all other activity pages */
                    <div className="space-y-8">
                      {activity.content && <WpContent html={activity.content} />}
                      {relatedOutputs.length > 0 && (
                        <RelatedOutputs outputs={relatedOutputs} />
                      )}
                    </div>
                  )}

                </div>
              </AnimatedSection>

              {/* Children Sub-Pages */}
              {hasChildren && activity.slug !== 'policy-engagement' && (
                <AnimatedSection>
                  <div className="mt-12 pt-10 border-t border-[#e2e8f0]">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {activity.children!.map((child) => (
                        <Link
                          key={child.id}
                          href={`/what-we-do/${activity.slug}/${child.slug}`}
                          className="group rounded-xl border border-[#e2e8f0] hover:border-[#065f46]/30 bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          {child.image && (
                            <div className="relative aspect-video bg-[#0f172a]">
                              <Image
                                src={child.image}
                                alt={child.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                          )}
                          <div className="p-5">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg ${color.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                {child.slug === 'policy-firechat' ? (
                                  <Flame className={`w-5 h-5 ${color.iconText}`} />
                                ) : (
                                  <ActivityIcon name={activity.icon} className={`w-5 h-5 ${color.iconText}`} />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-base font-semibold text-[#0f172a] leading-tight mb-2 group-hover:text-[#065f46] transition-colors">
                                  {child.title}
                                </h4>
                                {child.content && (
                                  <p className="text-sm text-[#64748b] leading-relaxed line-clamp-3">
                                    {child.content.replace(/<[^>]*>/g, '').trim().substring(0, 200)}...
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm font-medium text-[#059669] group-hover:text-[#047857]">
                              View details
                              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#0f172a] relative overflow-hidden" aria-label="Call to Action">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#059669]/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center">
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Interested in Our Work?
              </h2>
              <p className="mt-3 text-[#94a3b8] max-w-2xl mx-auto">
                Get in touch to learn more about our {activity.title.toLowerCase()} programme and how you can collaborate with us.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl"
                >
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                >
                  <Link href="/what-we-do">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    All Activities
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
