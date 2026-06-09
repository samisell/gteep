import type { Metadata } from 'next';
import AboutPageClient from '@/components/pages/AboutPageClient';
import {
  mockSiteSettings,
  mockPhilosophy,
  mockTeamMembers,
} from '@/graphql/mock-data';

export const metadata: Metadata = {
  title: 'About Us - GTEEP',
  description:
    'Learn about GTEEP — Gilead Trust Economic Empowerment Project. Evidence-driven policy analysis for socially inclusive development in Africa.',
};

export default function AboutPage() {
  return (
    <AboutPageClient
      settings={mockSiteSettings}
      philosophy={mockPhilosophy}
      teamMembers={mockTeamMembers}
    />
  );
}
