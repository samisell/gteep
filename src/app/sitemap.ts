import type { MetadataRoute } from 'next';
import { getPages, getPosts, getOutputs } from '@/graphql/fetchers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gteep.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pagesData, postsData, outputs] = await Promise.all([
    getPages(100),
    getPosts(100),
    getOutputs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/what-we-do`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/outputs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = postsData.posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const outputPages: MetadataRoute.Sitemap = outputs.map((output) => ({
    url: `${SITE_URL}/outputs/${output.slug}`,
    lastModified: new Date(output.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...outputPages];
}
