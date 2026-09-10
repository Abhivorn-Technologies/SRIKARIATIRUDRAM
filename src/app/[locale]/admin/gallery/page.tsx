'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Upload, Trash2, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { galleryImages } from '@/data/gallery';

export default function AdminGalleryPage() {
  const [images, setImages] = useState(galleryImages);
  const [activeDayFilter, setActiveDayFilter] = useState('all');

  const filteredImages = images.filter((img) => {
    if (activeDayFilter === 'all') return true;
    return img.dayNumber === Number(activeDayFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              MEDIA & VISUAL ARCHIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-gold" />
            Gallery & Daily Photo Manager
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Upload and organize high-resolution photographs, homam rituals, and VIP visits categorized by Mahayagnam Day.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
          <Upload className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Upload New Photos
        </Button>
      </div>

      {/* Filter Row */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-gold-light font-semibold font-cinzel">Filter by Day:</label>
          <select
            value={activeDayFilter}
            onChange={(e) => setActiveDayFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none"
          >
            <option value="all">All 28 Days Photos</option>
            {Array.from({ length: 28 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Day {String(i + 1).padStart(2, '0')} Photos
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-ivory/60 font-sans">
          Showing {filteredImages.length} images
        </span>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredImages.map((img) => (
          <Card
            key={img.id}
            className="group relative overflow-hidden bg-burgundy-deep/80 border-gold/30 p-2 space-y-2 hover:border-gold transition-all"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-gold/20">
              <Image
                src={img.thumbnailUrl || img.fullUrl}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-burgundy-deep/90 text-gold text-[10px] font-bold font-cinzel border border-gold/40">
                Day {String(img.dayNumber || 1).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-ivory truncate">{img.title}</p>
              <p className="text-[10px] text-ivory/60 truncate">{img.category}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
