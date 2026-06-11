import { getResources } from '@/graphql/fetchers';
import ResourcesPageClient from '@/components/pages/ResourcesPageClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Resources - Prof. Bola Akanji',
  description:
    "Download research datasets, presentations, policy notes, and tools from Professor Bola Akanji's work on African trade and development.",
};

export default async function ResourcesPage() {
  const { resources } = await getResources();
  return <ResourcesPageClient resources={resources} />;
}
