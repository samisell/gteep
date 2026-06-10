'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  ArrowRight,
  Calendar,
  User,
} from 'lucide-react';
import Link from 'next/link';
import type { GTEEPBlogPost } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface BlogPageClientProps {
  posts: GTEEPBlogPost[];
}

// =============================================================================
// Helpers
// =============================================================================

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case 'trade policy':
    case 'afcfta':
      return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    case 'gender & trade':
    case 'policy':
      return 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20';
    case 'data speaks':
      return 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]/20';
    case 'youth mentoring':
    case 'capacity building':
      return 'bg-[#f0fdfa] text-[#0d9488] border-[#0d9488]/20';
    default:
      return 'bg-[#f1f5f9] text-[#64748b] border-[#64748b]/20';
  }
}

function getGradientForCategory(categories: string[]) {
  if (categories.some((c) => c.toLowerCase().includes('afcfta') || c.toLowerCase().includes('trade'))) {
    return 'from-[#065f46] to-[#047857]';
  }
  if (categories.some((c) => c.toLowerCase().includes('gender'))) {
    return 'from-[#d97706] to-[#b45309]';
  }
  if (categories.some((c) => c.toLowerCase().includes('data'))) {
    return 'from-[#1d4ed8] to-[#1e40af]';
  }
  if (categories.some((c) => c.toLowerCase().includes('youth') || c.toLowerCase().includes('capacity'))) {
    return 'from-[#0d9488] to-[#0f766e]';
  }
  return 'from-[#065f46] to-[#0f172a]';
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

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="Our Blog"
        subtitle="Insights & Analysis"
        description="Analysis, commentary, and insights on African trade policy, economic development, and social inclusion."
        breadcrumb={[{ label: 'Our Blog' }]}
      />

      {/* ================================================================== */}
      {/* BLOG POST GRID */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="Blog Posts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={staggerItem}>
                <Card className="group h-full overflow-hidden border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Image gradient area */}
                  <div className={`h-48 bg-gradient-to-br ${getGradientForCategory(post.categories)} relative flex items-center justify-center`}>
                    <div className="text-center text-white/80">
                      <BookOpen className="w-14 h-14 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-medium">GTEEP Insights</p>
                    </div>
                    {/* Category badge */}
                    {post.categories.length > 0 && (
                      <Badge className={`absolute top-4 left-4 ${getCategoryColor(post.categories[0])} text-xs backdrop-blur-sm`}>
                        {post.categories[0]}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-[#94a3b8] mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

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
                      <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <Button
                        variant="link"
                        className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
                      >
                        Read More
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Extra category badges */}
                    {post.categories.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.categories.slice(1).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-[10px] bg-[#f1f5f9] text-[#64748b] px-1.5 py-0">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <AnimatedSection>
            <div className="mt-16 text-center">
              <div className="rounded-2xl bg-gradient-to-r from-[#065f46] to-[#0f172a] p-8 md:p-12 relative overflow-hidden">
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
                    Stay Updated with GTEEP
                  </h2>
                  <p className="mt-3 text-emerald-100 max-w-2xl mx-auto">
                    Follow our latest research, policy insights, and development news.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
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
                        Get in Touch
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
