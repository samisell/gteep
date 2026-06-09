'use client';

import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Video,
  ExternalLink,
  Users,
  Globe,
} from 'lucide-react';
import type { WPEvent } from '@/types';
import { getEventTypeLabel, formatDateRange, formatDate } from '@/utils';

interface EventDetailClientProps {
  event: WPEvent;
  relatedEvents?: WPEvent[];
}

export default function EventDetailClient({ event, relatedEvents = [] }: EventDetailClientProps) {
  const fields = event.acfEventFields;

  return (
    <main className="min-h-screen">
      <PageHeader
        title={event.title}
        subtitle={fields ? getEventTypeLabel(fields.eventType || '') : 'Event'}
        breadcrumb={[
          { label: 'Events', href: '/events' },
          { label: event.title },
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
              <a href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </a>
            </Button>
          </AnimatedSection>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                {/* Badges */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {fields?.isVirtual && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      <Video className="mr-1 h-3 w-3" />
                      Virtual Event
                    </Badge>
                  )}
                </div>

                <div
                  className="prose prose-slate max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="sticky top-24 space-y-6">
                  {/* Event Details Card */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Event Details</h3>

                      {fields?.eventStartDate && (
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium">
                              {formatDateRange(fields.eventStartDate, fields.eventEndDate || '')}
                            </p>
                          </div>
                        </div>
                      )}

                      {fields?.eventTime && (
                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                          <p className="text-sm font-medium">{fields.eventTime}</p>
                        </div>
                      )}

                      {fields?.venue && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium">{fields.venue}</p>
                            {fields.city && (
                              <p className="text-sm text-muted-foreground">
                                {fields.city}{fields.country ? `, ${fields.country}` : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {fields?.organizer && (
                        <div className="flex items-start gap-3">
                          <Users className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                          <p className="text-sm font-medium">{fields.organizer}</p>
                        </div>
                      )}

                      {fields?.eventType && (
                        <div className="flex items-start gap-3">
                          <Globe className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                          <p className="text-sm font-medium">
                            {getEventTypeLabel(fields.eventType)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Registration */}
                  {fields?.registrationUrl && (
                    <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800" size="lg">
                      <a href={fields.registrationUrl} target="_blank" rel="noopener noreferrer">
                        Register Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {/* Related Events */}
                  {relatedEvents.length > 0 && (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Related Events</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {relatedEvents.slice(0, 4).map((rel) => (
                            <a
                              key={rel.id}
                              href={`/events/${rel.slug}`}
                              className="block rounded-lg p-3 transition-colors hover:bg-emerald-50"
                            >
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {rel.title}
                              </p>
                              {rel.acfEventFields?.eventStartDate && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatDate(rel.acfEventFields.eventStartDate)}
                                </p>
                              )}
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
