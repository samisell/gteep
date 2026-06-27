import { getProjects, isWordPressConnected } from '@/graphql/fetchers';
import ProjectsPageClient from '@/components/pages/ProjectsPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Research Projects - Prof. Bola Akanji',
  description:
    'Research projects led by Professor Bola Akanji on African trade policy, AfCFTA, ECOWAS integration, and sustainable economic development.',
};

export default async function ProjectsPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Research Projects" />;
  }

  const { projects } = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
