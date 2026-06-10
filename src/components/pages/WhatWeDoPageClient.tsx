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
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPActivity } from '@/types';

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
// Main Component
// =============================================================================

export default function WhatWeDoPageClient({ activities }: WhatWeDoPageClientProps) {
  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="What We Do"
        subtitle="Our Activities"
        description="Driving evidence-based policy change through research, engagement, and empowerment across Africa."
        breadcrumb={[{ label: 'What We Do' }]}
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
            className={`py-16 md:py-24 ${isEven ? 'bg-white' : 'bg-[#f8fafc]'}`}
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
