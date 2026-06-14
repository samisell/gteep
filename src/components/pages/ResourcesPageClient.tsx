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
  Download,
  FileText,
  Database,
  Presentation,
  Wrench,
  BarChart3,
  ScrollText,
  Filter,
  ArrowRight,
} from 'lucide-react';
import type { WPResource } from '@/types';
import { getResourceTypeLabel } from '@/utils';
import DownloadLeadModal from '@/components/features/DownloadLeadModal';

interface ResourcesPageClientProps {
  resources: WPResource[];
}

export default function ResourcesPageClient({ resources }: ResourcesPageClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<WPResource | null>(null);

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    resources.forEach((r) => {
      if (r.acfResourceFields?.resourceType) typeSet.add(r.acfResourceFields.resourceType);
    });
    return Array.from(typeSet);
  }, [resources]);

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return resources;
    return resources.filter((r) => r.acfResourceFields?.resourceType === typeFilter);
  }, [resources, typeFilter]);

  const getResourceIcon = (type?: string) => {
    switch (type) {
      case 'dataset': return Database;
      case 'presentation': return Presentation;
      case 'report': return FileText;
      case 'tool': return Wrench;
      case 'infographic': return BarChart3;
      case 'policy-note': return ScrollText;
      default: return FileText;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'dataset': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'presentation': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'report': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'tool': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'infographic': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'policy-note': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownload = (resource: WPResource) => {
    if (resource.acfResourceFields?.isGated) {
      setSelectedResource(resource);
      setModalOpen(true);
    } else if (resource.acfResourceFields?.downloadUrl) {
      window.open(resource.acfResourceFields.downloadUrl, '_blank');
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Resources"
        subtitle="Research Data, Tools & Documents"
        description="Downloadable resources including datasets, presentations, policy notes, and research tools."
        breadcrumb={[{ label: 'Resources' }]}
      />

      {/* Filter */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getResourceTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => {
              const fields = resource.acfResourceFields;
              const Icon = getResourceIcon(fields?.resourceType);
              return (
                <StaggerItem key={resource.id}>
                  <Card className="group h-full border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Icon & Type */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                          <Icon className="h-6 w-6 text-emerald-700" />
                        </div>
                        <Badge variant="outline" className={getTypeColor(fields?.resourceType)}>
                          {getResourceTypeLabel(fields?.resourceType || '')}
                        </Badge>
                      </div>

                      {/* Title */}
                      <a href={`/resources/${resource.slug}`} className="group/title">
                        <h3 className="mb-2 text-base font-semibold text-foreground group-hover/title:text-emerald-700 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                      </a>

                      {/* Excerpt */}
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                        {resource.excerpt}
                      </p>

                      {/* File Info */}
                      <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {fields?.fileFormat && (
                          <span className="rounded bg-slate-100 px-2 py-1">{fields.fileFormat}</span>
                        )}
                        {fields?.fileSize && (
                          <span className="rounded bg-slate-100 px-2 py-1">{fields.fileSize}</span>
                        )}
                        {fields?.license && (
                          <span className="rounded bg-slate-100 px-2 py-1">{fields.license}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <a
                          href={`/resources/${resource.slug}`}
                          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                          View Details <ArrowRight className="ml-1 inline h-3 w-3" />
                        </a>
                        {fields?.downloadUrl && (
                          <Button
                            size="sm"
                            variant={fields.isGated ? 'default' : 'outline'}
                            className={
                              fields.isGated
                                ? 'bg-emerald-700 hover:bg-emerald-800'
                                : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            }
                            onClick={() => handleDownload(resource)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            {fields.isGated ? 'Get Access' : 'Download'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Download Lead Modal */}
      {selectedResource && (
        <DownloadLeadModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          resourceId={selectedResource.id}
          resourceTitle={selectedResource.title}
          resourceSlug={selectedResource.slug}
          downloadUrl={selectedResource.acfResourceFields?.downloadUrl}
        />
      )}
    </main>
  );
}
