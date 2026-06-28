'use client';

import { useEffect, useMemo } from 'react';
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
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPActivity, GTEEPActivityChild } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface WhatWeDoPageClientProps {
  activities: GTEEPActivity[];
}

// =============================================================================
// Activity ordering — consistent across the site
// =============================================================================

const ACTIVITY_ORDER = [
  'policy-research',
  'policy-engagement',
  'citizen-enlightenment',
  'data-speaks',
  'youth-mentoring',
  'womens-economic-livelihood',
  'our-publication',
];

// =============================================================================
// Icon Map - Direct mapping object (avoids creating components during render)
// =============================================================================

const activityIcons: Record<string, React.ElementType> = {
  FileSearch,
  Users,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Heart,
  BookOpen,
};

// =============================================================================
// ActivityIcon Component - Renders the correct icon by name
// =============================================================================

function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = activityIcons[name] || FileSearch;
  return <Icon className={className} />;
}

// =============================================================================
// Color Cycle for Activity Sections
// =============================================================================

const activityColors = [
  {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    accent: 'bg-[#065f46]',
    gradient: 'from-[#065f46] to-[#047857]',
    lightBg: 'bg-[#f0fdf4]',
    border: 'border-[#065f46]/20',
  },
  {
    iconBg: 'bg-[#fef3c7]',
    iconText: 'text-[#d97706]',
    accent: 'bg-[#d97706]',
    gradient: 'from-[#d97706] to-[#b45309]',
    lightBg: 'bg-[#fef3c7]',
    border: 'border-[#d97706]/20',
  },
  {
    iconBg: 'bg-[#f0fdf4]',
    iconText: 'text-[#059669]',
    accent: 'bg-[#059669]',
    gradient: 'from-[#059669] to-[#047857]',
    lightBg: 'bg-[#f0fdf4]',
    border: 'border-[#059669]/20',
  },
];

// =============================================================================
// HTML Content Renderer - Safely renders WordPress HTML content
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
// Policy Firechat Sub-section
// =============================================================================

