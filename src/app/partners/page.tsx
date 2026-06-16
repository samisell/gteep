import type { Metadata } from 'next';
import PartnersPageClient from '@/components/pages/PartnersPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getPartners, isWordPressConnected } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Partners - GTEEP',
  description:
    'GTEEP collaborates with leading universities, research institutes, governments, and international organizations across Africa and beyond.',
};

export default async function PartnersPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Our Partners" />;
  }

  const partners = await getPartners();
  return <PartnersPageClient partners={partners} />;
}
