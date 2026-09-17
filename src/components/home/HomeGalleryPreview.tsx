'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { homePreviewGallery } from '@/data/gallery';
import { GalleryItem } from '@/types/gallery';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ArrowRight, Play, Film, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomeGalleryPreview() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('home.galleryPreview');

  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <section className="w-full bg-[#FAF4E6] text-[#3A0008] py-16 lg:py-20 border-t border-[#D6A532]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-[#3A0008] tracking-tight">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A151D]/80 mt-1 font-sans">
              {t('subtitle')}
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-xs md:text-sm font-bold text-[#8B5E0A] hover:text-[#3A0008] flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Preview Cards: Sacred Photos (g1-g5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {homePreviewGallery.map((item, index) => {
            const isVideo = item.type === 'video';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded-2xl overflow-hidden border border-[#D6A532]/45 shadow-sm hover:shadow-lg transition-all bg-[#2B0005] cursor-pointer flex flex-col justify-between ${
                  isVideo ? 'aspect-[9/16] ring-1 ring-[#D6A532]/60' : 'aspect-[4/3] sm:aspect-[3/4] lg:aspect-[9/16]'
                }`}
              >
                {/* Media Container */}
                {isVideo ? (
                  <>
                    {/* Actual Video Element (NO cover/poster image) */}
                    <video
                      src={item.fullUrl}
                      preload="none"
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Scrim Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B0005] via-transparent to-[#2B0005]/40 opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Prominent Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#D6A532] via-[#F2C14E] to-[#B38018] border-2 border-[#FAF4E6] flex items-center justify-center shadow-[0_0_20px_rgba(214,165,50,0.7)] group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(242,193,78,0.95)] transition-all duration-300">
                        <Play className="w-5 h-5 text-[#2B0005] fill-[#2B0005] ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      loading="lazy"
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B0005] via-[#2B0005]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  </>
                )}

                {/* Card Info & Badges */}
                <div className="absolute inset-0 p-3.5 flex flex-col justify-between pointer-events-none">
                  <span className="self-start inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#2B0005]/90 text-[#F2C14E] border border-[#D6A532]/40 shadow-xs">
                    {isVideo ? (
                      <>
                        <Film className="w-2.5 h-2.5 text-[#F2C14E]" />
                        <span>VIDEO</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-2.5 h-2.5 text-[#F2C14E]" />
                        <span>PHOTO</span>
                      </>
                    )}
                  </span>

                  <div>
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#FAF4E6] group-hover:text-[#F2C14E] transition-colors line-clamp-1">
                      {isTe ? item.titleTe : item.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#FAF4E6]/70 line-clamp-1 font-sans mt-0.5">
                      {isTe ? item.descriptionTe : item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View Full Gallery CTA Button */}
        <div className="text-center pt-10">
          <Link href="/gallery" className="inline-block">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              {t('viewAll')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Lightbox / 9:16 Video Player Modal */}
      <Modal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        maxWidth={activeItem?.type === 'video' ? 'md' : 'xl'}
      >
        {activeItem && (
          <div className="space-y-4">
            <div
              className={`relative rounded-xl overflow-hidden border border-[#D6A532]/40 bg-black flex items-center justify-center ${
                activeItem.type === 'video'
                  ? 'aspect-[9/16] max-h-[78vh] mx-auto'
                  : 'aspect-video w-full'
              }`}
            >
              {activeItem.type === 'video' ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={activeItem.fullUrl}
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <Image
                  src={activeItem.fullUrl}
                  alt={activeItem.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  unoptimized
                  className="object-contain"
                />
              )}
            </div>

            <div className="space-y-1 text-center">
              <span className="text-xs font-bold text-[#D6A532] uppercase tracking-wider font-sans">
                {activeItem.type === 'video' ? 'Sacred Video Darshan' : 'Sacred Photo Darshan'}
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#FAF4E6]">
                {isTe ? activeItem.titleTe : activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF4E6]/80 font-sans leading-relaxed max-w-lg mx-auto">
                {isTe ? activeItem.descriptionTe : activeItem.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
