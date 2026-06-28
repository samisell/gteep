'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  FileSearch,
  Users,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Heart,
  Handshake,
  Microscope,
  TrendingUp,
  UserCheck,
  Scale,
  Globe,
  Building2,
  FlaskConical,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Flame,
  Target,
  Eye,
  ChevronLeft,
  Presentation,
  FileText,
  FileSpreadsheet,
  FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type {
  WPSiteSettings,
  GTEEPActivity,
  GTEEPPhilosophy,
  GTEEPTeamMember,
  GTEEPOutput,
  GTEEPPartner,
  GTEEPBlogPost,
} from '@/types';
import { TeamMemberModal } from '@/components/features/TeamMemberModal';
import { ViewDocumentButton } from '@/components/features/DocumentViewer';

// =============================================================================
// Props
// =============================================================================

interface HomePageClientProps {
  settings: WPSiteSettings;
  activities: GTEEPActivity[];
  philosophy: GTEEPPhilosophy[];
  teamMembers: GTEEPTeamMember[];
  outputs: GTEEPOutput[];
  partners: GTEEPPartner[];
  blogPosts: GTEEPBlogPost[];
  aboutData: {
    aboutSummary: string;
    aboutVision: string;
    aboutMission: string;
    aboutGoal: string;
  };
}

// =============================================================================
// Animation Variants
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =============================================================================
// Helper: Animated Counter Component
// =============================================================================

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// =============================================================================
// Helper: Section Wrapper with Scroll Reveal
// =============================================================================

function SectionReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// Helper: Activity icon mapping
// =============================================================================

function getActivityIcon(iconName: string) {
  const iconMap: Record<string, React.ElementType> = {
    FileSearch,
    Users,
    Lightbulb,
    BarChart3,
    GraduationCap,
    Heart,
    BookOpen,
  };
  return iconMap[iconName] || FileSearch;
}

// =============================================================================
// Helper: Philosophy icon mapping
// =============================================================================

function getPhilosophyIcon(iconName: string) {
  const iconMap: Record<string, React.ElementType> = {
    Handshake,
    Microscope,
    TrendingUp,
    UserCheck,
    Scale,
    Target,
    Eye,
    BookOpen,
    Users,
  };
  return iconMap[iconName] || Handshake;
}

// =============================================================================
// Activity ordering — controls the display order of What We Do items
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
// Helper: Partner icon mapping
// =============================================================================

function getPartnerIcon(type: string) {
  const iconMap: Record<string, React.ElementType> = {
    university: GraduationCap,
    'international-organization': Globe,
    government: Building2,
    'research-institute': FlaskConical,
    ngo: Users,
    'private-sector': Building2,
  };
  return iconMap[type] || Building2;
}

// =============================================================================
// Helper: Output type label
// =============================================================================

function getOutputTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'concept-note': 'Concept Note',
    'policy-brief': 'Policy Brief',
    'data-stock': 'Data Stock',
    'video': 'Video',
    'photo': 'Photo Gallery',
    'knowledge-product': 'Knowledge Product',
  };
  return labels[type] || 'Output';
}

// =============================================================================
// Helper: File type icon for output cards
// =============================================================================

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
// Outputs Carousel Component
// =============================================================================

