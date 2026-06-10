import type { Metadata } from 'next';
import OutputsPageClient from '@/components/pages/OutputsPageClient';
import { getOutputs } from '@/graphql/fetchers';

export const metadata: Metadata = {
  title: 'Our Outputs - GTEEP',
  description:
    "Browse GTEEP's research outputs including concept notes, policy briefs, data stocks, videos, photos, and knowledge products.",
};

export default async function OutputsPage() {
  const outputs = await getOutputs();

  return (
    <OutputsPageClient
      outputs={outputs}
    />
  );
}
