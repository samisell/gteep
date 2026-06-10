import type { Metadata } from 'next';
import ContactPageClient from '@/components/pages/ContactPageClient';
import { getSiteSettings } from '@/graphql/fetchers';

export const metadata: Metadata = {
  title: 'Contact Us - GTEEP',
  description:
    'Get in touch with GTEEP for research collaborations, policy advisory, partnerships, or general inquiries.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactPageClient settings={settings} />;
}
