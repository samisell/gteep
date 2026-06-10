'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Clock,
  Video,
  ExternalLink,
  ArrowRight,
  Users,
} from 'lucide-react';
import type { WPEvent } from '@/types';
import { getEventTypeLabel, formatDateRange, formatShortDate } from '@/utils';

interface EventsPageClientProps {
  events: WPEvent[];
}

export default function EventsPageClient({ events }: EventsPageClientProps) {
  const [tab, setTab] = useState<string>('upcoming');

  const now = new Date().toISOString().split('T')[0];

  const { upcoming, past } = useMemo(() => {
    const up: WPEvent[] = [];
    const pa: WPEvent[] = [];
    events.forEach((e) => {
      const start = e.acfEventFields?.eventStartDate || e.date;
      if (start >= now) {
        up.push(e);
      } else {
        pa.push(e);
      }
    });
    return { upcoming: up, past: pa };
  }, [events, now]);

  const displayed = tab === 'upcoming' ? upcoming : past;

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'conference': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'workshop': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'seminar': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lecture': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'panel': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'webinar': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Events"
        subtitle="Conferences, Workshops & Lectures"
        description="Upcoming and past events including conferences, workshops, seminars, and public lectures."
        breadcrumb={[{ label: 'Events' }]}
      />

      {/* Tabs */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {displayed.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">
                No {tab} events
              </h3>
              <p className="mt-2 text-muted-foreground">
                Check back later for new events.
              </p>
            </div>
          ) : (
            <StaggerContainer className="space-y-6">
              {displayed.map((event) => {
                const fields = event.acfEventFields;
                return (
                  <StaggerItem key={event.id}>
                    <Card className="group border-0 shadow-md transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                          {/* Date Block */}
                          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-center">
                            {fields?.eventStartDate && (
                              <>
                                <span className="text-xs font-medium text-emerald-600 uppercase">
                                  {new Date(fields.eventStartDate).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-2xl font-bold text-emerald-800">
                                  {new Date(fields.eventStartDate).getDate()}
                                </span>
                                <span className="text-xs text-emerald-600">
                                  {new Date(fields.eventStartDate).getFullYear()}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={getEventTypeColor(fields?.eventType)}>
                                {getEventTypeLabel(fields?.eventType || '')}
                              </Badge>
                              {fields?.isVirtual && (
                                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                                  <Video className="mr-1 h-3 w-3" />
                                  Virtual
                                </Badge>
                              )}
                            </div>

                            <a href={`/events/${event.slug}`} className="group/title">
                              <h3 className="text-lg font-semibold text-foreground group-hover/title:text-emerald-700 transition-colors">
                                {event.title}
                              </h3>
                            </a>

                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {event.excerpt}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {fields?.eventStartDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-emerald-600" />
                                  <span>{formatDateRange(fields.eventStartDate, fields.eventEndDate || '')}</span>
                                </div>
                              )}
                              {fields?.eventTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                  <span>{fields.eventTime}</span>
                                </div>
                              )}
                              {fields?.venue && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-emerald-600" />
                                  <span>{fields.venue}{fields.city ? `, ${fields.city}` : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 flex-col gap-2 md:items-end">
                            <a href={`/events/${event.slug}`}>
                              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                View Details
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </a>
                            {fields?.registrationUrl && (
                              <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                                <a href={fields.registrationUrl} target="_blank" rel="noopener noreferrer">
                                  Register
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>
    </main>
  );
}
