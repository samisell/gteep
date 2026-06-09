'use client';

import { useState, useEffect, useRef } from 'react';
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
  };
  return iconMap[iconName] || Handshake;
}

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
// Helper: Team member avatar with initials
// =============================================================================

function TeamAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
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
}: HomePageClientProps) {
  const heroDescription = settings.acfOptions?.heroDescription ||
    'Evidence-driven policy analysis for socially inclusive development. We champion partnerships for African development, people-centered growth, and gender equitable economic transformation.';

  const executive = teamMembers.filter((m) => m.category === 'executive');
  const directors = teamMembers.filter((m) => m.category === 'director');
  const advisoryBoard = teamMembers.filter((m) => m.category === 'advisory-board');
  const trustees = teamMembers.filter((m) => m.category === 'board-of-trustees');

  // Get featured outputs: first policy brief, first data stock, first knowledge product
  const firstPolicyBrief = outputs.find((o) => o.type === 'policy-brief');
  const firstDataStock = outputs.find((o) => o.type === 'data-stock');
  const firstKnowledgeProduct = outputs.find((o) => o.type === 'knowledge-product');
  const featuredOutputs = [firstPolicyBrief, firstDataStock, firstKnowledgeProduct].filter(Boolean) as GTEEPOutput[];

  return (
    <main>
      {/* ================================================================== */}
      {/* SECTION 1: HERO */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a]" />

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
            {/* Badge */}
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
                <Globe className="w-4 h-4" />
                Economic Empowerment &amp; Policy Research
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={staggerItem}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              GTEEP
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={staggerItem}
              className="text-lg sm:text-xl md:text-2xl text-[#f59e0b] font-semibold"
            >
              Gilead Trust Economic Empowerment Project
            </motion.p>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              {heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#d97706]/25 transition-all hover:shadow-xl hover:shadow-[#d97706]/30 hover:-translate-y-0.5"
                asChild
              >
                <a href="/what-we-do">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Our Work
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-xl backdrop-blur-sm transition-all hover:-translate-y-0.5"
                asChild
              >
                <a href="#about">
                  Learn More
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
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                What We Do
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Activities
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Driving evidence-based policy change through research, engagement, and empowerment across Africa.
              </p>
            </div>

            {/* Activity cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activities.map((activity) => {
                const IconComponent = getActivityIcon(activity.icon);
                return (
                  <motion.div key={activity.id} variants={staggerItem}>
                    <div className="group p-6 rounded-2xl border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full bg-white">
                      <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center mb-4 group-hover:bg-[#065f46] transition-colors">
                        <IconComponent className="w-6 h-6 text-[#059669] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        {activity.title}
                      </h3>
                      <p className="text-sm text-[#64748b] leading-relaxed">{activity.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* View all button */}
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
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 3: OUR PHILOSOPHY */}
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
              <Badge className="bg-[#d97706]/20 text-[#f59e0b] border-[#d97706]/30 text-sm px-3 py-1 mb-4">
                Our Philosophy
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Philosophy
              </h2>
              <p className="mt-4 text-[#94a3b8] max-w-2xl mx-auto">
                The core principles that guide our work and shape our approach to development in Africa.
              </p>
            </div>
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {philosophy.map((item, index) => {
              const IconComponent = getPhilosophyIcon(item.icon);
              // Make the first item span 2 columns on lg for visual interest
              const isLarge = index === 0;
              return (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  className={isLarge ? 'sm:col-span-2 lg:col-span-2' : ''}
                >
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
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                Our Team
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Who We Are
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                A dedicated team of researchers, policy analysts, and development practitioners committed to Africa&apos;s transformation.
              </p>
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
                <div className="group max-w-4xl mx-auto p-8 rounded-2xl border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#f0fdf4] to-white">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <TeamAvatar name={member.name} size="lg" />
                    <div className="text-center sm:text-left flex-1">
                      <Badge className="bg-[#065f46] text-white text-xs mb-2 hover:bg-[#065f46]">
                        Executive Director
                      </Badge>
                      <h3
                        className="text-2xl font-bold text-[#0f172a] mb-1"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-[#059669] font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-[#64748b] leading-relaxed">{member.bio}</p>
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
                  <div className="group p-6 rounded-2xl border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full bg-white text-center">
                    <div className="flex justify-center mb-4">
                      <TeamAvatar name={member.name} size="md" />
                    </div>
                    <Badge variant="secondary" className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-xs mb-2">
                      Director
                    </Badge>
                    <h3
                      className="text-lg font-semibold text-[#0f172a] mb-1"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#059669] font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-sm text-[#64748b] leading-relaxed line-clamp-4">{member.bio}</p>
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
              <Badge className="bg-[#fef3c7] text-[#d97706] border-[#d97706]/20 text-sm px-3 py-1 mb-4">
                Advisory Board
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Advisory Board
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Distinguished experts who provide strategic guidance and direction to our work.
              </p>
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
                  <div className="group p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center">
                    <div className="flex justify-center mb-3">
                      <TeamAvatar name={member.name} size="sm" />
                    </div>
                    <h3
                      className="text-sm font-semibold text-[#0f172a] mb-1"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#059669] font-medium">{member.role}</p>
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
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                Board of Trustees
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Board of Trustees
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Providing governance oversight and strategic direction for GTEEP&apos;s mission.
              </p>
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
                  <div className="group p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center">
                    <div className="flex justify-center mb-3">
                      <TeamAvatar name={member.name} size="sm" />
                    </div>
                    <h3
                      className="text-sm font-semibold text-[#0f172a] mb-1"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#059669] font-medium">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 7: FEATURED OUTPUTS */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-28 bg-[#0f172a] relative overflow-hidden" id="outputs" aria-label="Featured Outputs">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#059669]/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#d97706]/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <Badge className="bg-[#d97706]/20 text-[#f59e0b] border-[#d97706]/30 text-sm px-3 py-1 mb-4">
                Our Work
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Featured Outputs
              </h2>
              <p className="mt-4 text-[#94a3b8] max-w-2xl mx-auto">
                Key research outputs spanning policy briefs, data resources, and knowledge products.
              </p>
            </div>
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredOutputs.map((output) => (
              <motion.div key={output.id} variants={staggerItem}>
                <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <Badge className="bg-[#d97706]/20 text-[#f59e0b] border-[#d97706]/30 text-xs w-fit mb-4 hover:bg-[#d97706]/30">
                    {getOutputTypeLabel(output.type)}
                  </Badge>
                  <h3
                    className="text-lg font-semibold text-white mb-3 leading-snug group-hover:text-[#f59e0b] transition-colors"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {output.title}
                  </h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed mb-4 flex-grow">{output.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    {output.date && (
                      <span className="text-xs text-[#64748b]">
                        {new Date(output.date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    <Button
                      variant="link"
                      className="text-[#f59e0b] hover:text-[#d97706] p-0 h-auto text-sm group/link ml-auto"
                    >
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View all button */}
          <div className="text-center mt-12">
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

      {/* ================================================================== */}
      {/* SECTION 8: PARTNERS */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-[#f8fafc]" id="partners" aria-label="Our Partners">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <Badge className="bg-[#fef3c7] text-[#d97706] border-[#d97706]/20 text-sm px-3 py-1 mb-4">
                Collaborations
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Partners
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Working alongside leading institutions across Africa and globally to drive evidence-based policy change.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {partners.map((partner) => {
                const IconComponent = getPartnerIcon(partner.type);
                return (
                  <motion.div key={partner.id} variants={staggerItem}>
                    <div className="group p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#065f46]/20 hover:shadow-md transition-all duration-300 text-center h-full flex flex-col items-center justify-center hover:-translate-y-1">
                      <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center mb-3 group-hover:bg-[#065f46]/10 transition-colors">
                        <IconComponent className="w-7 h-7 text-[#059669]" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#0f172a] mb-2 group-hover:text-[#065f46] transition-colors">
                        {partner.name}
                      </h3>
                      {partner.country && (
                        <Badge variant="secondary" className="text-xs bg-[#f1f5f9] text-[#64748b]">
                          {partner.country}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* View all button */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
                asChild
              >
                <a href="/partners">
                  View All Partners
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 9: BLOG / LATEST INSIGHTS */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="blog" aria-label="Latest Insights">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                Latest Insights
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                From Our Blog
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Analysis, commentary, and insights on African trade policy, economic development, and social inclusion.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogPosts.slice(0, 3).map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0]">
                    {/* Image area */}
                    <div className="h-48 bg-gradient-to-br from-[#065f46] to-[#047857] relative flex items-center justify-center">
                      <div className="text-center text-white/80">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-60" />
                        <p className="text-sm font-medium">GTEEP Insights</p>
                      </div>
                      {/* Category badge */}
                      {post.categories.length > 0 && (
                        <Badge className="absolute top-4 left-4 bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
                          {post.categories[0]}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      {/* Date */}
                      <p className="text-xs text-[#94a3b8] mb-2">
                        {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>

                      {/* Title */}
                      <h3
                        className="text-base font-semibold text-[#0f172a] mb-3 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                        <span className="text-xs text-[#94a3b8]">By {post.author}</span>
                        <Button
                          variant="link"
                          className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
                        >
                          Read More
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* View all button */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
                asChild
              >
                <a href="/blog">
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* SECTION 10: NEWSLETTER + CONTACT CTA */}
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
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Stay Connected
              </h2>
              <p className="text-[#94a3b8] max-w-xl mx-auto">
                Subscribe to our newsletter for the latest research insights, policy analysis, and updates on our work across Africa.
              </p>
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
              <p className="text-xs text-[#64748b] mt-3 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p className="text-white font-medium text-sm">Email</p>
                <a
                  href={`mailto:${settings.acfOptions?.contactEmail || 'info@gteep.com'}`}
                  className="text-[#94a3b8] text-sm hover:text-[#f59e0b] transition-colors"
                >
                  {settings.acfOptions?.contactEmail || 'info@gteep.com'}
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
    </main>
  );
}
