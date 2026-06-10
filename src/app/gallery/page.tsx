import { getMediaItems } from '@/graphql/fetchers';
import GalleryPageClient from '@/components/pages/GalleryPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery - Prof. Bola Akanji',
  description: 'Photos from conferences, fieldwork, research activities, and events featuring Professor Bola Akanji.',
};

export default async function GalleryPage() {
  const { mediaItems } = await getMediaItems();
  return <GalleryPageClient mediaItems={mediaItems} />;
}
