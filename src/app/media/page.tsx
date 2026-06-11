import { getPosts } from '@/graphql/fetchers';
import MediaPageClient from '@/components/pages/MediaPageClient';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Media & Press - Prof. Bola Akanji',
  description:
    'Media coverage, commentary, and news featuring Professor Bola Akanji and her research.',
};

export default async function MediaPage() {
  const { posts } = await getPosts();
  return <MediaPageClient posts={posts} />;
}
