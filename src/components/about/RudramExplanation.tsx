'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { aboutContent } from '@/data/about';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Flame, Shield, Sparkles, BookOpen } from 'lucide-react';

export function RudramExplanation() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('about');

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      {/* Intro Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card variant="sacred" className="p-6 md:p-8 space-y-4 border-gold/40">
          <div className="w-12 h-12 rounded-xl bg-primary/60 border border-gold/40 flex items-center justify-center text-gold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold text-gold-lighter">
            {t('whatIsRudram')}
          </h3>
          <p className="text-sm text-ivory/80 leading-relaxed font-sans">
            {t('whatIsRudramDesc')}
          </p>
        </Card>

        <Card variant="sacred" className="p-6 md:p-8 space-y-4 border-gold/40">
          <div className="w-12 h-12 rounded-xl bg-primary/60 border border-gold/40 flex items-center justify-center text-gold">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold text-gold-lighter">
            {t('whatIsAtiRudram')}
          </h3>
          <p className="text-sm text-ivory/80 leading-relaxed font-sans">
            {t('whatIsAtiRudramDesc')}
          </p>
        </Card>
      </div>

      {/* Japa Progression Hierarchy Table */}
      <div className="space-y-6">
        <h3 className="font-cinzel text-2xl font-bold text-gold-light text-center">
          The Hierarchy of Sacred Rudra Yajnas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aboutContent.rudramHierarchy.map((tier, idx) => (
            <Card
              key={idx}
              variant={idx === 3 ? 'gold-border' : 'sacred'}
              className="p-5 space-y-2.5"
            >
              <Badge variant={idx === 3 ? 'gold' : 'maroon'} size="sm">
                Stage {idx + 1}
              </Badge>
              <h4 className="font-cinzel text-lg font-bold text-ivory">
                {tier.name}
              </h4>
              <span className="font-mono text-sm font-black text-gold-light block">
                {tier.japas}
              </span>
              <p className="text-xs text-ivory/70 font-sans leading-relaxed">
                {tier.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Organizing Samiti */}
      <div className="space-y-6">
        <h3 className="font-cinzel text-2xl font-bold text-gold-light text-center">
          {isTe ? 'నిర్వాహక వర్గం' : 'Organizing Samiti'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="sacred" className="p-5 space-y-2">
            <h4 className="font-cinzel text-base font-bold text-gold-lighter">
              {isTe ? aboutContent.organizers.primaryTe : aboutContent.organizers.primary}
            </h4>
            <span className="text-xs text-gold-light font-semibold block uppercase tracking-wide">
              {isTe ? 'ప్రధాన నిర్వాహకులు' : 'Primary Organizer'}
            </span>
            <p className="text-xs text-ivory/70 font-sans">
              {isTe ? 'శ్రీకరీ సేవా సమితి వారిచే లోకకళ్యాణార్థం నిర్వహించబడుతున్న మహాయజ్ఞం.' : 'Organized with devotion and Vedic resolve for Lokakalyanam and universal welfare.'}
            </p>
          </Card>

          <Card variant="sacred" className="p-5 space-y-2">
            <h4 className="font-cinzel text-base font-bold text-gold-lighter">
              {isTe ? aboutContent.organizers.associateTe : aboutContent.organizers.associate}
            </h4>
            <span className="text-xs text-gold-light font-semibold block uppercase tracking-wide">
              {isTe ? 'సహకారం' : 'In Association With'}
            </span>
            <p className="text-xs text-ivory/70 font-sans">
              {isTe ? 'గ్లోబల్ భక్తుల సమన్వయం మరియు ఆధ్యాత్మిక సహకారం.' : 'Global devotee coordination and spiritual association from North Carolina, USA.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
