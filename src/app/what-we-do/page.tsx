import type { Metadata } from 'next';
import WhatWeDoPageClient from '@/components/pages/WhatWeDoPageClient';
import { mockActivities } from '@/graphql/mock-data';

export const metadata: Metadata = {
  title: 'What We Do - GTEEP',
  description:
    'Explore GTEEP\'s core activities: policy research, policy engagement, citizen enlightenment, Data Speaks, youth mentoring, and women\'s economic livelihood.',
};

export default function WhatWeDoPage() {
  return <WhatWeDoPageClient activities={mockActivities} />;
}
