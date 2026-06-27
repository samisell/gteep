import type { Metadata } from 'next';
import { Suspense } from 'react';
import OutputsPageClient from '@/components/pages/OutputsPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getOutputs, getOutputDownloadables, isWordPressConnected } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Outputs - GTEEP',
  description:
    "Browse GTEEP's research outputs including concept notes, policy briefs, data stocks, videos, photos, and knowledge products.",
};

export default async function OutputsPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Our Outputs" />;
  }

  const [outputs, downloadables] = await Promise.all([
    getOutputs(),
    getOutputDownloadables(),
  ]);

  // Merge downloadables into outputs (downloadables come from ACF, outputs from other sources)
  const allOutputs = [...downloadables, ...outputs];

  return (
    <Suspense>
      <OutputsPageClient
        outputs={allOutputs}
      />
    </Suspense>
  );
}
