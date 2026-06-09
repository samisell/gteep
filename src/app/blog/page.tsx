import type { Metadata } from 'next';
import BlogPageClient from '@/components/pages/BlogPageClient';
import { mockBlogPosts } from '@/graphql/mock-data';

export const metadata: Metadata = {
  title: 'Our Blog - GTEEP',
  description:
    'Analysis, commentary, and insights on African trade policy, economic development, and social inclusion from GTEEP.',
};

export default function BlogPage() {
  return <BlogPageClient posts={mockBlogPosts} />;
}
