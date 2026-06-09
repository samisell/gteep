'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import type { WPMedia } from '@/types';

interface GalleryPageClientProps {
  mediaItems: WPMedia[];
}

const categories = ['All', 'Conferences', 'Research', 'Teaching', 'Fieldwork', 'Portraits'];

export default function GalleryPageClient({ mediaItems }: GalleryPageClientProps) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<WPMedia | null>(null);

  const filtered = useMemo(() => {
    if (categoryFilter === 'All') return mediaItems;
    // In a real app, we'd filter by actual categories. For now, show all.
    return mediaItems;
  }, [mediaItems, categoryFilter]);

  const openLightbox = (item: WPMedia) => {
    setSelectedImage(item);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Gallery"
        subtitle="Photos & Visual Media"
        description="Photos from conferences, fieldwork, research activities, and events."
        breadcrumb={[{ label: 'Gallery' }]}
      />

      {/* Category Filters */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                className={
                  categoryFilter === cat
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'border-slate-300 hover:border-emerald-300'
                }
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No images found</h3>
            </div>
          ) : (
            <StaggerContainer className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {filtered.map((item) => (
                <StaggerItem key={item.id}>
                  <div
                    className="mb-4 group cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => openLightbox(item)}
                  >
                    {/* Placeholder image */}
                    <div
                      className="relative flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100"
                      style={{
                        aspectRatio: item.width && item.height ? `${item.width}/${item.height}` : '4/3',
                        minHeight: '180px',
                      }}
                    >
                      <ImageIcon className="h-10 w-10 text-emerald-300" />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* Caption */}
                    {item.caption && (
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {selectedImage && (
            <div className="relative flex items-center justify-center min-h-[50vh]">
              <div className="flex h-[70vh] w-full items-center justify-center bg-gradient-to-br from-emerald-900/20 to-slate-900">
                <ImageIcon className="h-20 w-20 text-emerald-400/40" />
              </div>
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-sm text-white">{selectedImage.caption}</p>
                  <p className="mt-1 text-xs text-slate-300">{selectedImage.title}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
