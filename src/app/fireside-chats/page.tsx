import type { Metadata } from 'next';
import FiresideChatsPageClient from '@/components/pages/FiresideChatsPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getOutputDownloadables, isWordPressConnected } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Policy Fireside Chats - GTEEP',
  description:
    'Policy Fireside Chats — Intimate development conversations under our Policy Engagement programme. Join scholars, practitioners, and advocates for candid dialogue on Africa\'s most pressing policy challenges.',
  openGraph: {
    title: 'Policy Fireside Chats - GTEEP',
    description:
      'Intimate development conversations under our Policy Engagement programme.',
    type: 'website',
  },
};

export default async function FiresideChatsPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Fireside Chats" />;
  }

  // Fetch downloadables related to policy-firechat
  const downloadables = await getOutputDownloadables();
  const firechatOutputs = downloadables.filter(
    (d) => d.relatedSubActivity === 'policy-firechat'
  );

  return <FiresideChatsPageClient relatedOutputs={firechatOutputs} />;
}
