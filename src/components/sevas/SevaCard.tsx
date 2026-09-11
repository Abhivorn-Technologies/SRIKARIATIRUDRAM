'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Seva, SevaAvailability } from '@/types/seva';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

export function AvailabilityBadge({ availability, slots }: { availability: SevaAvailability; slots: number }) {
  const t = useTranslations('sevas');

  if (availability === 'sold_out') {
    return <Badge variant="warning" size="sm">{t('full')}</Badge>;
  }
  if (availability === 'few_slots') {
    return <Badge variant="warning" size="sm">{slots} Slots Left</Badge>;
  }
  return <Badge variant="success" size="sm">{t('available')}</Badge>;
}

export function SevaCard({ seva }: { seva: Seva }) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const t = useTranslations('sevas');

  const title = isTe ? seva.titleTe : isHi ? (seva.titleHi || seva.title) : seva.title;
  const description = isTe ? seva.shortDescTe : isHi ? (seva.shortDescHi || seva.shortDesc) : seva.shortDesc;
  const icon = seva.icon || '🔱';

  return (
    <div
      className="group relative flex flex-col justify-between h-full rounded-2xl bg-gradient-to-b from-[#4A0A14]/90 via-[#35030A]/95 to-[#230206] p-6 sm:p-7 border border-[#D6A532]/35 shadow-[0_4px_25px_rgba(0,0,0,0.45)] hover:border-[#D6A532] hover:shadow-[0_8px_35px_rgba(214,165,50,0.25)] hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[#D6A532]/10 rounded-full blur-2xl group-hover:bg-[#D6A532]/20 transition-all duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-[#5A0714]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Section: Icon, Title, Description */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 flex-1">
        {/* Sacred Seva Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#5A0714] to-[#2B040A] border border-[#D6A532]/40 flex items-center justify-center shadow-[0_0_15px_rgba(214,165,50,0.2)] group-hover:border-[#D6A532] group-hover:shadow-[0_0_20px_rgba(214,165,50,0.4)] group-hover:scale-105 transition-all duration-300">
          <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="Seva Icon">
            {icon}
          </span>
        </div>

        {/* Seva Name */}
        <div className="w-full space-y-1">
          <h3 className="font-cinzel text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532] group-hover:from-white group-hover:via-[#FFE484] group-hover:to-[#D6A532] transition-colors leading-snug tracking-wide uppercase break-words hyphens-auto">
            {title}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#FFF8E8]/80 font-sans leading-relaxed flex-1 flex items-center justify-center">
          {description}
        </p>
      </div>

      {/* Bottom Section: Contribution & Button */}
      <div className="relative z-10 pt-6 mt-5 border-t border-[#D6A532]/20 space-y-4 text-center">
        {/* Contribution Amount */}
        <div className="space-y-0.5">
          <span className="text-[11px] uppercase font-sans tracking-widest text-[#E8C76A]/80 font-semibold block">
            {t('contribution')}
          </span>
          <div className="font-cinzel text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E8] via-[#F2C14E] to-[#D6A532]">
            {formatCurrency(seva.price)}
          </div>
        </div>

        {/* Action Button: 🪔 BOOK SEVA */}
        <Link
          href={`/book-seva/date?seva=${seva.slug}`}
          className="block w-full"
        >
          <button
            type="button"
            className="w-full bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-bold text-sm sm:text-base py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(214,165,50,0.3)] hover:shadow-[0_0_25px_rgba(214,165,50,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none"
          >
            <span className="text-base leading-none">🪔</span>
            <span className="tracking-wider uppercase font-extrabold">BOOK SEVA</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
