import { getPageBySlug } from '@/graphql/fetchers';
import AboutPageClient from '@/components/pages/AboutPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Prof. Bola Akanji',
  description:
    'Learn about Professor Bola Akanji, a distinguished economist with 25+ years of research in African trade policy, regional integration, and development economics.',
};

export default async function AboutPage() {
  const page = await getPageBySlug('about');
  return <AboutPageClient page={page || { id: '', databaseId: 0, title: 'About', slug: 'about', content: '', excerpt: '', date: '', modified: '', status: 'publish', featuredImage: null, uri: '/about' }} />;
}
