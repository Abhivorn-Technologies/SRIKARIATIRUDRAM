'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { sponsorsList } from '@/data/gallery';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export function SponsorGrid() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('sponsors');

  const diamondSponsors = sponsorsList.filter((s) => s.tier === 'diamond');
  const goldSponsors = sponsorsList.filter((s) => s.tier === 'gold');
  const silverSponsors = sponsorsList.filter((s) => s.tier === 'silver');

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Diamond Patrons */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gold/30 pb-3">
          <Award className="w-6 h-6 text-gold fill-gold" />
          <h2 className="font-cinzel text-xl md:text-2xl font-black text-gold-lighter uppercase tracking-wider">
            {t('diamond')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diamondSponsors.map((sp) => (
            <Card key={sp.id} variant="gold-border" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm">
                  {isTe ? sp.titleTe : sp.title}
                </Badge>
                <span className="text-xs text-ivory/60 font-sans">{sp.city}</span>
              </div>
              <h3 className="font-cinzel text-lg md:text-xl font-bold text-ivory">
                {isTe ? sp.nameTe : sp.name}
              </h3>
              <p className="text-xs sm:text-sm text-gold-light font-sans leading-relaxed">
                {isTe ? sp.contributionTypeTe : sp.contributionType}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Gold Patrons */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gold/30 pb-3">
          <HeartHandshake className="w-5 h-5 text-amber-400" />
          <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-lighter uppercase tracking-wider">
            {t('gold')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goldSponsors.map((sp) => (
            <Card key={sp.id} variant="sacred" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="maroon" size="sm">
                  {isTe ? sp.titleTe : sp.title}
                </Badge>
                <span className="text-xs text-ivory/60 font-sans">{sp.city}</span>
              </div>
              <h4 className="font-cinzel text-base font-bold text-ivory">
                {isTe ? sp.nameTe : sp.name}
              </h4>
              <p className="text-xs text-ivory/75 font-sans">
                {isTe ? sp.contributionTypeTe : sp.contributionType}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
