import { getPartners } from '@/graphql/fetchers';
import PartnersPageClient from '@/components/pages/PartnersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partners - Prof. Bola Akanji',
  description:
    'Collaborating institutions and organizations that support Professor Bola Akanji\'s research on African trade and development.',
};

export default async function PartnersPage() {
  const partners = await getPartners();
  return <PartnersPageClient partners={partners} />;
}
