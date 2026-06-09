import { getEventBySlug, getEvents } from '@/graphql/fetchers';
import EventDetailClient from '@/components/pages/EventDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    title: event?.title || 'Event Not Found',
    description: event?.excerpt || '',
  };
}

export async function generateStaticParams() {
  const { events } = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <a href="/events" className="mt-4 inline-block text-emerald-700 hover:underline">
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  const { events: allEvents } = await getEvents();
  const related = allEvents
    .filter((e) => e.id !== event.id)
    .slice(0, 4);

  return <EventDetailClient event={event} relatedEvents={related} />;
}
