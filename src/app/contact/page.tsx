import ContactPageClient from '@/components/pages/ContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Prof. Bola Akanji',
  description:
    'Contact Professor Bola Akanji for research collaborations, speaking engagements, policy advisory, or academic inquiries.',
};

export default async function ContactPage() {
  return <ContactPageClient />;
}
