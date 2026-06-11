import type { Metadata } from 'next';
import AboutPageClient from '@/components/pages/AboutPageClient';
import {
  getSiteSettings,
  getPhilosophy,
  getTeamMembers,
} from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us - GTEEP',
  description:
    'Learn about GTEEP — Gilead Trust Economic Empowerment Project. Evidence-driven policy analysis for socially inclusive development in Africa.',
};

export default async function AboutPage() {
  const [settings, philosophy, teamMembers] = await Promise.all([
    getSiteSettings(),
    getPhilosophy(),
    getTeamMembers(),
  ]);

  return (
    <AboutPageClient
      settings={settings}
      philosophy={philosophy}
      teamMembers={teamMembers}
    />
  );
}
