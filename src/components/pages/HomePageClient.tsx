'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ArrowRight,
  BookOpen,
  Users,
  MapPin,
  FlaskConical,
  Wheat,
  Factory,
  Scale,
  Calendar,
  Clock,
  Quote,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Briefcase,
  FileText,
  Award,
  Building2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type {
  WPPublication,
  WPProject,
  WPEvent,
  WPPartner,
  WPTestimonial,
  WPSiteSettings,
} from '@/types';

// =============================================================================
// Props
// =============================================================================

interface HomePageClientProps {
  settings: WPSiteSettings;
  publications: WPPublication[];
  projects: WPProject[];
  events: WPEvent[];
  partners: WPPartner[];
  testimonials: WPTestimonial[];
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
// Helper: Publication type badge label
// =============================================================================

function getPublicationTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    'journal-article': 'Journal Article',
    'book-chapter': 'Book Chapter',
    'working-paper': 'Working Paper',
    'policy-brief': 'Policy Brief',
    'conference-paper': 'Conference Paper',
    'report': 'Report',
  };
  return labels[type || ''] || 'Publication';
}

function getEventTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    'conference': 'Conference',
    'workshop': 'Workshop',
    'seminar': 'Seminar',
    'lecture': 'Lecture',
    'panel': 'Panel Discussion',
    'webinar': 'Webinar',
  };
  return labels[type || ''] || 'Event';
}

function getPartnerTypeIcon(type?: string) {
  switch (type) {
    case 'university': return GraduationCap;
    case 'research-institute': return FlaskConical;
    case 'government': return Building2;
    case 'international-organization': return Globe;
    case 'ngo': return Users;
    case 'private-sector': return Briefcase;
    default: return Building2;
  }
}

// =============================================================================
// Research Areas Data
// =============================================================================

const researchAreas = [
  {
    icon: Globe,
    title: 'African Continental Free Trade Area (AfCFTA)',
    description: 'Monitoring implementation, assessing trade outcomes, and identifying policy challenges under the AfCFTA framework across participating member states.',
  },
  {
    icon: Scale,
    title: 'Regional Economic Integration',
    description: 'Analyzing integration progress in ECOWAS, COMESA, and other regional economic communities, from customs unions to monetary cooperation.',
  },
  {
    icon: FileText,
    title: 'Trade Facilitation & Policy',
    description: 'Evaluating trade facilitation reforms, single window systems, and non-tariff barrier reduction strategies to improve intra-African trade flows.',
  },
  {
    icon: Users,
    title: 'Gender & Trade',
    description: 'Investigating the gender dimensions of trade policy, including the experiences of women informal cross-border traders and gender-responsive facilitation.',
  },
  {
    icon: Wheat,
    title: 'Agricultural Value Chains',
    description: 'Examining agricultural trade integration, value chain development, and food security implications of regional trade agreements.',
  },
  {
    icon: Factory,
    title: 'Industrial Development',
    description: 'Exploring industrialization prospects through regional value chains, special economic zones, and trade policy space for structural transformation.',
  },
];

// =============================================================================
// Main Component
// =============================================================================

