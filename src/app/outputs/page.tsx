import type { Metadata } from 'next';
import { Suspense } from 'react';
import OutputsPageClient from '@/components/pages/OutputsPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getOutputs, getOutputDownloadables, getFollowTheMoneyOutputs, isWordPressConnected } from '@/graphql/fetchers';

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

  const [outputs, downloadables, followTheMoneyOutputs] = await Promise.all([
    getOutputs(),
    getOutputDownloadables(),
    getFollowTheMoneyOutputs(),
  ]);

  // Merge downloadables + Follow the Money event files into outputs.
  // The Follow the Money files ALSO remain on the Fireside Chat page — they are
  // not removed from there; this is an additive listing for discoverability.
  const allOutputs = [...downloadables, ...followTheMoneyOutputs, ...outputs];

  return (
    <Suspense>
      <OutputsPageClient
        outputs={allOutputs}
      />
    </Suspense>
  );
}
