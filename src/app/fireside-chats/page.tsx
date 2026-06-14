import type { Metadata } from 'next';
import FiresideChatsPageClient from '@/components/pages/FiresideChatsPageClient';
import { getEvents } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Policy Fireside Chats - GTEEP',
  description:
    'Policy Fireside Chats — Intimate development conversations under our Policy Engagement programme. Join scholars, practitioners, and advocates for candid dialogue on Africa\'s most pressing policy challenges.',
  openGraph: {
    title: 'Policy Fireside Chats - GTEEP',
    description:
      'Intimate development conversations under our Policy Engagement programme.',
    type: 'website',
  },
};

export default async function FiresideChatsPage() {
  const { events } = await getEvents();
  // Filter to only fireside chat events
  const firesideEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes('fireside') ||
      e.slug.toLowerCase().includes('fireside') ||
      e.acfEventFields?.eventType === 'panel'
  );

  return <FiresideChatsPageClient firesideEvents={firesideEvents} />;
}
