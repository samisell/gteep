'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Download,
  FileText,
  Database,
  Presentation,
  Wrench,
  BarChart3,
  ScrollText,
  ExternalLink,
} from 'lucide-react';
import type { WPResource } from '@/types';
import { getResourceTypeLabel, formatDate } from '@/utils';
import DownloadLeadModal from '@/components/features/DownloadLeadModal';

interface ResourceDetailClientProps {
  resource: WPResource;
  relatedResources?: WPResource[];
}

export default function ResourceDetailClient({
  resource,
  relatedResources = [],
}: ResourceDetailClientProps) {
  const fields = resource.acfResourceFields;
  const [modalOpen, setModalOpen] = useState(false);

  const resourceType = fields?.resourceType;
  const isGated = fields?.isGated;

  const getIconElement = (type?: string) => {
    switch (type) {
      case 'dataset': return <Database className="h-8 w-8 text-emerald-700" />;
      case 'presentation': return <Presentation className="h-8 w-8 text-emerald-700" />;
      case 'report': return <FileText className="h-8 w-8 text-emerald-700" />;
      case 'tool': return <Wrench className="h-8 w-8 text-emerald-700" />;
      case 'infographic': return <BarChart3 className="h-8 w-8 text-emerald-700" />;
      case 'policy-note': return <ScrollText className="h-8 w-8 text-emerald-700" />;
      default: return <FileText className="h-8 w-8 text-emerald-700" />;
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title={resource.title}
        subtitle={fields ? getResourceTypeLabel(fields.resourceType || '') : 'Resource'}
        breadcrumb={[
          { label: 'Resources', href: '/resources' },
          { label: resource.title },
        ]}
        variant="compact"
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Button
              variant="ghost"
              asChild
              className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
            >
              <a href="/resources">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
              </a>
            </Button>
          </AnimatedSection>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50">
                    {getIconElement(resourceType)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{resource.title}</h1>
                    <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                      {getResourceTypeLabel(fields?.resourceType || '')}
                    </Badge>
                  </div>
                </div>

                <div
                  className="prose prose-slate max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="sticky top-24 space-y-6">
                  {/* File Info */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">File Information</h3>

                      {fields?.fileFormat && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Format</span>
                          <span className="text-sm font-medium">{fields.fileFormat}</span>
                        </div>
                      )}

                      {fields?.fileSize && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Size</span>
                          <span className="text-sm font-medium">{fields.fileSize}</span>
                        </div>
                      )}

                      {fields?.version && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Version</span>
                          <span className="text-sm font-medium">{fields.version}</span>
                        </div>
                      )}

                      {fields?.license && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">License</span>
                          <span className="text-sm font-medium">{fields.license}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Published</span>
                        <span className="text-sm font-medium">{formatDate(resource.date)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Button */}
                  {fields?.downloadUrl && (
                    <Button
                      className="w-full bg-emerald-700 hover:bg-emerald-800"
                      size="lg"
                      onClick={() => {
                        if (isGated) {
                          setModalOpen(true);
                        } else {
                          window.open(fields.downloadUrl, '_blank');
                        }
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isGated ? 'Request Download Access' : 'Download Resource'}
                    </Button>
                  )}

                  {fields?.externalUrl && (
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a href={fields.externalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View External Resource
                      </a>
                    </Button>
                  )}

                  {/* Related Resources */}
                  {relatedResources.length > 0 && (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Related Resources</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {relatedResources.slice(0, 4).map((rel) => (
                            <a
                              key={rel.id}
                              href={`/resources/${rel.slug}`}
                              className="block rounded-lg p-3 transition-colors hover:bg-emerald-50"
                            >
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {rel.title}
                              </p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {getResourceTypeLabel(rel.acfResourceFields?.resourceType || '')}
                              </Badge>
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

      {/* Download Lead Modal */}
      <DownloadLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        resourceId={resource.id}
        resourceTitle={resource.title}
        downloadUrl={fields?.downloadUrl}
      />
    </main>
  );
}
