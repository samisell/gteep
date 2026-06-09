'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import type { WPProject } from '@/types';
import { getProjectStatusLabel, formatDateRange, truncateText, stripHtml } from '@/utils';

interface ProjectsPageClientProps {
  projects: WPProject[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return projects;
    return projects.filter((p) => p.acfProjectFields?.projectStatus === statusFilter);
  }, [projects, statusFilter]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ongoing': return <Clock className="h-3 w-3" />;
      case 'completed': return <Briefcase className="h-3 w-3" />;
      case 'upcoming': return <Calendar className="h-3 w-3" />;
      default: return <Briefcase className="h-3 w-3" />;
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Research Projects"
        subtitle="Current & Past Research Programs"
        description="Current and past research projects spanning African trade policy, regional integration, and economic development."
        breadcrumb={[{ label: 'Projects' }]}
      />

      {/* Status Filter */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {filtered.map((project) => {
              const fields = project.acfProjectFields;
              return (
                <StaggerItem key={project.id}>
                  <Card className="group h-full border-0 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <Badge
                        variant="outline"
                        className={`mb-3 ${getStatusColor(fields?.projectStatus)}`}
                      >
                        <span className="mr-1">{getStatusIcon(fields?.projectStatus)}</span>
                        {getProjectStatusLabel(fields?.projectStatus || '')}
                      </Badge>

                      {/* Title */}
                      <a href={`/projects/${project.slug}`} className="group/title">
                        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover/title:text-emerald-700 transition-colors">
                          {project.title}
                        </h3>
                      </a>

                      {/* Excerpt */}
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                        {truncateText(stripHtml(project.content || project.excerpt), 160)}
                      </p>

                      {/* Project Meta */}
                      <div className="space-y-2 text-sm">
                        {fields?.startDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            <span>
                              {formatDateRange(fields.startDate, fields.endDate || '')}
                            </span>
                          </div>
                        )}
                        {fields?.fundingAgency && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            <span>{fields.fundingAgency}</span>
                          </div>
                        )}
                        {fields?.principalInvestigator && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>PI: {fields.principalInvestigator}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        {fields?.grantAmount && (
                          <span className="text-sm font-medium text-emerald-700">
                            {fields.grantAmount}
                          </span>
                        )}
                        <a
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </div>
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
