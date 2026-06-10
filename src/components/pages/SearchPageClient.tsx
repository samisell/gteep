'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search as SearchIcon,
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { getPublicationTypeLabel, getProjectStatusLabel, getEventTypeLabel, truncateText, stripHtml } from '@/utils';
import type { WPSearchData } from '@/types';

type SearchResultItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  extra?: string;
  href: string;
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setQuery(searchInput.trim());

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchInput.trim())}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const items: SearchResultItem[] = [];

        // Publications
        if (data.data.publications) {
          data.data.publications.forEach((p: any) => {
            items.push({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: stripHtml(p.excerpt || p.acfPublicationFields?.abstract || ''),
              type: 'Publication',
              extra: getPublicationTypeLabel(p.acfPublicationFields?.publicationType || ''),
              href: `/publications/${p.slug}`,
            });
          });
        }

        // Projects
        if (data.data.projects) {
          data.data.projects.forEach((p: any) => {
            items.push({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: stripHtml(p.excerpt || ''),
              type: 'Project',
              extra: getProjectStatusLabel(p.acfProjectFields?.projectStatus || ''),
              href: `/projects/${p.slug}`,
            });
          });
        }

        // Events
        if (data.data.events) {
          data.data.events.forEach((e: any) => {
            items.push({
              id: e.id,
              title: e.title,
              slug: e.slug,
              excerpt: stripHtml(e.excerpt || ''),
              type: 'Event',
              extra: getEventTypeLabel(e.acfEventFields?.eventType || ''),
              href: `/events/${e.slug}`,
            });
          });
        }

        // Pages
        if (data.data.pages) {
          data.data.pages.forEach((p: any) => {
            items.push({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: stripHtml(p.excerpt || ''),
              type: 'Page',
              href: `/${p.slug}`,
            });
          });
        }

        // Posts
        if (data.data.posts) {
          data.data.posts.forEach((p: any) => {
            items.push({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: stripHtml(p.excerpt || ''),
              type: 'News',
              href: `/media`,
            });
          });
        }

        setResults(items);
      }
    } catch {
      // In demo mode, show empty results
      setResults([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Publication': return BookOpen;
      case 'Project': return Briefcase;
      case 'Event': return Calendar;
      case 'Page': return FileText;
      case 'News': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Publication': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Project': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Event': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Page': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'News': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Group results by type
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResultItem[]>);

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Search"
        subtitle="Find Research, Projects & More"
        variant="compact"
      />

      <section className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search publications, projects, events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="h-12 bg-emerald-700 hover:bg-emerald-800"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-6 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {hasSearched && results.length === 0 && (
            <div className="py-10 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No results found</h3>
              <p className="mt-2 text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;. Try different search terms.
              </p>
            </div>
          )}

          {hasSearched && results.length > 0 && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>

              {Object.entries(grouped).map(([type, items]) => {
                const Icon = getTypeIcon(type);
                return (
                  <div key={type} className="mb-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <Icon className="h-5 w-5 text-emerald-600" />
                      {type}s ({items.length})
                    </h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-medium text-foreground">{item.title}</h3>
                              {item.excerpt && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                  {truncateText(item.excerpt, 150)}
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <Badge variant="outline" className={getTypeColor(type)}>
                                {item.extra || type}
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-emerald-600" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {!hasSearched && (
            <div className="py-10 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">Search the site</h3>
              <p className="mt-2 text-muted-foreground">
                Enter keywords to search across publications, projects, events, and more.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
