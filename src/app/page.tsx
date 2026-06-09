import HomePageClient from '@/components/pages/HomePageClient';
import {
  mockSiteSettings,
  mockActivities,
  mockPhilosophy,
  mockTeamMembers,
  mockOutputs,
  mockPartners,
  mockBlogPosts,
} from '@/graphql/mock-data';

export default function HomePage() {
  return (
    <HomePageClient
      settings={mockSiteSettings}
      activities={mockActivities}
      philosophy={mockPhilosophy}
      teamMembers={mockTeamMembers}
      outputs={mockOutputs}
      partners={mockPartners}
      blogPosts={mockBlogPosts}
    />
  );
}
