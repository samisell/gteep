import type { Metadata } from 'next';
import BlogPageClient from '@/components/pages/BlogPageClient';
import { getBlogPosts } from '@/graphql/fetchers';

export const metadata: Metadata = {
  title: 'Our Blog - GTEEP',
  description:
    'Analysis, commentary, and insights on African trade policy, economic development, and social inclusion from GTEEP.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogPageClient posts={posts} />;
}
