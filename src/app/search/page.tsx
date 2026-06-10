import { Suspense } from 'react';
import SearchPageClient from '@/components/pages/SearchPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - Prof. Bola Akanji',
  description: 'Search across publications, projects, events, and resources.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>}>
      <SearchPageClient />
    </Suspense>
  );
}
