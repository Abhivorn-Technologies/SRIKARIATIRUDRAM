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

  const [activeCategory, setActiveCategory] = useState<'all' | 'photos' | 'videos'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [images, setImages] = useState<GalleryItem[]>(defaultImages);
  const [videos, setVideos] = useState<GalleryItem[]>(defaultVideos);

  useEffect(() => {
    // Fetch live photos from database
    fetch('/api/admin/gallery')
      .then(res => res.json())
      .then(json => {
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
      .catch(e => console.warn('Failed to load dynamic gallery images:', e));

    // Fetch live videos from database
    fetch('/api/admin/videos')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          const mapped: GalleryItem[] = json.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            titleTe: item.title_te || item.title || item.name,
            description: item.description || 'Sacred Video Darshan',
            descriptionTe: item.description_te || item.description || 'పవిత్ర దర్శనం',
            type: 'video',
            category: 'rituals',
            thumbnailUrl: item.thumbnail_url || item.secure_url || item.url,
            fullUrl: item.secure_url || item.url,
            day: item.day_number,
          }));
          setVideos(mapped);
        }
      })
      .catch(e => console.warn('Failed to load dynamic videos:', e));
  }, []);

  const galleryImages = images;
  const galleryVideos = videos;

  const showPhotos = activeCategory === 'all' || activeCategory === 'photos';
  const showVideos = activeCategory === 'all' || activeCategory === 'videos';

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Category Tabs: All, Photos (21), Videos (4) */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep shadow-gold-sm font-black'
              : 'bg-burgundy-deep/80 text-ivory/80 border border-gold/30 hover:border-gold/60 hover:text-gold-lighter'
          }`}
        >
          <span>All Media</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === 'all' ? 'bg-burgundy-deep text-gold-lighter' : 'bg-gold/20 text-gold-lighter'
            }`}
          >
            {galleryImages.length + galleryVideos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('photos')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
            activeCategory === 'photos'
              ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep shadow-gold-sm font-black'
              : 'bg-burgundy-deep/80 text-ivory/80 border border-gold/30 hover:border-gold/60 hover:text-gold-lighter'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Photos</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === 'photos' ? 'bg-burgundy-deep text-gold-lighter' : 'bg-gold/20 text-gold-lighter'
            }`}
          >
            {galleryImages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('videos')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
            activeCategory === 'videos'
              ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep shadow-gold-sm font-black'
              : 'bg-burgundy-deep/80 text-ivory/80 border border-gold/30 hover:border-gold/60 hover:text-gold-lighter'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Videos</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === 'videos' ? 'bg-burgundy-deep text-gold-lighter' : 'bg-gold/20 text-gold-lighter'
            }`}
          >
            {galleryVideos.length}
          </span>
        </button>
      </div>

      {/* 1. All 21 Image Cards (g1 to g9, then g12 to g23) */}
      {showPhotos && (
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
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Card Content & Badge */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="self-start inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-burgundy-deep/90 text-gold-lighter border border-gold/40 shadow-xs">
                    <ImageIcon className="w-3 h-3 text-gold" />
                    <span>PHOTO</span>
                  </span>

                  <div className="space-y-1">
                    <h4 className="font-cinzel text-base font-bold text-ivory group-hover:text-gold-light transition-colors line-clamp-1">
                      {isTe ? item.titleTe : item.title}
                    </h4>
                    <p className="text-xs text-ivory/75 line-clamp-1 font-sans">
                      {isTe ? item.descriptionTe : item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. All 4 Video Cards (Strictly 9:16 Portrait, Actual Video Element, Centered Play Button, No Cover Photo) */}
      {showVideos && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {galleryVideos.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-2xl overflow-hidden border border-gold/40 bg-gradient-to-b from-[#2B0005] via-[#1A0004] to-[#120002] aspect-[9/16] cursor-pointer shadow-gold-sm hover:shadow-gold-md hover:border-gold/80 transition-all duration-300 flex items-center justify-center"
              >
                {/* Actual Video Element (Preload metadata, NO cover/poster image) */}
                <video
                  src={item.fullUrl}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B0005] via-transparent to-[#2B0005]/40 opacity-75 group-hover:opacity-90 transition-opacity" />

                {/* Prominent Centered Gold Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#D6A532] via-[#F2C14E] to-[#B38018] border-2 border-[#FAF4E6] flex items-center justify-center shadow-[0_0_24px_rgba(214,165,50,0.7)] group-hover:scale-110 group-hover:shadow-[0_0_32px_rgba(242,193,78,0.95)] transition-all duration-300">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#2B0005] fill-[#2B0005] ml-1" />
                  </div>
                </div>

                {/* Card Badge & Title */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                  <span className="self-start inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#2B0005]/90 text-gold-lighter border border-gold/40 shadow-xs">
                    <Film className="w-3 h-3 text-gold" />
                    <span>VIDEO</span>
                  </span>

                  <div className="space-y-0.5">
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-ivory group-hover:text-gold-light transition-colors line-clamp-1">
                      {isTe ? item.titleTe : item.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-ivory/70 line-clamp-1 font-sans">
                      {isTe ? item.descriptionTe : item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / 9:16 Video Player Modal */}
      <Modal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        maxWidth={activeItem?.type === 'video' ? 'md' : 'xl'}
      >
        {activeItem && (
          <div className="space-y-4">
            <div
              className={`relative rounded-xl overflow-hidden border border-gold/40 bg-black flex items-center justify-center ${
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
                  className="object-contain"
                />
              )}
            </div>

            <div className="space-y-1 text-center">
              <span className="text-xs font-bold text-gold uppercase tracking-wider font-sans">
                {activeItem.type === 'video' ? 'Sacred Video Darshan' : 'Sacred Photo Darshan'}
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
