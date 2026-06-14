'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Download,
  Presentation,
  PlayCircle,
  ExternalLink,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPActivity, GTEEPActivityResource } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface WhatWeDoPageClientProps {
  activities: GTEEPActivity[];
}

// =============================================================================
// Icon Map
// =============================================================================

function getActivityIcon(iconName: string) {
  const iconMap: Record<string, React.ElementType> = {
    FileSearch,
    Users,
    Lightbulb,
    BarChart3,
    GraduationCap,
    Heart,
  };
  return iconMap[iconName] || FileSearch;
}

// =============================================================================
// Resource icon mapping
// =============================================================================

function getResourceIcon(type: GTEEPActivityResource['type']) {
  const iconMap: Record<string, React.ElementType> = {
    presentation: Presentation,
    document: FileText,
    video: PlayCircle,
    link: ExternalLink,
  };
  return iconMap[type] || FileText;
}

// =============================================================================
// Color Cycle for Activity Sections
// =============================================================================

const activityColors = [
  {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    iconHoverBg: 'group-hover:bg-[#065f46]',
    iconHoverText: 'group-hover:text-white',
    accent: 'bg-[#065f46]',
  },
  {
    iconBg: 'bg-[#fef3c7]',
    iconText: 'text-[#d97706]',
    iconHoverBg: 'group-hover:bg-[#d97706]',
    iconHoverText: 'group-hover:text-white',
    accent: 'bg-[#d97706]',
  },
];

// =============================================================================
// YouTube helpers
// =============================================================================

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
  return getYouTubeId(url) !== null;
}

// =============================================================================
// Resource Card Component
// =============================================================================

function ResourceCard({ resource }: { resource: GTEEPActivityResource }) {
  const isVideo = resource.type === 'video';
  const isExternal = resource.url.startsWith('http');
  const ytId = isVideo ? getYouTubeId(resource.url) : null;

  const iconMap: Record<string, React.ElementType> = {
    presentation: Presentation,
    document: FileText,
    video: PlayCircle,
    link: ExternalLink,
  };
  const IconComponent = iconMap[resource.type] || FileText;

  return (
    <div className="group rounded-xl border border-[#e2e8f0] hover:border-[#059669]/30 bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Video thumbnail for YouTube */}
      {ytId && (
        <div className="relative aspect-video bg-[#0f172a]">
          <Image
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={resource.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-[#065f46]" />
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isVideo ? 'bg-red-50 text-red-600' : 'bg-[#f0fdf4] text-[#059669]'}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-[#0f172a] leading-tight mb-1">
              {resource.title}
            </h4>
            {resource.description && (
              <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                {resource.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3">
          {isVideo ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#065f46] hover:text-[#047857] transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Watch on YouTube
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <a
              href={resource.url}
              download
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#065f46] hover:text-[#047857] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
              {resource.type === 'presentation' && (
                <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 border-[#d97706]/30 text-[#d97706]">
                  PPTX
                </Badge>
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function WhatWeDoPageClient({ activities }: WhatWeDoPageClientProps) {
  // Smooth scroll to hash anchor on page load & highlight the section
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Small delay to ensure page is fully rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Add a brief highlight animation
          el.classList.add('ring-2', 'ring-[#059669]/40', 'ring-inset');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-[#059669]/40', 'ring-inset');
          }, 2000);
        }, 300);
      }
    }
  }, []);

  return (
    <main className="pt-20 scroll-smooth">
      {/* Page Header */}
      <PageHeader
        title="What We Do"
        subtitle="Our Activities"
        description="Driving evidence-based policy change through research, engagement, and empowerment across Africa."
        breadcrumb={[{ label: 'What We Do' }]}
        backgroundImage="/images/policy-engagement.jpg"
      />

      {/* ================================================================== */}
      {/* ACTIVITY SECTIONS */}
      {/* ================================================================== */}
      {activities.map((activity, index) => {
        const IconComponent = getActivityIcon(activity.icon);
        const isEven = index % 2 === 0;
        const color = activityColors[index % activityColors.length];

        return (
          <section
            key={activity.id}
            id={`activity-${activity.id}`}
            className={`py-16 md:py-24 transition-all duration-500 ${isEven ? 'bg-white' : 'bg-[#f8fafc]'}`}
            aria-label={activity.title}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection>
                <div className={`grid gap-12 lg:grid-cols-2 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Icon/Visual Side */}
                  <div className={`${!isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="relative">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl relative">
                        {activity.image ? (
                          <>
                            <Image
                              src={activity.image}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#065f46]/50 via-transparent to-[#0f172a]/50" />
                          </>
                        ) : (
                          <div className="h-full bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a]" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white/90 p-8">
                            <div className={`w-20 h-20 rounded-2xl ${color.iconBg} flex items-center justify-center mx-auto mb-4`}>
                              <IconComponent className={`w-10 h-10 ${color.iconText}`} />
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                            >
                              {activity.title}
                            </p>
                          </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#d97706]/15 blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-[#059669]/15 blur-xl" />
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`${!isEven ? 'lg:col-start-1' : ''}`}>
                    <div className="space-y-6">
                      <Badge className={`${color.iconBg} ${color.iconText} border-0 text-sm px-3 py-1`}>
                        Activity {index + 1}
                      </Badge>
                      <h2
                        className="text-3xl sm:text-4xl font-bold text-[#0f172a]"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {activity.title}
                      </h2>
                      <div className={`h-1 w-20 rounded-full ${color.accent}`} />
                      <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Related Resources / Outputs */}
              {activity.resources && activity.resources.length > 0 && (
                <AnimatedSection>
                  <div className="mt-12 pt-10 border-t border-[#e2e8f0]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#059669]" />
                      </div>
                      <div>
                        <h3
                          className="text-xl font-bold text-[#0f172a]"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          Related Outputs &amp; Resources
                        </h3>
                        <p className="text-sm text-[#64748b]">
                          Download presentations, documents, and watch event recordings from our {activity.title.toLowerCase()} work.
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {activity.resources.map((resource, rIdx) => (
                        <ResourceCard key={rIdx} resource={resource} />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </section>
        );
      })}

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20 bg-[#0f172a] relative overflow-hidden" aria-label="Call to Action">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#059669]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#d97706]/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center">
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Explore Our Work
              </h2>
              <p className="mt-3 text-[#94a3b8] max-w-2xl mx-auto">
                Discover our research outputs, from policy briefs and concept notes to data resources and knowledge products.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl"
                >
                  <Link href="/outputs">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Our Outputs
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                >
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
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
