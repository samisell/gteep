import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ActivityDetailClient from '@/components/pages/ActivityDetailClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getActivityPage, getActivities, getOutputDownloadables, isWordPressConnected } from '@/graphql/fetchers';

export const revalidate = 300;

// Generate static params from WordPress child pages and their nested children
export async function generateStaticParams() {
  try {
    const activities = await getActivities();
    const params: { slug: string[] }[] = [];

    for (const activity of activities) {
      // Single-level: /what-we-do/policy-research
      params.push({ slug: [activity.slug] });

      // Nested: /what-we-do/policy-engagement/policy-firechat
      if (activity.children) {
        for (const child of activity.children) {
          params.push({ slug: [activity.slug, child.slug] });
        }
      }
    }

    return params;
  } catch {
    return [];
  }
}

// Generate metadata for each activity page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const data = await getActivityPage(slugPath);

  if (!data) {
    return {
      title: 'Activity Not Found - GTEEP',
    };
  }

  return {
    title: `${data.activity.title} - GTEEP`,
    description: `Learn about GTEEP's ${data.activity.title} programme and how we drive evidence-based policy change across Africa.`,
    openGraph: {
      title: `${data.activity.title} - GTEEP`,
      description: `GTEEP's ${data.activity.title} programme`,
      type: 'website',
    },
  };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Activity" />;
  }

  const [data, downloadables] = await Promise.all([
    getActivityPage(slugPath),
    getOutputDownloadables(),
  ]);

  if (!data) {
    notFound();
  }

  // Filter downloadables related to this activity
  const relatedOutputs = downloadables.filter(
    (d) => d.relatedActivity === data.activity.slug ||
      d.relatedSubActivity === data.activity.slug ||
      (data.activity.children && data.activity.children.some(c => d.relatedSubActivity === c.slug))
  );

  return (
    <ActivityDetailClient
      activity={data.activity}
      parentPage={data.parentPage}
      relatedOutputs={relatedOutputs}
    />
  );
}
