import type { Metadata } from 'next';
import ContactPageClient from '@/components/pages/ContactPageClient';
import { mockSiteSettings } from '@/graphql/mock-data';

export const metadata: Metadata = {
  title: 'Contact Us - GTEEP',
  description:
    'Get in touch with GTEEP for research collaborations, policy advisory, partnerships, or general inquiries.',
};

export default function ContactPage() {
  return <ContactPageClient settings={mockSiteSettings} />;
}
