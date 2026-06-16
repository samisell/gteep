import type { Metadata } from 'next';
import AboutPageClient from '@/components/pages/AboutPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import {
  getSiteSettings,
  getPhilosophy,
  getTeamMembers,
  getAboutPage,
  isWordPressConnected,
} from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us - GTEEP',
  description:
    'Learn about GTEEP — Gilead Trust Economic Empowerment Project. Evidence-driven policy analysis for socially inclusive development in Africa.',
};

export default async function AboutPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="About Us" />;
  }

  const [settings, philosophy, teamMembers, aboutData] = await Promise.all([
    getSiteSettings(),
    getPhilosophy(),
    getTeamMembers(),
    getAboutPage(),
  ]);

  return (
    <AboutPageClient
      settings={settings}
      philosophy={philosophy}
      teamMembers={teamMembers}
      aboutData={aboutData}
    />
  );
}
