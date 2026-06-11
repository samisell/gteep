import HomePageClient from '@/components/pages/HomePageClient';
import {
  getSiteSettings,
  getActivities,
  getPhilosophy,
  getTeamMembers,
  getOutputs,
  getPartners,
  getBlogPosts,
} from '@/graphql/fetchers';

// Revalidate every 5 minutes so WordPress content stays fresh on Vercel
export const revalidate = 300;

export default async function HomePage() {
  // Fetch all data in parallel - each fetcher tries WP GraphQL first,
  // then falls back to mock data if WP is unavailable or returns empty results
  const [settings, activities, philosophy, teamMembers, outputs, partners, blogPosts] =
    await Promise.all([
      getSiteSettings(),
      getActivities(),
      getPhilosophy(),
      getTeamMembers(),
      getOutputs(),
      getPartners(),
      getBlogPosts(),
    ]);

  return (
    <HomePageClient
      settings={settings}
      activities={activities}
      philosophy={philosophy}
      teamMembers={teamMembers}
      outputs={outputs}
      partners={partners}
      blogPosts={blogPosts}
    />
  );
}
