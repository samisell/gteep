import HomePageClient from '@/components/pages/HomePageClient';
import OfflinePage from '@/components/shared/OfflinePage';
import {
  getSiteSettings,
  getActivities,
  getPhilosophy,
  getTeamMembers,
  getOutputs,
  getOutputDownloadables,
  getPartners,
  getBlogPosts,
  getAboutPage,
  isWordPressConnected,
} from '@/graphql/fetchers';

// Revalidate every 5 minutes so WordPress content stays fresh on Vercel
export const revalidate = 300;

export default async function HomePage() {
  // Check if WordPress is reachable first
  const wpConnected = await isWordPressConnected();

  if (!wpConnected) {
    return <OfflinePage />;
  }

  // Fetch all data in parallel from WordPress
  const [settings, activities, philosophy, teamMembers, outputs, downloadables, partners, blogPosts, aboutData] =
    await Promise.all([
      getSiteSettings(),
      getActivities(),
      getPhilosophy(),
      getTeamMembers(),
      getOutputs(),
      getOutputDownloadables(),
      getPartners(),
      getBlogPosts(),
      getAboutPage(),
    ]);

  // Merge downloadables into outputs
  const allOutputs = [...downloadables, ...outputs];

  return (
    <HomePageClient
      settings={settings}
      activities={activities}
      philosophy={philosophy}
      teamMembers={teamMembers}
      outputs={allOutputs}
      partners={partners}
      blogPosts={blogPosts}
      aboutData={aboutData}
    />
  );
}
