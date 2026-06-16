import type { Metadata } from 'next';
import ContactPageClient from '@/components/pages/ContactPageClient';
import { getContactDetails } from '@/graphql/fetchers';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact Us - GTEEP',
  description:
    'Get in touch with GTEEP for research collaborations, policy advisory, partnerships, or general inquiries.',
};

export default async function ContactPage() {
  // Fetch contact details from WordPress ACF (with sensible defaults if WP is unreachable)
  const contactDetails = await getContactDetails();

  return <ContactPageClient contactDetails={contactDetails} />;
}
