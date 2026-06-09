import { getPublications, getProjects, getEvents, getPartners, getTestimonials, getSiteSettings } from '@/graphql/fetchers';
import HomePageClient from '@/components/pages/HomePageClient';

export default async function HomePage() {
  const [settings, publicationsData, projectsData, eventsData, partners, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublications(6),
    getProjects(4),
    getEvents(4),
    getPartners(),
    getTestimonials(),
  ]);

  const publications = publicationsData.publications.filter((_, i) => i < 3);
  const projects = projectsData.projects.filter((_, i) => i < 3);
  const events = eventsData.events.filter((_, i) => i < 3);

  return (
    <HomePageClient
      settings={settings}
      publications={publications}
      projects={projects}
      events={events}
      partners={partners}
      testimonials={testimonials}
    />
  );
}
