'use client';

import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';
import type { WPPost } from '@/types';
import { formatShortDate, truncateText, stripHtml } from '@/utils';

interface MediaPageClientProps {
  posts: WPPost[];
}

export default function MediaPageClient({ posts }: MediaPageClientProps) {
  return (
    <main className="min-h-screen">
      <PageHeader
        title="Media & Press"
        subtitle="News, Coverage & Commentary"
        description="Media coverage, commentary, and news featuring Prof. Akanji's research and policy engagement."
        breadcrumb={[{ label: 'Media & Press' }]}
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Card className="group h-full border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    {/* Image placeholder */}
                    {post.featuredImage ? (
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-slate-100">
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
                          <Newspaper className="h-8 w-8 text-emerald-300" />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                        <Newspaper className="h-4 w-4 text-emerald-700" />
                      </div>
                    )}

                    {/* Date */}
                    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatShortDate(post.date)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                      {truncateText(stripHtml(post.excerpt), 140)}
                    </p>

                    {/* Source / Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {post.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t pt-3">
                      {post.author && (
                        <span className="text-xs text-muted-foreground">{post.author.name}</span>
                      )}
                      <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 p-0 h-auto">
                        Read More
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
