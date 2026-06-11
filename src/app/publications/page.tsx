import { getPublications } from '@/graphql/fetchers';
import PublicationsPageClient from '@/components/pages/PublicationsPageClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Publications - Prof. Bola Akanji',
  description:
    'Academic publications by Professor Bola Akanji, including journal articles, book chapters, working papers, and policy briefs on African trade and development.',
};

export default async function PublicationsPage() {
  const { publications } = await getPublications();
  return <PublicationsPageClient publications={publications} />;
}
