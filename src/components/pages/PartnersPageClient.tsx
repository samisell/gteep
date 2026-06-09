'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  ExternalLink,
  MapPin,
  Calendar,
  Filter,
  Building2,
  GraduationCap,
  Landmark,
  Users,
  Briefcase,
  Heart,
} from 'lucide-react';
import type { WPPartner } from '@/types';

interface PartnersPageClientProps {
  partners: WPPartner[];
}

export default function PartnersPageClient({ partners }: PartnersPageClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    partners.forEach((p) => {
      if (p.acfPartnerFields?.partnerType) typeSet.add(p.acfPartnerFields.partnerType);
    });
    return Array.from(typeSet);
  }, [partners]);

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return partners;
    return partners.filter((p) => p.acfPartnerFields?.partnerType === typeFilter);
  }, [partners, typeFilter]);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'university': return GraduationCap;
      case 'research-institute': return Building2;
      case 'government': return Landmark;
      case 'ngo': return Heart;
      case 'international-organization': return Globe;
      case 'private-sector': return Briefcase;
      default: return Users;
    }
  };

  const getTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'university': 'University',
      'research-institute': 'Research Institute',
      'government': 'Government',
      'ngo': 'NGO',
      'international-organization': 'International Organization',
      'private-sector': 'Private Sector',
    };
    return labels[type || ''] || type || 'Partner';
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'university': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'research-institute': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'government': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ngo': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'international-organization': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'private-sector': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Partners"
        subtitle="Collaborating Institutions & Organizations"
        description="Our research is made possible through collaboration with leading institutions and organizations worldwide."
        breadcrumb={[{ label: 'Partners' }]}
      />

      {/* Filter */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[220px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Partner Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filtered.length} partner{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((partner) => {
              const fields = partner.acfPartnerFields;
              const Icon = getTypeIcon(fields?.partnerType);
              return (
                <StaggerItem key={partner.id}>
                  <Card className="group h-full border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Logo placeholder & Type */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
                          <Icon className="h-7 w-7 text-emerald-700" />
                        </div>
                        <Badge variant="outline" className={getTypeColor(fields?.partnerType)}>
                          {getTypeLabel(fields?.partnerType)}
                        </Badge>
                      </div>

                      {/* Name */}
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {partner.title}
                      </h3>

                      {/* Description */}
                      {fields?.description && (
                        <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                          {fields.description}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {fields?.country && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{fields.country}</span>
                          </div>
                        )}
                        {fields?.partnershipSince && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Partner since {fields.partnershipSince}</span>
                          </div>
                        )}
                      </div>

                      {/* Website */}
                      {fields?.website && (
                        <div className="mt-4 border-t pt-3">
                          <a
                            href={fields.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                          >
                            Visit Website
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