function OutputsCarousel({ outputs }: { outputs: GTEEPOutput[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, outputs]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320; // approximate card + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (outputs.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#0f172a] relative overflow-hidden" id="outputs" aria-label="Our Outputs">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#059669]/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#d97706]/8 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Outputs
              </h2>
            </div>
            {/* Navigation arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#d97706] hover:bg-[#d97706]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white/60"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#d97706] hover:bg-[#d97706]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white/60"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </SectionReveal>

        {/* Carousel */}
        <div className="relative">
          {/* Left fade + mobile arrow */}
          {canScrollLeft && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none hidden sm:block" />
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0f172a]/80 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#d97706] sm:hidden z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {outputs.map((output) => {
              const ext = output.fileType || '';
              const FileIconComp = getFileTypeIcon(ext);
              const isFirechatRelated = output.relatedSubActivity === 'policy-firechat';

              return (
                <div
                  key={output.id}
                  className="group flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
                >
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                    {/* Gradient header with file icon */}
                    <div className={`h-32 bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} relative flex items-center justify-center`}>
                      <div className="text-center text-white/80">
                        <FileIconComp className="w-10 h-10 mx-auto mb-2 opacity-70" />
                        <p className="text-xs font-medium">{getFileTypeLabel(ext)}</p>
                      </div>
                      {/* Type badge */}
                      <Badge className="absolute top-3 left-3 bg-white/20 text-white text-[10px] border-white/30 backdrop-blur-sm">
                        {getOutputTypeLabel(output.type)}
                      </Badge>
                      {/* File extension badge */}
                      {ext && (
                        <Badge className="absolute top-3 right-3 bg-white/90 text-[#0f172a] text-[10px] font-mono border-0">
                          .{ext}
                        </Badge>
                      )}
                      {/* Fireside Chat indicator */}
                      {isFirechatRelated && (
                        <Link
                          href="/what-we-do/policy-engagement/policy-firechat"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-3 left-3"
                        >
                          <Badge className="bg-[#d97706]/90 text-white text-[10px] border-0 hover:bg-[#d97706] transition-colors cursor-pointer">
                            <Flame className="w-3 h-3 mr-1" />
                            Fireside Chat
                          </Badge>
                        </Link>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3
                        className="text-sm font-semibold text-white mb-2 leading-snug line-clamp-2 group-hover:text-[#f59e0b] transition-colors"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {output.title}
                      </h3>
                      <p className="text-xs text-[#94a3b8] leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {output.description || output.excerpt}
                      </p>
                      {/* View button */}
                      <div className="pt-3 border-t border-white/10">
                        {output.downloadUrl ? (
                          <ViewDocumentButton
                            documentUrl={output.downloadUrl}
                            documentTitle={output.title}
                            fileType={ext}
                            size="sm"
                            className="text-[#f59e0b] hover:text-[#d97706]"
                          />
                        ) : (
                          <Link
                            href="/outputs"
                            className="text-xs text-[#94a3b8] hover:text-[#f59e0b] transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right fade + mobile arrow */}
          {canScrollRight && (
            <>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none hidden sm:block" />
              <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0f172a]/80 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#d97706] sm:hidden z-10"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="border-[#d97706] text-[#f59e0b] hover:bg-[#d97706] hover:text-white px-8 rounded-xl transition-all"
            asChild
          >
            <a href="/outputs">
              View All Outputs
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Helper: Team member avatar with initials
// =============================================================================

function TeamAvatar({ name, size = 'md', imageUrl }: { name: string; size?: 'sm' | 'md' | 'lg'; imageUrl?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
  };

  if (imageUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg shrink-0 relative`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center"
          sizes="96px"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#059669] to-[#065f46] flex items-center justify-center text-white font-bold shadow-lg shrink-0`}
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {initials}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function HomePageClient({
  settings,
  activities,
  philosophy,
  teamMembers,
  outputs,
  partners,
  blogPosts,
  aboutData,
}: HomePageClientProps) {
  // Hero content comes entirely from the WordPress about summary (ACF / page editor).
  const heroParagraphs = (aboutData.aboutSummary || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const executive = teamMembers.filter((m) => m.category === 'executive');
  const directors = teamMembers.filter((m) => m.category === 'director');
  const advisoryBoard = teamMembers.filter((m) => m.category === 'advisory-board');
  const trustees = teamMembers.filter((m) => m.category === 'board-of-trustees');

  // Team member modal state
  const [selectedMember, setSelectedMember] = useState<GTEEPTeamMember | null>(null);

  // Sort activities by the defined order
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const aIdx = ACTIVITY_ORDER.indexOf(a.slug);
      const bIdx = ACTIVITY_ORDER.indexOf(b.slug);
      // Items not in the order list go to the end
      const aOrder = aIdx === -1 ? 999 : aIdx;
      const bOrder = bIdx === -1 ? 999 : bIdx;
      return aOrder - bOrder;
    });
  }, [activities]);

  // All outputs for the carousel (downloadable files from ACF)
  const allOutputs = outputs;

  return (
    <main>
      {/* ================================================================== */}
      {/* SECTION 1: HERO */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero">
        {/* Background image */}
        <Image
          src="/images/hero-africa-communities.png"
          alt="GTEEP - Building Knowledge, Transforming Lives, Empowering Communities across Africa"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#065f46]/80 via-[#047857]/70 to-[#0f172a]/85" />

        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5"
            animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#d97706]/10"
            animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full bg-white/5"
            animate={{ y: [0, 25, 0], x: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-[#f59e0b]/8"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-white/3"
            animate={{ y: [0, 35, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8"
          >
            {/* Main heading */}
            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              GTEEP
            </motion.h1>

            {/* Description — full about summary from WordPress */}
            <motion.div
              variants={staggerItem}
              className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed space-y-4"
            >
              {heroParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#d97706]/25 transition-all hover:shadow-xl hover:shadow-[#d97706]/30 hover:-translate-y-0.5"
                asChild
              >
                <a href="/what-we-do/policy-engagement/policy-firechat">
                  <Flame className="w-5 h-5 mr-2" />
                  Join Fireside Chat
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-xl backdrop-blur-sm transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="/what-we-do">
                  Explore Our Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-white/50"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 2: OUR ACTIVITIES (What We Do) */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="activities" aria-label="Our Activities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Activities
              </h2>
            </div>

            {/* Activity cards */}
            {sortedActivities.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.icon);
                  // Description comes from WordPress only — no hardcoded fallback
                  const description = activity.description || (activity.content
                    ? activity.content.replace(/<[^>]*>/g, '').trim().substring(0, 150) + '...'
                    : '');
                  return (
                    <motion.div key={activity.id} variants={staggerItem}>
                      <Link
                        href={`/what-we-do/${activity.slug}`}
                        className="group block p-6 rounded-2xl border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full bg-white cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center mb-4 group-hover:bg-[#065f46] transition-colors">
                          <IconComponent className="w-6 h-6 text-[#059669] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0f172a] mb-2 group-hover:text-[#065f46] transition-colors" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                          {activity.title}
                        </h3>
                        {description && <p className="text-sm text-[#64748b] leading-relaxed">{description}</p>}
                        <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[#065f46] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Learn more
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
                  <FileSearch className="w-8 h-8 text-[#059669]" />
                </div>
              </div>
            )}

            {/* View all button */}
            {sortedActivities.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
                  asChild
                >
                  <a href="/what-we-do">
                    View All Activities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 3: OUR PHILOSOPHY — Mission, Vision, Goal */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-28 bg-[#0f172a] relative overflow-hidden" id="philosophy" aria-label="Our Philosophy">
        {/* Decorative blurred circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#059669]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#d97706]/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#047857]/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Philosophy
              </h2>
            </div>
          </SectionReveal>

          {/* Mission, Vision, Goal Cards from ACF */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            {/* Our Mission */}
            <motion.div variants={staggerItem}>
              <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                  <Target className="w-6 h-6 text-[#059669] group-hover:text-[#f59e0b] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Our Mission
                </h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  {aboutData.aboutMission || 'To continually knowledge spaces and inform policies with data-driven evidence and empower the citizens with requisite tools to reshape their individual and collective economic choices.'}
                </p>
              </div>
            </motion.div>

            {/* Our Vision */}
            <motion.div variants={staggerItem}>
              <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                  <Eye className="w-6 h-6 text-[#059669] group-hover:text-[#f59e0b] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Our Vision
                </h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  {aboutData.aboutVision || 'A socially inclusive Africa where evidence-based policy drives sustainable economic transformation and gender equity.'}
                </p>
              </div>
            </motion.div>

            {/* Our Goal */}
            <motion.div variants={staggerItem}>
              <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-[#059669] group-hover:text-[#f59e0b] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  Our Goal
                </h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  {aboutData.aboutGoal || 'To champion partnerships for African development, people-centered growth, and gender equitable economic transformation.'}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional philosophy items from WordPress ACF (if any) */}
          {philosophy.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {philosophy.map((item) => {
                const IconComponent = getPhilosophyIcon(item.icon);
                return (
                  <motion.div key={item.id} variants={staggerItem}>
                    <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full">
                      <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-[#059669] group-hover:text-[#f59e0b] transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#94a3b8] leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 4: WHO WE ARE */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="about" aria-label="Who We Are">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Who We Are
              </h2>
            </div>

            {/* Executive Director - Featured Card */}
            {executive.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div
                  className="group max-w-4xl mx-auto p-8 rounded-2xl border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#f0fdf4] to-white cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <TeamAvatar name={member.name} size="lg" imageUrl={member.image} />
                    <div className="text-center sm:text-left flex-1">
                      <Badge className="bg-[#065f46] text-white text-xs mb-2 hover:bg-[#065f46]">
                        Executive Director
                      </Badge>
                      <h3
                        className="text-2xl font-bold text-[#0f172a] mb-1 group-hover:text-[#065f46] transition-colors"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-[#059669] font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-[#64748b] leading-relaxed line-clamp-3">{member.bio}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-[#059669] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view full profile →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Directors - 3-column grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {directors.map((member) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <div
                    className="group p-6 rounded-2xl border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full bg-white text-center cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex justify-center mb-4">
                      <TeamAvatar name={member.name} size="md" imageUrl={member.image} />
                    </div>
                    <Badge variant="secondary" className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-xs mb-2">
                      Director
                    </Badge>
                    <h3
                      className="text-lg font-semibold text-[#0f172a] mb-1 group-hover:text-[#065f46] transition-colors"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#059669] font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-sm text-[#64748b] leading-relaxed line-clamp-4">{member.bio}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#059669] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View full profile →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 5: ADVISORY BOARD */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-[#f8fafc]" id="advisory-board" aria-label="Advisory Board">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Advisory Board
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              {advisoryBoard.map((member) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <div
                    className="group p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex justify-center mb-3">
                      <TeamAvatar name={member.name} size="sm" imageUrl={member.image} />
                    </div>
                    <h3
                      className="text-sm font-semibold text-[#0f172a] mb-1 group-hover:text-[#065f46] transition-colors"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#059669] font-medium">{member.role}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#059669] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View profile →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 6: BOARD OF TRUSTEES */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="trustees" aria-label="Board of Trustees">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Board of Trustees
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {trustees.map((member) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <div
                    className="group p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex justify-center mb-3">
                      <TeamAvatar name={member.name} size="sm" imageUrl={member.image} />
                    </div>
                    <h3
                      className="text-sm font-semibold text-[#0f172a] mb-1 group-hover:text-[#065f46] transition-colors"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#059669] font-medium">{member.role}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#059669] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View profile →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 7: OUR OUTPUTS (Carousel) */}
      {/* ================================================================== */}
      <OutputsCarousel outputs={allOutputs} />

      {/* ================================================================== */}
      {/* SECTION 8: FIRESIDE CHAT — CTA navigation only (content is on the dedicated page) */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-gradient-to-br from-[#f0fdf4] via-white to-[#fef3c7]/30 relative overflow-hidden" id="fireside-chat" aria-label="Fireside Chat">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 rounded-xl shadow-lg shadow-[#d97706]/20 transition-all hover:shadow-xl"
                asChild
              >
                <a href="/what-we-do/policy-engagement/policy-firechat">
                  <Flame className="w-5 h-5 mr-2" />
                  Explore Fireside Chat
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
                asChild
              >
                <a href="/outputs">
                  View Our Outputs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 9: NEWSLETTER + CONTACT CTA */}
      {/* ================================================================== */}
      <section
        className="py-20 sm:py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden"
        id="contact"
        aria-label="Stay Connected"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#065f46]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#d97706]/8 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d97706]/20 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-[#f59e0b]" />
              </div>
            </div>

            {/* Newsletter form */}
            <div className="max-w-md mx-auto mb-16">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#d97706] focus:ring-[#d97706]/20 h-12 rounded-xl"
                  aria-label="Email address for newsletter"
                />
                <Button className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 h-12 rounded-xl font-semibold shadow-lg shadow-[#d97706]/25 shrink-0 transition-all hover:shadow-xl hover:shadow-[#d97706]/30">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-white font-medium text-sm">Email</p>
                <a
                  href={`mailto:${settings.acfOptions?.contactEmail || 'info@gteep.gileadtrust.com'}`}
                  className="text-[#94a3b8] text-sm hover:text-[#f59e0b] transition-colors"
                >
                  {settings.acfOptions?.contactEmail || 'info@gteep.gileadtrust.com'}
                </a>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-white font-medium text-sm">Address</p>
                <p className="text-[#94a3b8] text-sm">
                  {settings.acfOptions?.contactAddress || 'Lagos, Nigeria'}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-white font-medium text-sm">Phone</p>
                <a
                  href={`tel:${settings.acfOptions?.contactPhone || '+234 801 234 5678'}`}
                  className="text-[#94a3b8] text-sm hover:text-[#f59e0b] transition-colors"
                >
                  {settings.acfOptions?.contactPhone || '+234 801 234 5678'}
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </main>
  );
}