export default function HomePageClient({
  settings,
  publications,
  projects,
  events,
  partners,
  testimonials,
}: HomePageClientProps) {
  const heroTitle = settings.acfOptions?.heroTitle || 'Prof. Bola Akanji';
  const heroSubtitle = settings.acfOptions?.heroSubtitle || 'Leading Research in African Trade & Economic Development';
  const heroDescription = settings.acfOptions?.heroDescription || 'Professor of Economics with over 25 years of research experience in international trade policy, regional integration, and sustainable economic development across Africa. Dedicated to evidence-based policy that transforms livelihoods.';
  const aboutSummary = settings.acfOptions?.aboutSummary || 'Professor Bola Akanji is a distinguished economist specializing in African trade policy, regional integration, and development economics. With a PhD from the University of Ibadan and over 25 years of research experience, she has published extensively on the AfCFTA, ECOWAS trade protocols, and the gender dimensions of trade.';

  return (
    <main className="min-h-screen">
      {/* ================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a]" />

        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            {/* Subtitle badge */}
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
                <Globe className="w-4 h-4" />
                Academic Research & Policy Advisory
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={staggerItem}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {heroTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={staggerItem}
              className="text-lg sm:text-xl md:text-2xl text-[#f59e0b] font-semibold"
            >
              {heroSubtitle}
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
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Research
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-xl backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
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
      {/* 2. ABOUT PREVIEW SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[#065f46] to-[#047857] shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center text-white/90">
                      <GraduationCap className="w-20 h-20 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        Prof. Bola Akanji
                      </p>
                      <p className="text-sm text-white/70 mt-1">PhD Economics</p>
                    </div>
                  </div>
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#d97706]/10 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#065f46]/10 rounded-2xl -z-10" />
              </div>

              {/* Text content */}
              <div className="space-y-6">
                <div>
                  <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">About</span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    About Prof. Akanji
                  </h2>
                </div>

                <div className="space-y-4 text-[#334155] leading-relaxed">
                  <p>{aboutSummary.split('.').slice(0, 2).join('.')}.</p>
                  <p>Beyond academic research, Prof. Akanji serves as a policy advisor to several African governments and regional organizations, including the African Union Commission, ECOWAS Commission, and the United Nations Economic Commission for Africa (UNECA).</p>
                </div>

                {/* Key highlights */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { value: '25+', label: 'Years Experience', icon: Award },
                    { value: '50+', label: 'Publications', icon: BookOpen },
                    { value: '15+', label: 'Countries', icon: MapPin },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-4 rounded-xl bg-[#f0fdf4] border border-[#065f46]/10 hover:shadow-md transition-shadow"
                    >
                      <item.icon className="w-6 h-6 mx-auto text-[#059669] mb-2" />
                      <p className="text-2xl font-bold text-[#065f46]">{item.value}</p>
                      <p className="text-xs text-[#475569] mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  variant="link"
                  className="text-[#059669] hover:text-[#047857] p-0 h-auto text-base font-semibold group"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 3. RESEARCH AREAS SECTION */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-28 bg-[#0f172a]" id="research">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider">Expertise</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Research Areas
              </h2>
              <p className="mt-4 text-[#94a3b8] max-w-2xl mx-auto">
                Pioneering research across key domains of African trade policy, regional integration, and sustainable economic development.
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
            {researchAreas.map((area) => (
              <motion.div key={area.title} variants={staggerItem}>
                <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#d97706]/30 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                    <area.icon className="w-6 h-6 text-[#059669] group-hover:text-[#f59e0b] transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. FEATURED PUBLICATIONS SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="publications">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Scholarly Work</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Featured Publications
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Selected publications from a portfolio of over 50 academic works on African trade and development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0]">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-[#065f46] text-white text-xs hover:bg-[#065f46]">
                          {getPublicationTypeLabel(pub.acfPublicationFields?.publicationType)}
                        </Badge>
                        <span className="text-xs text-[#94a3b8]">{pub.acfPublicationFields?.year}</span>
                      </div>

                      <h3 className="text-base font-semibold text-[#0f172a] mb-3 leading-snug line-clamp-3 group-hover:text-[#065f46] transition-colors">
                        {pub.title}
                      </h3>

                      <p className="text-sm text-[#64748b] mb-2">
                        {pub.acfPublicationFields?.authors}
                      </p>

                      {pub.acfPublicationFields?.journal && (
                        <p className="text-sm text-[#059669] font-medium mb-3 italic">
                          {pub.acfPublicationFields.journal}
                          {pub.acfPublicationFields.volume && `, Vol. ${pub.acfPublicationFields.volume}`}
                        </p>
                      )}

                      <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-3 flex-grow">
                        {pub.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                        {pub.acfPublicationFields?.citationCount !== undefined && (
                          <span className="text-xs text-[#94a3b8]">
                            {pub.acfPublicationFields.citationCount} citations
                          </span>
                        )}
                        <Button variant="link" className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link ml-auto">
                          Read More
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
              >
                View All Publications
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 5. FEATURED PROJECTS SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-[#f8fafc]" id="projects">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Active Research</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Research Projects
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Current and completed research projects driving policy change across Africa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#e2e8f0]">
                    {/* Featured image area */}
                    <div className="h-48 bg-gradient-to-br from-[#065f46] to-[#047857] relative flex items-center justify-center">
                      <div className="text-center text-white/90">
                        <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-60" />
                        <p className="text-sm font-medium">Research Project</p>
                      </div>
                      {/* Status badge */}
                      <Badge
                        className={`absolute top-4 right-4 ${
                          project.acfProjectFields?.projectStatus === 'ongoing'
                            ? 'bg-[#059669] text-white hover:bg-[#059669]'
                            : project.acfProjectFields?.projectStatus === 'completed'
                            ? 'bg-[#64748b] text-white hover:bg-[#64748b]'
                            : 'bg-[#d97706] text-white hover:bg-[#d97706]'
                        }`}
                      >
                        {project.acfProjectFields?.projectStatus === 'ongoing' ? 'Ongoing' :
                         project.acfProjectFields?.projectStatus === 'completed' ? 'Completed' : 'Upcoming'}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-2 leading-snug group-hover:text-[#065f46] transition-colors">
                        {project.title}
                      </h3>

                      {project.acfProjectFields?.fundingAgency && (
                        <p className="text-sm text-[#059669] font-medium mb-3">
                          Funded by: {project.acfProjectFields.fundingAgency}
                        </p>
                      )}

                      <p className="text-sm text-[#64748b] leading-relaxed line-clamp-3">
                        {project.excerpt}
                      </p>

                      <Button variant="link" className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm mt-4 group/link">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
              >
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 6. UPCOMING EVENTS SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="events">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Engagements</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Upcoming Events
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Conferences, workshops, and lectures featuring Prof. Akanji.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {events.map((event, index) => {
                const startDate = event.acfEventFields?.eventStartDate;
                const eventDate = startDate ? new Date(startDate + 'T00:00:00') : null;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 border-[#e2e8f0] overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Date column */}
                          <div className="sm:w-28 bg-[#065f46] flex flex-col items-center justify-center p-4 sm:p-6 text-white shrink-0">
                            {eventDate ? (
                              <>
                                <span className="text-3xl font-bold">
                                  {eventDate.getDate()}
                                </span>
                                <span className="text-sm font-medium uppercase">
                                  {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-xs text-white/70">
                                  {eventDate.getFullYear()}
                                </span>
                              </>
                            ) : (
                              <Calendar className="w-8 h-8 opacity-50" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs bg-[#f0fdf4] text-[#059669] border-[#065f46]/20">
                                {getEventTypeLabel(event.acfEventFields?.eventType)}
                              </Badge>
                              {event.acfEventFields?.isVirtual && (
                                <Badge variant="secondary" className="text-xs bg-[#fef3c7] text-[#d97706] border-[#d97706]/20">
                                  Virtual
                                </Badge>
                              )}
                              {event.acfEventFields?.eventTime && (
                                <span className="text-xs text-[#94a3b8] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.acfEventFields.eventTime}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-[#0f172a] mb-2 group-hover:text-[#065f46] transition-colors">
                              {event.title}
                            </h3>

                            {(event.acfEventFields?.venue || event.acfEventFields?.city) && (
                              <p className="text-sm text-[#64748b] flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                {[event.acfEventFields?.venue, event.acfEventFields?.city, event.acfEventFields?.country].filter(Boolean).join(', ')}
                              </p>
                            )}

                            {event.acfEventFields?.registrationUrl && (
                              <Button
                                variant="link"
                                className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm mt-2"
                              >
                                Register Now
                                <ExternalLink className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white px-8 rounded-xl transition-all"
              >
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 7. STATISTICS SECTION */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#065f46]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#d97706]/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: 50, suffix: '+', label: 'Publications', icon: BookOpen },
                { value: 25, suffix: '+', label: 'Years Experience', icon: Award },
                { value: 15, suffix: '+', label: 'Countries', icon: MapPin },
                { value: 10, suffix: '+', label: 'Research Projects', icon: FlaskConical },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4">
                    <stat.icon className="w-8 h-8 text-[#f59e0b]" />
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold text-[#f59e0b] mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm sm:text-base text-[#94a3b8] font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 8. TESTIMONIALS SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-white" id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                What Colleagues Say
              </h2>
            </div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 9. PARTNERS SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-[#f8fafc]" id="partners">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Collaborations</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Partners & Collaborations
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Working alongside leading institutions across Africa and globally.
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
                const IconComponent = getPartnerTypeIcon(partner.acfPartnerFields?.partnerType);
                return (
                  <motion.div key={partner.id} variants={staggerItem}>
                    <div className="group p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#065f46]/20 hover:shadow-md transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center mb-3 group-hover:bg-[#065f46]/10 transition-colors">
                        <IconComponent className="w-7 h-7 text-[#059669]" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#0f172a] mb-1 group-hover:text-[#065f46] transition-colors">
                        {partner.title}
                      </h3>
                      {partner.acfPartnerFields?.country && (
                        <p className="text-xs text-[#94a3b8]">{partner.acfPartnerFields.country}</p>
                      )}
                      {partner.acfPartnerFields?.partnerType && (
                        <Badge variant="secondary" className="mt-2 text-xs capitalize bg-[#f1f5f9] text-[#64748b]">
                          {partner.acfPartnerFields.partnerType.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 10. NEWSLETTER SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#065f46]/10 blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d97706]/20 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Stay Updated
            </h2>
            <p className="text-[#94a3b8] mb-8 max-w-lg mx-auto">
              Subscribe to receive updates on new publications, research findings, and upcoming events directly in your inbox.
            </p>

            <NewsletterForm />
          </div>
        </section>
      </SectionReveal>

      {/* ================================================================== */}
      {/* 11. CONTACT CTA SECTION */}
      {/* ================================================================== */}
      <SectionReveal>
        <section className="py-20 sm:py-28 bg-gradient-to-r from-[#065f46] via-[#047857] to-[#059669] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#d97706]/10" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Get in Touch
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Interested in research collaborations, speaking engagements, or policy advisory? Reach out to discuss how we can work together to advance African trade and development.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#065f46] hover:bg-[#f0fdf4] px-10 py-6 text-base font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Contact Prof. Akanji
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}

// =============================================================================
// Testimonials Carousel Sub-Component
// =============================================================================

function TestimonialsCarousel({ testimonials }: { testimonials: WPTestimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, [testimonials.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    startAutoplay();
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    startAutoplay();
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    startAutoplay();
  };

  if (testimonials.length === 0) return null;

  const activeTestimonial = testimonials[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Quote icon */}
        <div className="absolute -top-4 left-4 sm:left-8">
          <Quote className="w-12 h-12 text-[#065f46]/10" />
        </div>

        {/* Testimonial content */}
        <div className="bg-[#f8fafc] rounded-2xl p-8 sm:p-12 min-h-[280px] flex items-center overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
            >
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (activeTestimonial.acfTestimonialFields?.rating || 5)
                        ? 'text-[#f59e0b] fill-[#f59e0b]'
                        : 'text-[#e2e8f0]'
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl text-[#334155] leading-relaxed mb-6 italic">
                &ldquo;{activeTestimonial.content}&rdquo;
              </blockquote>

              <div>
                <p className="font-semibold text-[#0f172a]">
                  {activeTestimonial.acfTestimonialFields?.personName || activeTestimonial.title}
                </p>
                <p className="text-sm text-[#64748b]">
                  {activeTestimonial.acfTestimonialFields?.personTitle}
                </p>
                <p className="text-sm text-[#059669] font-medium">
                  {activeTestimonial.acfTestimonialFields?.personOrganization}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            className="rounded-full border-[#e2e8f0] hover:bg-[#065f46] hover:text-white hover:border-[#065f46] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-[#065f46] w-8'
                    : 'bg-[#cbd5e1] hover:bg-[#94a3b8]'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            className="rounded-full border-[#e2e8f0] hover:bg-[#065f46] hover:text-white hover:border-[#065f46] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Newsletter Form Sub-Component
// =============================================================================

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus-visible:border-[#f59e0b] focus-visible:ring-[#f59e0b]/30"
      />
      <Button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="h-12 bg-[#d97706] hover:bg-[#b45309] text-white px-8 rounded-xl font-semibold shadow-lg shadow-[#d97706]/25 transition-all disabled:opacity-70"
      >
        {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
      </Button>
    </form>
  );
}
