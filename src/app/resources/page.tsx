import { getResources, isWordPressConnected } from '@/graphql/fetchers';
import ResourcesPageClient from '@/components/pages/ResourcesPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Resources - Prof. Bola Akanji',
  description:
    "Download research datasets, presentations, policy notes, and tools from Professor Bola Akanji's work on African trade and development.",
};

export default async function ResourcesPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Resources" />;
  }

  const { resources } = await getResources();
  return <ResourcesPageClient resources={resources} />;
}
