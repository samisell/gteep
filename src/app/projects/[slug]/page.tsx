import { getProjectBySlug, getProjects } from '@/graphql/fetchers';
import ProjectDetailClient from '@/components/pages/ProjectDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project?.title || 'Project Not Found',
    description: project?.excerpt || '',
  };
}

export async function generateStaticParams() {
  const { projects } = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The project you are looking for does not exist.
          </p>
          <a href="/projects" className="mt-4 inline-block text-emerald-700 hover:underline">
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  return <ProjectDetailClient project={project} />;
}
