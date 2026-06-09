'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, ExternalLink, Download, Search, Filter, ArrowRight } from 'lucide-react';
import type { WPPublication } from '@/types';
import { getPublicationTypeLabel, truncateText, stripHtml } from '@/utils';

interface PublicationsPageClientProps {
  publications: WPPublication[];
}

const ITEMS_PER_PAGE = 9;

export default function PublicationsPageClient({ publications }: PublicationsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Extract unique years and types
  const years = useMemo(() => {
    const yearSet = new Set<string>();
    publications.forEach((p) => {
      if (p.acfPublicationFields?.year) yearSet.add(p.acfPublicationFields.year);
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [publications]);

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    publications.forEach((p) => {
      if (p.acfPublicationFields?.publicationType) typeSet.add(p.acfPublicationFields.publicationType);
    });
    return Array.from(typeSet);
  }, [publications]);

  // Filter publications
  const filtered = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        !searchTerm ||
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.acfPublicationFields?.authors?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pub.acfPublicationFields?.abstract?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        typeFilter === 'all' ||
        pub.acfPublicationFields?.publicationType === typeFilter;

      const matchesYear =
        yearFilter === 'all' ||
        pub.acfPublicationFields?.year === yearFilter;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [publications, searchTerm, typeFilter, yearFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'journal-article': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'book-chapter': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'working-paper': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'policy-brief': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'conference-paper': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'report': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Publications"
        subtitle="Academic Research & Policy Output"
        description="Browse the complete catalogue of academic publications, including journal articles, book chapters, working papers, and policy briefs."
        breadcrumb={[{ label: 'Publications' }]}
      />

      {/* Filter Bar */}
      <section className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {getPublicationTypeLabel(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={yearFilter}
                onValueChange={(val) => {
                  setYearFilter(val);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {visible.length} of {filtered.length} publication{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No publications found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((pub) => (
                <StaggerItem key={pub.id}>
                  <Card className="group h-full border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Type badge */}
                      <Badge
                        variant="outline"
                        className={`mb-3 ${getTypeColor(pub.acfPublicationFields?.publicationType)}`}
                      >
                        {getPublicationTypeLabel(pub.acfPublicationFields?.publicationType || '')}
                      </Badge>

                      {/* Title */}
                      <a href={`/publications/${pub.slug}`} className="group/title">
                        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground group-hover/title:text-emerald-700 transition-colors">
                          {pub.title}
                        </h3>
                      </a>

                      {/* Authors */}
                      {pub.acfPublicationFields?.authors && (
                        <p className="mb-2 text-sm text-muted-foreground">
                          {pub.acfPublicationFields.authors}
                        </p>
                      )}

                      {/* Journal & Year */}
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        {pub.acfPublicationFields?.journal && (
                          <span className="italic">{pub.acfPublicationFields.journal}</span>
                        )}
                        {pub.acfPublicationFields?.year && (
                          <>
                            {pub.acfPublicationFields.journal && <span>•</span>}
                            <span>{pub.acfPublicationFields.year}</span>
                          </>
                        )}
                      </div>

                      {/* Abstract snippet */}
                      {pub.acfPublicationFields?.abstract && (
                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                          {truncateText(pub.acfPublicationFields.abstract, 150)}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        {pub.acfPublicationFields?.citationCount !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            Cited by {pub.acfPublicationFields.citationCount}
                          </span>
                        )}
                        <a
                          href={`/publications/${pub.slug}`}
                          className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Load More Publications
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
