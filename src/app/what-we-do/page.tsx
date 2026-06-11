import type { Metadata } from 'next';
import WhatWeDoPageClient from '@/components/pages/WhatWeDoPageClient';
import { getActivities } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'What We Do - GTEEP',
  description:
    'Explore GTEEP\'s core activities: policy research, policy engagement, citizen enlightenment, Data Speaks, youth mentoring, and women\'s economic livelihood.',
};

export default async function WhatWeDoPage() {
  const activities = await getActivities();
  return <WhatWeDoPageClient activities={activities} />;
}
