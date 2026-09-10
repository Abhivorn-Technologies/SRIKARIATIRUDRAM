import { notFound } from 'next/navigation';
import { GallerySection } from '@/components/gallery/GalleryGrid';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export default function GalleryDayPage({ params: { day } }: { params: { day: string } }) {
  const dayNum = parseInt(day, 10);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 28) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Full Gallery
      </Link>
      <div className="text-center">
        <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
          Day {dayNum} Photo & Video Highlights
        </h1>
      </div>
      <GallerySection />
    </div>
  );
}
