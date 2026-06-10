'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  ExternalLink,
  MapPin,
  Building2,
  GraduationCap,
  Landmark,
  Users,
  FlaskConical,
  Briefcase,
  Heart,
} from 'lucide-react';
import type { GTEEPPartner } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface PartnersPageClientProps {
  partners: GTEEPPartner[];
}

// =============================================================================
// Icon Map
// =============================================================================

function getPartnerIcon(type: string) {
  const iconMap: Record<string, React.ElementType> = {
    university: GraduationCap,
    'international-organization': Globe,
    government: Landmark,
    'research-institute': FlaskConical,
    ngo: Heart,
    'private-sector': Briefcase,
  };
  return iconMap[type] || Building2;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    university: 'University',
    'research-institute': 'Research Institute',
    government: 'Government',
    ngo: 'NGO',
    'international-organization': 'International Organization',
    'private-sector': 'Private Sector',
  };
  return labels[type] || 'Partner';
}

function getTypeColor(type: string) {
  switch (type) {
    case 'university': return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    case 'research-institute': return 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]/20';
    case 'government': return 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20';
    case 'ngo': return 'bg-[#fff1f2] text-[#e11d48] border-[#e11d48]/20';
    case 'international-organization': return 'bg-[#faf5ff] text-[#7c3aed] border-[#7c3aed]/20';
    case 'private-sector': return 'bg-[#f0fdfa] text-[#0d9488] border-[#0d9488]/20';
    default: return 'bg-[#f1f5f9] text-[#64748b] border-[#64748b]/20';
  }
}

// =============================================================================
// Animation Variants
// =============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =============================================================================
// Main Component
// =============================================================================

export default function PartnersPageClient({ partners }: PartnersPageClientProps) {
  // Group partners by type
  const partnerTypes = Array.from(new Set(partners.map((p) => p.type)));

  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="Our Partners"
        subtitle="Collaborating Institutions & Organizations"
        description="Working alongside leading institutions across Africa and globally to drive evidence-based policy change."
        breadcrumb={[{ label: 'Our Partners' }]}
      />

      {/* ================================================================== */}
      {/* PARTNER GRID */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="All Partners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge className="bg-[#f0fdf4] text-[#059669] border-[#065f46]/20 text-sm px-3 py-1 mb-4">
                Our Network
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Partner Organizations
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto">
                Our research is made possible through collaboration with leading institutions and organizations worldwide.
              </p>
            </div>
          </AnimatedSection>

          {/* Group by type */}
          {partnerTypes.map((type) => {
            const typePartners = partners.filter((p) => p.type === type);
            const TypeIcon = getPartnerIcon(type);

            return (
              <div key={type} className="mb-16 last:mb-0">
                <AnimatedSection>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-[#059669]" />
                    </div>
                    <h3
                      className="text-xl font-bold text-[#0f172a]"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {getTypeLabel(type)}
                    </h3>
                    <Badge variant="secondary" className="text-xs bg-[#f1f5f9] text-[#64748b]">
                      {typePartners.length}
                    </Badge>
                  </div>
                </AnimatedSection>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {typePartners.map((partner) => {
                    const Icon = getPartnerIcon(partner.type);
                    return (
                      <motion.div key={partner.id} variants={staggerItem}>
                        <Card className="group h-full border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                          <CardContent className="p-6">
                            {/* Icon & Type Badge */}
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0fdf4] group-hover:bg-[#065f46]/10 transition-colors">
                                <Icon className="h-7 w-7 text-[#059669]" />
                              </div>
                              <Badge variant="outline" className={getTypeColor(partner.type)}>
                                {getTypeLabel(partner.type)}
                              </Badge>
                            </div>

                            {/* Name */}
                            <h3
                              className="text-lg font-semibold text-[#0f172a] mb-2 group-hover:text-[#065f46] transition-colors"
                              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                            >
                              {partner.name}
                            </h3>

                            {/* Description */}
                            {partner.description && (
                              <p className="mb-4 text-sm text-[#64748b] leading-relaxed line-clamp-3">
                                {partner.description}
                              </p>
                            )}

                            {/* Meta: Country */}
                            {partner.country && (
                              <div className="flex items-center gap-1 text-sm text-[#64748b] mb-3">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{partner.country}</span>
                              </div>
                            )}

                            {/* Website */}
                            {partner.website && partner.website !== '#' && (
                              <div className="border-t border-[#f1f5f9] pt-3">
                                <a
                                  href={partner.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors"
                                >
                                  Visit Website
                                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
