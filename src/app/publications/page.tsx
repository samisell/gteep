import { getPublications, isWordPressConnected } from '@/graphql/fetchers';
import PublicationsPageClient from '@/components/pages/PublicationsPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Publications - Prof. Bola Akanji',
  description:
    'Academic publications by Professor Bola Akanji, including journal articles, book chapters, working papers, and policy briefs on African trade and development.',
};

export default async function PublicationsPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Publications" />;
  }

  const { publications } = await getPublications();
  return <PublicationsPageClient publications={publications} />;
}
