import { getEvents } from '@/graphql/fetchers';
import EventsPageClient from '@/components/pages/EventsPageClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Events - Prof. Bola Akanji',
  description:
    'Conferences, workshops, seminars, and public lectures featuring Professor Bola Akanji.',
};

export default async function EventsPage() {
  const { events } = await getEvents();
  return <EventsPageClient events={events} />;
}
