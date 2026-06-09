import type { MetadataRoute } from 'next';
import { getPublications, getProjects, getEvents, getResources, getPages } from '@/graphql/fetchers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gteep.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publicationsData, projectsData, eventsData, resourcesData, pagesData] = await Promise.all([
    getPublications(100),
    getProjects(100),
    getEvents(100),
    getResources(100),
    getPages(100),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/publications`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/media`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const publicationPages: MetadataRoute.Sitemap = publicationsData.publications.map((pub) => ({
    url: `${SITE_URL}/publications/${pub.slug}`,
    lastModified: new Date(pub.modified || pub.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const projectPages: MetadataRoute.Sitemap = projectsData.projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.modified || project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = eventsData.events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: new Date(event.modified || event.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const resourcePages: MetadataRoute.Sitemap = resourcesData.resources.map((resource) => ({
    url: `${SITE_URL}/resources/${resource.slug}`,
    lastModified: new Date(resource.modified || resource.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...publicationPages, ...projectPages, ...eventPages, ...resourcePages];
}
