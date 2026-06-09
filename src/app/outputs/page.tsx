import type { Metadata } from 'next';
import OutputsPageClient from '@/components/pages/OutputsPageClient';
import { mockOutputs } from '@/graphql/mock-data';

export const metadata: Metadata = {
  title: 'Our Outputs - GTEEP',
  description:
    'Browse GTEEP\'s research outputs including concept notes, policy briefs, data stocks, videos, photos, and knowledge products.',
};

export default function OutputsPage() {
  return <OutputsPageClient outputs={mockOutputs} />;
}
