import type { Metadata } from 'next';
import BlogPageClient from '@/components/pages/BlogPageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import { getBlogPosts, isWordPressConnected } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Blog - GTEEP',
  description:
    'Analysis, commentary, and insights on African trade policy, economic development, and social inclusion from GTEEP.',
};

export default async function BlogPage() {
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage pageTitle="Blog" />;
  }

  const posts = await getBlogPosts();
  return <BlogPageClient posts={posts} />;
}
