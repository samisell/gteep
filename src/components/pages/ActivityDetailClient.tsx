'use client';

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
  ChevronRight,
  Flame,
  Home,
  Presentation,
  Download,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPActivity, GTEEPActivityChild, GTEEPOutput } from '@/types';

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
// Main Component
// =============================================================================

export default function ActivityDetailClient({ activity, parentPage, relatedOutputs = [] }: ActivityDetailClientProps) {
  const color = activityColors[activity.slug] || activityColors['policy-research'];
  const hasChildren = activity.children && activity.children.length > 0;

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
        subtitle="What We Do"
        description={`GTEEP's ${activity.title} programme — driving evidence-based policy change across Africa.`}
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
                    <Badge className={`${color.iconBg} ${color.iconText} border-0 text-xs px-2 py-0.5`}>
                      GTEEP Programme
                    </Badge>
                  </div>

                  {/* Sub-Programmes */}
                  {hasChildren && (
                    <div className="rounded-2xl border border-[#e2e8f0] p-6 bg-white">
                      <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${color.accent}`} />
                        Sub-Programmes
                      </h4>
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
                    <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${color.accent}`} />
                      Explore
                    </h4>
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

                  {/* Content - use policyFirechat ACF content as fallback if standard content is empty */}
                  {activity.content || activity.policyFirechat ? (
                    <WpContent html={activity.content || activity.policyFirechat || ''} />
                  ) : (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 rounded-xl ${color.iconBg} flex items-center justify-center mx-auto mb-4`}>
                        <ActivityIcon name={activity.icon} className={`w-8 h-8 ${color.iconText}`} />
                      </div>
                      <h3
                        className="text-xl font-bold text-[#0f172a] mb-3"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        Content Coming Soon
                      </h3>
                      <p className="text-[#64748b] max-w-md mx-auto">
                        Detailed information about our {activity.title.toLowerCase()} programme is being developed. Check back soon for updates.
                      </p>
                    </div>
                  )}

                  {/* Policy Firechat (only on Policy Engagement parent page, not on the firechat page itself) */}
                  {activity.slug === 'policy-engagement' && activity.policyFirechat && (
                    <div className="bg-gradient-to-br from-[#fef3c7]/50 to-[#f0fdf4]/30 rounded-2xl p-6 md:p-8 border border-[#d97706]/20">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center shadow-lg">
                          <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3
                            className="text-xl font-bold text-[#0f172a]"
                            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                          >
                            Policy Firechat
                          </h3>
                          <p className="text-sm text-[#d97706] font-medium">
                            Development Conversations
                          </p>
                        </div>
                      </div>
                      <WpContent html={activity.policyFirechat} />
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          asChild
                          className="bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-xl"
                        >
                          <Link href="/fireside-chats">
                            <Flame className="w-4 h-4 mr-2" />
                            View Fireside Chats
                          </Link>
                        </Button>
                        {relatedOutputs.length > 0 && (
                          <Button
                            asChild
                            variant="outline"
                            className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white rounded-xl"
                          >
                            <Link href="/outputs?tab=concept-note">
                              <BookOpen className="w-4 h-4 mr-2" />
                              View Related Outputs ({relatedOutputs.length})
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Related Outputs Section */}
                  {relatedOutputs.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[#e2e8f0]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[#059669]" />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-bold text-[#0f172a]"
                            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                          >
                            Related Outputs
                          </h3>
                          <p className="text-sm text-[#64748b]">
                            Downloadable files related to this programme
                          </p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {relatedOutputs.map((output) => (
                          <div
                            key={output.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-[#e2e8f0] hover:border-[#065f46]/30 hover:shadow-md transition-all duration-200 group"
                          >
                            {/* File icon */}
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} flex items-center justify-center shrink-0`}>
                              {output.fileType === 'pptx' || output.fileType === 'ppt' ? (
                                <Presentation className="w-6 h-6 text-white/90" />
                              ) : (
                                <FileText className="w-6 h-6 text-white/90" />
                              )}
                            </div>
                            {/* File info */}
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
                            {/* Download link */}
                            {output.downloadUrl && (
                              <a
                                href={output.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 w-9 h-9 rounded-lg bg-[#f0fdf4] flex items-center justify-center text-[#059669] hover:bg-[#065f46] hover:text-white transition-colors"
                                aria-label={`Download ${output.title}`}
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link
                          href="/outputs?tab=concept-note"
                          className="text-sm text-[#059669] hover:text-[#047857] font-medium flex items-center gap-1 transition-colors"
                        >
                          View all outputs
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Children Sub-Pages */}
              {hasChildren && (
                <AnimatedSection>
                  <div className="mt-12 pt-10 border-t border-[#e2e8f0]">
                    <h3
                      className="text-xl font-bold text-[#0f172a] mb-6"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      Sub-Programmes under {activity.title}
                    </h3>
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
                              <div className="absolute bottom-3 left-3">
                                <Badge className="bg-white/90 text-[#0f172a] text-xs">
                                  {child.slug === 'policy-firechat' ? '🔥 Firechat' : 'Sub-Programme'}
                                </Badge>
                              </div>
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