function PolicyFirechatSection({ firechatContent, childPage }: { firechatContent: string; childPage?: GTEEPActivityChild }) {
  if (!firechatContent && !childPage) return null;

  const content = firechatContent || childPage?.policyFirechat || childPage?.content || '';
  if (!content) return null;

  // Extract first paragraph as intro and the rest as details
  const paragraphs = content.split(/\r\n\r\n|\n\n/).filter(Boolean);
  const intro = paragraphs[0] || '';
  const rest = paragraphs.slice(1).join('\n\n');

  return (
    <AnimatedSection>
      <div className="mt-10 pt-8 border-t border-[#d97706]/30">
        <div className="bg-gradient-to-br from-[#fef3c7]/50 to-[#f0fdf4]/30 rounded-2xl p-6 md:p-8 border border-[#d97706]/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4
                className="text-xl font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {childPage?.title}
              </h4>
            </div>
          </div>

          {intro && (
            <div className="mb-4 p-4 bg-white/60 rounded-xl border border-[#d97706]/10">
              <p className="text-[#475569] leading-relaxed text-sm md:text-base">
                {intro.replace(/<[^>]*>/g, '').trim()}
              </p>
            </div>
          )}

          {rest && (
            <div className="mt-4">
              <WpContent html={rest} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white rounded-lg"
            >
              <Link href="/what-we-do/policy-engagement/policy-firechat">
                <Flame className="w-4 h-4 mr-1.5" />
                View Fireside Chats
              </Link>
            </Button>
            {childPage && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[#d97706]/40 text-[#d97706] hover:bg-[#d97706]/10 rounded-lg"
              >
                <Link href={`/what-we-do/policy-engagement/${childPage.slug}`}>
                  Learn More
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// =============================================================================
// Activity Section Component
// =============================================================================

function ActivitySection({
  activity,
  index,
}: {
  activity: GTEEPActivity;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const color = activityColors[index % activityColors.length];

  // Check if this activity has children (like Policy Engagement → Policy Firechat)
  const hasChildren = activity.children && activity.children.length > 0;
  const firechatChild = activity.children?.find(
    (c) => c.slug === 'policy-firechat' || c.policyFirechat
  );

  return (
    <section
      key={activity.id}
      id={`activity-${activity.slug}`}
      className={`py-16 md:py-24 transition-all duration-500 scroll-mt-20 ${isEven ? 'bg-white' : 'bg-[#f8fafc]'}`}
      aria-label={activity.title}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className={`grid gap-12 lg:grid-cols-2 items-start ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
            {/* Icon/Visual Side */}
            <div className={`${!isEven ? 'lg:col-start-2 lg:row-span-2' : ''}`}>
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
                      <div className="absolute inset-0 bg-gradient-to-br from-[#065f46]/50 via-transparent to-[#0f172a]/50" />
                    </>
                  ) : (
                    <div className={`h-full bg-gradient-to-br ${color.gradient} to-[#0f172a]`} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/90 p-8">
                      <div className={`w-20 h-20 rounded-2xl ${color.iconBg} flex items-center justify-center mx-auto mb-4`}>
                        <ActivityIcon name={activity.icon} className={`w-10 h-10 ${color.iconText}`} />
                      </div>
                      <p
                        className="text-xl font-bold"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {activity.title}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#d97706]/15 blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-[#059669]/15 blur-xl" />
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className={`${!isEven ? 'lg:col-start-1' : ''}`}>
              <div className="space-y-5">
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0f172a]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {activity.title}
                </h2>
                <div className={`h-1 w-20 rounded-full ${color.accent}`} />

                {/* Render content from WordPress */}
                {activity.content ? (
                  <WpContent html={activity.content} className="text-base md:text-lg" />
                ) : null}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    asChild
                    size="sm"
                    className={`bg-gradient-to-r ${color.gradient} text-white rounded-xl shadow-md`}
                  >
                    <Link href={`/what-we-do/${activity.slug}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Render children/sub-programmes */}
        {hasChildren && (
          <AnimatedSection>
            <div className="mt-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${color.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          {child.slug === 'policy-firechat' ? (
                            <Flame className={`w-5 h-5 ${color.iconText}`} />
                          ) : (
                            <ActivityIcon name={activity.icon} className={`w-5 h-5 ${color.iconText}`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-[#0f172a] leading-tight mb-1 group-hover:text-[#065f46] transition-colors">
                            {child.title}
                          </h4>
                          {child.content && (
                            <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                              {child.content.replace(/<[^>]*>/g, '').trim().substring(0, 120)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Policy Firechat Sub-section (only for Policy Engagement) */}
        {activity.slug === 'policy-engagement' && (activity.policyFirechat || firechatChild) && (
          <PolicyFirechatSection
            firechatContent={activity.policyFirechat || ''}
            childPage={firechatChild}
          />
        )}
      </div>
    </section>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function WhatWeDoPageClient({ activities }: WhatWeDoPageClientProps) {
  // Sort activities by the defined order
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aIdx = ACTIVITY_ORDER.indexOf(a.slug);
      const bIdx = ACTIVITY_ORDER.indexOf(b.slug);
      const aOrder = aIdx === -1 ? 999 : aIdx;
      const bOrder = bIdx === -1 ? 999 : bIdx;
      return aOrder - bOrder;
    });
  }, [activities]);

  // Smooth scroll to hash anchor on page load & highlight the section
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        breadcrumb={[{ label: 'What We Do' }]}
        backgroundImage="/images/policy-engagement.jpg"
      />

      {/* ================================================================== */}
      {/* ACTIVITIES OVERVIEW - Quick navigation cards */}
      {/* ================================================================== */}
      {sortedActivities.length > 0 && (
        <section className="py-12 md:py-16 bg-white border-b border-[#e2e8f0]" aria-label="Activities Overview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {sortedActivities.map((activity, index) => {
                const color = activityColors[index % activityColors.length];
                return (
                  <Link
                    key={activity.id}
                    href={`#activity-${activity.slug}`}
                    className="group text-center p-4 rounded-xl border border-[#e2e8f0] hover:border-[#065f46]/30 bg-white hover:bg-[#f0fdf4] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className={`w-12 h-12 rounded-xl ${color.iconBg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <ActivityIcon name={activity.icon} className={`w-6 h-6 ${color.iconText}`} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-[#0f172a] group-hover:text-[#065f46] transition-colors leading-tight">
                      {activity.title}
                    </h3>
                    {activity.children && activity.children.length > 0 && (
                      <Badge variant="outline" className="mt-2 text-[10px] px-1.5 py-0 border-[#d97706]/30 text-[#d97706]">
                        +{activity.children.length} sub
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* ACTIVITY SECTIONS - Full detail for each activity */}
      {/* ================================================================== */}
      {sortedActivities.map((activity, index) => (
        <ActivitySection key={activity.id} activity={activity} index={index} />
      ))}
    </main>
  );
}
