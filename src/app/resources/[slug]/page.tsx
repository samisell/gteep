import { getResourceBySlug, getResources } from '@/graphql/fetchers';
import ResourceDetailClient from '@/components/pages/ResourceDetailClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  return {
    title: resource?.title || 'Resource Not Found',
    description: resource?.excerpt || '',
  };
}

export async function generateStaticParams() {
  const { resources } = await getResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Resource Not Found</h1>
          <a href="/resources" className="mt-4 inline-block text-emerald-700 hover:underline">
            Back to Resources
          </a>
        </div>
      </div>
    );
  }

  const { resources: allResources } = await getResources();
  const related = allResources
    .filter((r) => r.id !== resource.id)
    .slice(0, 4);

  return <ResourceDetailClient resource={resource} relatedResources={related} />;
}
