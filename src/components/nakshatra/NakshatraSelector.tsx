'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { nakshatraDetails } from '@/data/nakshatras';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Star, Calendar, Flame, Sparkles, ArrowRight } from 'lucide-react';

export function NakshatraFinder() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('nakshatra');

  const [selectedId, setSelectedId] = useState<string>('aswini');
  const selectedNakshatra = nakshatraDetails.find((n) => n.id === selectedId) || nakshatraDetails[0];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Selector Dropdown / Grid */}
      <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block font-cinzel text-base md:text-lg font-bold text-gold-lighter">
            {t('selectStar')}
          </label>
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-base py-3"
          >
            {nakshatraDetails.map((n) => (
              <option key={n.id} value={n.id}>
                {isTe ? n.nameTe : n.nameEn} ({isTe ? n.rasiTe : n.rasiEn}) — Day {n.dayNumber}
              </option>
            ))}
          </Select>
        </div>

        {/* Quick Clickable Nakshatra Pills */}
        <div className="space-y-2 pt-2 border-t border-gold/20">
          <span className="text-xs text-ivory/60 uppercase font-sans tracking-wider block">
            Or Click Your Janma Star:
          </span>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-none">
            {nakshatraDetails.map((n) => {
              const isSelected = n.id === selectedId;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-sans ${
                    isSelected
                      ? 'bg-gold text-burgundy-deep font-bold border-gold shadow-gold-sm'
                      : 'bg-burgundy-deep/60 text-ivory/80 border-gold/20 hover:border-gold/50'
                  }`}
                >
                  {isTe ? n.nameTe : n.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Selected Nakshatra Detail Result Card */}
      <Card variant="sacred" className="p-6 md:p-8 space-y-6 border-gold shadow-gold-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold fill-gold" />
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
                {isTe ? selectedNakshatra.nameTe : selectedNakshatra.nameEn} Nakshatra
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gold-light font-sans">
              Rasi: <strong>{isTe ? selectedNakshatra.rasiTe : selectedNakshatra.rasiEn}</strong> | Planetary Lord: <strong>{selectedNakshatra.lord}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="gold" size="lg" className="font-cinzel text-sm">
              Day {selectedNakshatra.dayNumber} of Yajna
            </Badge>
          </div>
        </div>

        {/* Highlight details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="space-y-3 bg-burgundy-deep/70 p-5 rounded-xl border border-gold/25">
            <span className="text-xs text-gold uppercase font-bold tracking-wider block">
              Presiding Deity & Ritual
            </span>
            <h4 className="font-cinzel text-lg font-bold text-ivory">
              {isTe ? selectedNakshatra.presidingDeityTe : selectedNakshatra.presidingDeity}
            </h4>
            <p className="text-xs text-ivory/75 leading-relaxed">
              {isTe ? selectedNakshatra.homamNameTe : selectedNakshatra.homamName}
            </p>
          </div>

          <div className="space-y-3 bg-burgundy-deep/70 p-5 rounded-xl border border-gold/25">
            <span className="text-xs text-gold uppercase font-bold tracking-wider block">
              Spiritual Significance
            </span>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
              {isTe ? selectedNakshatra.significanceTe : selectedNakshatra.significance}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gold/20">
          <div className="text-xs text-ivory/70 font-sans">
            Auspicious date: <strong className="text-gold-light">{isTe ? selectedNakshatra.dateTe : selectedNakshatra.date}</strong>
          </div>

          <Link href={`/book-seva?day=${selectedNakshatra.dayNumber}&nakshatra=${selectedNakshatra.id}`}>
            <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 mr-1.5" />
              Book Seva for {isTe ? selectedNakshatra.nameTe : selectedNakshatra.nameEn} Day
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
