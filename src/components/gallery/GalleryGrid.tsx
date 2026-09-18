'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { galleryImages as defaultImages, galleryVideos as defaultVideos } from '@/data/gallery';
import { GalleryItem } from '@/types/gallery';
import { Modal } from '@/components/ui/Modal';
import { Play, Film, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function GallerySection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('gallery');

  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [images, setImages] = useState<GalleryItem[]>(defaultImages);

  useEffect(() => {
    // Fetch live photos from database
    fetch('/api/admin/gallery?type=image', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const mapped: GalleryItem[] = json.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            titleTe: item.title_te || item.title || item.name,
            description: item.description || (item.day_number ? `Day ${item.day_number} Mahotsavam` : 'Sacred Ceremony'),
            descriptionTe: item.description_te || item.description || (item.day_number ? `రోజు ${item.day_number} మహోత్సవం` : 'పవిత్ర పూజ'),
            type: 'image',
            category: item.category || 'rituals',
            thumbnailUrl: item.thumbnail_url || item.secure_url || item.url,
            fullUrl: item.secure_url || item.url,
            day: item.day_number,
            nakshatra: item.nakshatra,
          }));
          setImages(mapped);
        }
      })
      .catch((e) => console.warn('Failed to load dynamic gallery images:', e));
  }, []);

  const galleryImages = images;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 1. All Image Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-2xl overflow-hidden border border-gold/35 bg-burgundy-deep aspect-[4/3] cursor-pointer shadow-gold-sm hover:shadow-gold-md hover:border-gold/70 transition-all duration-300"
              >
                {/* Image Thumbnail */}
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/70 via-50% to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Card Content & Badge */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
                  <span className="self-start inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-burgundy-deep/90 text-gold-lighter border border-gold/40 shadow-xs">
                    <ImageIcon className="w-3 h-3 text-gold" />
                    <span>PHOTO</span>
                  </span>

                  <div className="w-full space-y-1 overflow-hidden">
                    <h4 className="font-cinzel text-base font-bold text-ivory group-hover:text-gold-light transition-colors truncate block w-full">
                      {isTe ? item.titleTe : item.title}
                    </h4>
                    <p className="text-xs text-ivory/75 truncate font-sans block w-full">
                      {isTe ? item.descriptionTe : item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        maxWidth="xl"
      >
        {activeItem && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-gold/40 bg-black aspect-video w-full flex items-center justify-center">
              <Image
                src={activeItem.fullUrl}
                alt={activeItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="space-y-1 text-center">
              <span className="text-xs font-bold text-gold uppercase tracking-wider font-sans">
                Sacred Photo Darshan
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-lighter">
                {isTe ? activeItem.titleTe : activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-ivory/80 font-sans leading-relaxed max-w-lg mx-auto">
                {isTe ? activeItem.descriptionTe : activeItem.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
