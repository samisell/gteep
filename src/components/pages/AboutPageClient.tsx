'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Handshake,
  Microscope,
  TrendingUp,
  UserCheck,
  Scale,
  ArrowRight,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import type {
  WPSiteSettings,
  GTEEPPhilosophy,
  GTEEPTeamMember,
} from '@/types';

// =============================================================================
// Props
// =============================================================================

interface AboutPageClientProps {
  settings: WPSiteSettings;
  philosophy: GTEEPPhilosophy[];
  teamMembers: GTEEPTeamMember[];
}

// =============================================================================
// Icon Maps
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
// Team Avatar
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
// Animation Variants
// =============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =============================================================================
// Main Component
// =============================================================================

export default function AboutPageClient({
  settings,
  philosophy,
  teamMembers,
}: AboutPageClientProps) {
  const executive = teamMembers.filter((m) => m.category === 'executive');
  const directors = teamMembers.filter((m) => m.category === 'director');
  const advisoryBoard = teamMembers.filter((m) => m.category === 'advisory-board');
  const trustees = teamMembers.filter((m) => m.category === 'board-of-trustees');

  const missionDescription = settings.acfOptions?.aboutSummary ||
    'GTEEP is a non-profit organization dedicated to advancing socially inclusive development in Africa through evidence-driven policy research, strategic engagement, and community empowerment. Founded on the belief that data speaks more than rhetoric, we work to ensure that policy decisions are grounded in rigorous analysis and that the voices of ordinary citizens are heard in the policy process.';

  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="About Us"
        subtitle="Gilead Trust Economic Empowerment Project"
        description="Evidence-driven policy analysis for socially inclusive development in Africa."
        breadcrumb={[{ label: 'About Us' }]}
      />

      {/* ================================================================== */}
      {/* MISSION SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="Our Mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: Mission Text */}
            <AnimatedSection>
              <div className="space-y-6">
                <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1">
                  Our Mission
                </Badge>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0f172a]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Empowering Communities Through Evidence-Based Policy
                </h2>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#059669] to-[#d97706]" />
                <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                  {missionDescription}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    asChild
                    className="bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl px-6"
                  >
                    <Link href="/what-we-do">
                      Our Activities
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white rounded-xl px-6"
                  >
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Visual element */}
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src="/images/gteep-community-outreach.png"
                    alt="GTEEP community outreach - Connecting communities and creating impact"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#065f46]/60 via-[#047857]/40 to-[#0f172a]/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Handshake className="w-20 h-20 mx-auto mb-4 opacity-60" />
                      <p
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        GTEEP
                      </p>
                      <p className="text-sm text-white/80">
                        Gilead Trust Economic Empowerment Project
                      </p>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#d97706]/20 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#059669]/20 blur-2xl" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PHILOSOPHY SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-[#0f172a] relative overflow-hidden" aria-label="Our Philosophy">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#059669]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#d97706]/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
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
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {philosophy.map((item, index) => {
              const IconComponent = getPhilosophyIcon(item.icon);
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
                    <h3
                      className="text-lg font-semibold text-white mb-2"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
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
      {/* LEADERSHIP: EXECUTIVE DIRECTOR */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="Leadership">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                Leadership
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Leadership
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Experienced leaders driving GTEEP&apos;s mission for evidence-based, inclusive policy across Africa.
              </p>
            </div>
          </AnimatedSection>

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
                  <TeamAvatar name={member.name} size="lg" imageUrl={member.image} />
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

          {/* Directors Grid */}
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
                    <TeamAvatar name={member.name} size="md" imageUrl={member.image} />
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

      {/* ================================================================== */}
      {/* ADVISORY BOARD */}
      {/* ================================================================== */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-[#f8fafc]" aria-label="Advisory Board">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Card className="group p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center">
                    <CardContent className="p-0">
                      <div className="flex justify-center mb-3">
                        <TeamAvatar name={member.name} size="sm" imageUrl={member.image} />
                      </div>
                      <h3
                        className="text-sm font-semibold text-[#0f172a] mb-1"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#059669] font-medium">{member.role}</p>
                      <p className="text-xs text-[#64748b] leading-relaxed mt-2 line-clamp-3">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ================================================================== */}
      {/* BOARD OF TRUSTEES */}
      {/* ================================================================== */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-white" aria-label="Board of Trustees">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Card className="group p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full text-center">
                    <CardContent className="p-0">
                      <div className="flex justify-center mb-3">
                        <TeamAvatar name={member.name} size="md" imageUrl={member.image} />
                      </div>
                      <h3
                        className="text-base font-semibold text-[#0f172a] mb-1"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#059669] font-medium">{member.role}</p>
                      <p className="text-xs text-[#64748b] leading-relaxed mt-2 line-clamp-3">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20" aria-label="Call to Action">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="rounded-2xl bg-gradient-to-r from-[#065f46] to-[#0f172a] p-8 md:p-12 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#d97706]/15 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#059669]/15 blur-2xl" />
              </div>

              <div className="relative z-10">
                <h2
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Get Involved with GTEEP
                </h2>
                <p className="mt-3 text-emerald-100 max-w-2xl mx-auto">
                  Whether you&apos;re a researcher, policymaker, or development practitioner, we&apos;d love to hear from you.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
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
                    <Link href="/outputs">
                      View Our Outputs
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
