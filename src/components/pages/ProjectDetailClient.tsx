'use client';

import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Globe,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
} from 'lucide-react';
import type { WPProject } from '@/types';
import { getProjectStatusLabel, formatDateRange, formatDate } from '@/utils';

interface ProjectDetailClientProps {
  project: WPProject;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const fields = project.acfProjectFields;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Timeline milestones based on status
  const timelineSteps = [
    { label: 'Project Initiated', date: fields?.startDate, done: true },
    { label: 'Research Phase', date: null, done: fields?.projectStatus === 'completed' || fields?.projectStatus === 'ongoing' },
    { label: 'Data Collection & Analysis', date: null, done: fields?.projectStatus === 'completed' || fields?.projectStatus === 'ongoing' },
    { label: 'Publications', date: null, done: !!fields?.publications },
    { label: 'Project Completed', date: fields?.endDate, done: fields?.projectStatus === 'completed' },
  ];

  return (
    <main className="min-h-screen">
      <PageHeader
        title={project.title}
        subtitle={fields ? getProjectStatusLabel(fields.projectStatus || '') : 'Project'}
        breadcrumb={[
          { label: 'Projects', href: '/projects' },
          { label: project.title },
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
              <a href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </a>
            </Button>
          </AnimatedSection>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                {/* Status & Description */}
                <Badge variant="outline" className={`mb-4 ${getStatusColor(fields?.projectStatus)}`}>
                  {getProjectStatusLabel(fields?.projectStatus || '')}
                </Badge>

                <div
                  className="prose prose-slate max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </AnimatedSection>

              {/* Key Highlights */}
              {fields?.highlights && (
                <AnimatedSection delay={0.1}>
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        Key Highlights & Milestones
                      </h2>
                      <p className="text-muted-foreground whitespace-pre-line">{fields.highlights}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              {/* Related Publications */}
              {fields?.publications && (
                <AnimatedSection delay={0.2}>
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <BookOpen className="h-5 w-5 text-amber-600" />
                        Related Publications
                      </h2>
                      <p className="text-muted-foreground">{fields.publications}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              {/* Status Timeline */}
              <AnimatedSection delay={0.3}>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Project Timeline
                    </h2>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                      <div className="space-y-6">
                        {timelineSteps.map((step, idx) => (
                          <div key={idx} className="relative flex items-start gap-4 pl-12">
                            <div
                              className={`absolute left-2 top-1 z-10 h-5 w-5 rounded-full border-2 ${
                                step.done
                                  ? 'border-emerald-600 bg-emerald-600'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {step.done && (
                                <CheckCircle2 className="h-3 w-3 text-white absolute top-0 left-0" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.label}
                              </p>
                              {step.date && (
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(step.date)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="sticky top-24 space-y-6">
                  {/* Project Details */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Project Details</h3>

                      {fields?.startDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">
                            {formatDateRange(fields.startDate, fields.endDate || '')}
                          </span>
                        </div>
                      )}

                      {fields?.fundingAgency && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Funder</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">{fields.fundingAgency}</span>
                        </div>
                      )}

                      {fields?.grantAmount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Grant</span>
                          <span className="text-sm font-medium text-emerald-700">{fields.grantAmount}</span>
                        </div>
                      )}

                      {fields?.principalInvestigator && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">PI</span>
                          <span className="text-sm font-medium text-right max-w-[60%]">{fields.principalInvestigator}</span>
                        </div>
                      )}

                      {fields?.coInvestigators && (
                        <div>
                          <span className="text-sm text-muted-foreground">Co-Investigators</span>
                          <p className="mt-1 text-sm font-medium">{fields.coInvestigators}</p>
                        </div>
                      )}

                      {fields?.partnerInstitutions && (
                        <div>
                          <span className="text-sm text-muted-foreground">Partner Institutions</span>
                          <p className="mt-1 text-sm font-medium">{fields.partnerInstitutions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800">
                    <a href="/publications">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Related Publications
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
