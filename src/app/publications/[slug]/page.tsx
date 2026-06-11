import { getPublicationBySlug, getPublications } from '@/graphql/fetchers';
import PublicationDetailClient from '@/components/pages/PublicationDetailClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  return {
    title: publication?.title || 'Publication Not Found',
    description: publication?.acfPublicationFields?.abstract || publication?.excerpt || '',
  };
}

export async function generateStaticParams() {
  const { publications } = await getPublications();
  return publications.map((pub) => ({ slug: pub.slug }));
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Publication Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The publication you are looking for does not exist.
          </p>
          <a
            href="/publications"
            className="mt-4 inline-block text-emerald-700 hover:underline"
          >
            Back to Publications
          </a>
        </div>
      </div>
    );
  }

  // Get related publications (same type, excluding current)
  const { publications: allPubs } = await getPublications();
  const related = allPubs
    .filter(
      (p) =>
        p.id !== publication.id &&
        p.acfPublicationFields?.publicationType ===
          publication.acfPublicationFields?.publicationType
    )
    .slice(0, 5);

  return <PublicationDetailClient publication={publication} relatedPublications={related} />;
}
