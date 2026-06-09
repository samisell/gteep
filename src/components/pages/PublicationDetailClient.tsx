'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  BookOpen,
  Quote,
  FileText,
  Calendar,
  Users,
  Hash,
} from 'lucide-react';
import type { WPPublication } from '@/types';
import { getPublicationTypeLabel, formatDate } from '@/utils';

interface PublicationDetailClientProps {
  publication: WPPublication;
  relatedPublications?: WPPublication[];
}

export default function PublicationDetailClient({
  publication,
  relatedPublications = [],
}: PublicationDetailClientProps) {
  const fields = publication.acfPublicationFields;

  const citation = fields
    ? `${fields.authors || ''} (${fields.year || 'n.d.'}). "${publication.title}." ${fields.journal ? fields.journal + ', ' : ''}${fields.volume ? 'Vol. ' + fields.volume + ', ' : ''}${fields.issue ? 'No. ' + fields.issue + ', ' : ''}${fields.pages ? 'pp. ' + fields.pages + '.' : '.'}${fields.doi ? ' DOI: ' + fields.doi : ''}`
    : publication.title;

  return (
    <main className="min-h-screen">
      <PageHeader
        title={publication.title}
        subtitle={fields ? getPublicationTypeLabel(fields.publicationType || '') : 'Publication'}
        breadcrumb={[
          { label: 'Publications', href: '/publications' },
          { label: publication.title },
        ]}
        variant="compact"
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <Button
                  variant="ghost"
                  asChild
                  className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
                >
                  <a href="/publications">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Publications
                  </a>
                </Button>

                {/* Title & Type */}
                <div className="mb-6">
                  {fields?.isFeatured && (
                    <Badge className="mb-3 bg-amber-100 text-amber-800 border-amber-200">
                      Featured Publication
                    </Badge>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {publication.title}
                  </h1>
                </div>

                {/* Authors */}
                {fields?.authors && (
                  <div className="mb-6 flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{fields.authors}</span>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Abstract */}
                {fields?.abstract && (
                  <div className="mb-8">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Abstract
                    </h2>
                    <p className="leading-relaxed text-muted-foreground">{fields.abstract}</p>
                  </div>
                )}

                {/* Full Content */}
                {publication.content && (
                  <div className="mb-8">
                    <h2 className="mb-3 text-lg font-semibold text-foreground">Full Description</h2>
                    <div
                      className="prose prose-slate max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: publication.content }}
                    />
                  </div>
                )}

                {/* Keywords */}
                {fields?.keywords && (
                  <div className="mb-8">
                    <h2 className="mb-3 text-lg font-semibold text-foreground">Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                      {fields.keywords.split(',').map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-emerald-700 border-emerald-200">
                          {kw.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citation */}
                <AnimatedSection delay={0.2}>
                  <Card className="border-0 bg-slate-50 shadow-sm dark:bg-slate-900/50">
                    <CardContent className="p-6">
                      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Quote className="h-5 w-5 text-amber-600" />
                        Cite This Publication
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        {citation}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="sticky top-24 space-y-6">
                  {/* Publication Metadata */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Publication Details</h3>

                      {fields?.publicationType && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                            {getPublicationTypeLabel(fields.publicationType)}
                          </Badge>
                        </div>
                      )}

                      {fields?.year && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Year</span>
                          <span className="text-sm font-medium">{fields.year}</span>
                        </div>
                      )}

                      {fields?.journal && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Journal</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">{fields.journal}</span>
                        </div>
                      )}

                      {fields?.volume && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Volume</span>
                          <span className="text-sm font-medium">{fields.volume}</span>
                        </div>
                      )}

                      {fields?.issue && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Issue</span>
                          <span className="text-sm font-medium">{fields.issue}</span>
                        </div>
                      )}

                      {fields?.pages && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Pages</span>
                          <span className="text-sm font-medium">{fields.pages}</span>
                        </div>
                      )}

                      {fields?.publisher && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Publisher</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">{fields.publisher}</span>
                        </div>
                      )}

                      {fields?.doi && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">DOI</span>
                          <a
                            href={fields.externalUrl || `https://doi.org/${fields.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-emerald-700 hover:underline break-all"
                          >
                            {fields.doi}
                          </a>
                        </div>
                      )}

                      {fields?.citationCount !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Citations</span>
                          <span className="text-sm font-medium">{fields.citationCount}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {fields?.downloadUrl && (
                      <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800">
                        <a href={fields.downloadUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    {fields?.externalUrl && (
                      <Button asChild variant="outline" className="w-full">
                        <a href={fields.externalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on Publisher Site
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Related Publications */}
                  {relatedPublications.length > 0 && (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Related Publications</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {relatedPublications.slice(0, 5).map((rel) => (
                            <a
                              key={rel.id}
                              href={`/publications/${rel.slug}`}
                              className="block rounded-lg p-3 transition-colors hover:bg-emerald-50"
                            >
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {rel.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {rel.acfPublicationFields?.authors} ({rel.acfPublicationFields?.year})
                              </p>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
