import { getProjects } from '@/graphql/fetchers';
import ProjectsPageClient from '@/components/pages/ProjectsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Projects - Prof. Bola Akanji',
  description:
    'Research projects led by Professor Bola Akanji on African trade policy, AfCFTA, ECOWAS integration, and sustainable economic development.',
};

export default async function ProjectsPage() {
  const { projects } = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
