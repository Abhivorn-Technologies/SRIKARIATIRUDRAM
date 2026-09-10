'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function LocaleNotFound() {
  const locale = useLocale();
  const isTe = locale === 'te';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#2B0005]">
      <div className="text-center space-y-6 max-w-lg mx-auto p-8 rounded-2xl bg-[#3A0008]/90 border border-[#D6A532]/40 shadow-2xl">
        <span className="font-cinzel text-7xl md:text-8xl font-black text-[#F2C14E] block tracking-wider">
          404
        </span>
        <h1 className={`${isTe ? 'font-telugu' : 'font-cinzel'} text-2xl md:text-3xl font-bold text-[#FAF4E6]`}>
          {isTe ? 'పేజీ కనుగొనబడలేదు' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-[#FAF4E6]/80 font-sans leading-relaxed">
          {isTe
            ? 'మీరు వెతుకుతున్న పవిత్ర పేజీ అందుబాటులో లేదు లేదా మార్చబడింది.'
            : 'The auspicious page you are looking for does not exist or has been moved.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button variant="gold" size="lg" leftIcon={<Home className="w-4 h-4" />} className="font-bold">
              {isTe ? 'ప్రధాన పేజీకి వెళ్లండి' : 'Return to Home'}
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="outline" size="lg" className="font-semibold">
              {isTe ? '28 రోజుల షెడ్యూల్' : 'View Schedule'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
