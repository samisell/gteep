'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  FileText,
  BarChart3,
  Database,
  Video,
  Camera,
  BookOpen,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { GTEEPOutput } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface OutputsPageClientProps {
  outputs: GTEEPOutput[];
}

// =============================================================================
// Helpers
// =============================================================================

function getOutputTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'concept-note': 'Concept Note',
    'policy-brief': 'Policy Brief',
    'data-stock': 'Data Stock',
    'video': 'Video Gallery',
    'photo': 'Photo Gallery',
    'knowledge-product': 'Knowledge Product',
  };
  return labels[type] || 'Output';
}

function getOutputTypeIcon(type: string) {
  const iconMap: Record<string, React.ElementType> = {
    'concept-note': FileText,
    'policy-brief': FileText,
    'data-stock': Database,
    'video': Video,
    'photo': Camera,
    'knowledge-product': BookOpen,
  };
  return iconMap[type] || FileText;
}

function getOutputTypeBadgeColor(type: string) {
  switch (type) {
    case 'concept-note': return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    case 'policy-brief': return 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20';
    case 'data-stock': return 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]/20';
    case 'video': return 'bg-[#faf5ff] text-[#7c3aed] border-[#7c3aed]/20';
    case 'photo': return 'bg-[#fff1f2] text-[#e11d48] border-[#e11d48]/20';
    case 'knowledge-product': return 'bg-[#f0fdfa] text-[#0d9488] border-[#0d9488]/20';
    default: return 'bg-[#f1f5f9] text-[#64748b] border-[#64748b]/20';
  }
}

function getOutputTypeBgGradient(type: string) {
  switch (type) {
    case 'concept-note': return 'from-[#065f46] to-[#047857]';
    case 'policy-brief': return 'from-[#d97706] to-[#b45309]';
    case 'data-stock': return 'from-[#1d4ed8] to-[#1e40af]';
    case 'video': return 'from-[#7c3aed] to-[#6d28d9]';
    case 'photo': return 'from-[#e11d48] to-[#be123c]';
    case 'knowledge-product': return 'from-[#0d9488] to-[#0f766e]';
    default: return 'from-[#065f46] to-[#0f172a]';
  }
}

const tabDefs = [
  { value: 'all', label: 'All' },
  { value: 'concept-note', label: 'Concept Notes' },
  { value: 'policy-brief', label: 'Policy Briefs' },
  { value: 'data-stock', label: 'Data Stock' },
  { value: 'video', label: 'Video Gallery' },
  { value: 'photo', label: 'Photo Gallery' },
  { value: 'knowledge-product', label: 'Knowledge Products' },
];

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
// Output Card Component
// =============================================================================

function OutputCard({ output }: { output: GTEEPOutput }) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="group h-full overflow-hidden border border-[#e2e8f0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image / Gradient area */}
        <div className={`h-40 bg-gradient-to-br ${getOutputTypeBgGradient(output.type)} relative flex items-center justify-center`}>
          <div className="text-center text-white/80">
            {React.createElement(getOutputTypeIcon(output.type), { className: 'w-12 h-12 mx-auto mb-2 opacity-50' })}
            <p className="text-sm font-medium">{getOutputTypeLabel(output.type)}</p>
          </div>
          {/* Type badge overlay */}
          <Badge className={`absolute top-4 left-4 ${getOutputTypeBadgeColor(output.type)} text-xs`}>
            {getOutputTypeLabel(output.type)}
          </Badge>
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          {/* Title */}
          <h3
            className="text-base font-semibold text-[#0f172a] mb-2 leading-snug line-clamp-2 group-hover:text-[#065f46] transition-colors"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {output.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-3 flex-grow">
            {output.excerpt}
          </p>

          {/* Date & Action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
              <Calendar className="w-3 h-3" />
              {output.date && (
                <span>
                  {new Date(output.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
            {output.downloadUrl ? (
              <Button
                variant="link"
                className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Read More
              </Button>
            ) : output.externalUrl ? (
              <Button
                variant="link"
                className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Read More
              </Button>
            ) : (
              <Button
                variant="link"
                className="text-[#059669] hover:text-[#047857] p-0 h-auto text-sm group/link"
              >
                Read More
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {/* Tags */}
          {output.tags && output.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {output.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] bg-[#f1f5f9] text-[#64748b] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function OutputsPageClient({ outputs }: OutputsPageClientProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOutputs = useMemo(() => {
    if (activeTab === 'all') return outputs;
    return outputs.filter((o) => o.type === activeTab);
  }, [outputs, activeTab]);

  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="Our Outputs"
        subtitle="Research & Knowledge Products"
        description="Browse our comprehensive collection of research outputs, policy briefs, data resources, and knowledge products."
        breadcrumb={[{ label: 'Our Outputs' }]}
      />

      {/* ================================================================== */}
      {/* TAB-BASED OUTPUT LISTING */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 bg-white" aria-label="Outputs Listing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="mb-10 overflow-x-auto">
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-[#f1f5f9] p-1.5 rounded-xl">
                {tabDefs.map((tab) => {
                  const count = tab.value === 'all'
                    ? outputs.length
                    : outputs.filter((o) => o.type === tab.value).length;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {tab.label}
                      <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content - all use the same rendering, just filtered */}
            {tabDefs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {filteredOutputs.length === 0 ? (
                  <div className="text-center py-16">
                    <BarChart3 className="w-16 h-16 mx-auto text-[#cbd5e1] mb-4" />
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No outputs found</h3>
                    <p className="text-sm text-[#64748b]">
                      There are no outputs in this category yet. Check back soon.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key={activeTab}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredOutputs.map((output) => (
                      <OutputCard key={output.id} output={output} />
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </main>
  );
}
