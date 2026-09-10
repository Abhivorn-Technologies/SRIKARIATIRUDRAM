'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Seva, SevaAvailability } from '@/types/seva';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Clock, Flame, CheckCircle, ArrowRight } from 'lucide-react';

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
  const t = useTranslations('sevas');

  return (
    <Card
      variant="sacred"
      interactive
      className="flex flex-col justify-between border-gold/30 hover:border-gold p-0 relative overflow-hidden group"
    >
      {/* Visual Header */}
      <div className="relative h-44 w-full overflow-hidden bg-burgundy-deep">
        <Image
          src={seva.image}
          alt={seva.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/30 to-transparent" />

        <div className="absolute top-3 right-3">
          <AvailabilityBadge availability={seva.availability} slots={seva.availableSlots} />
        </div>

        {seva.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="gold" size="sm" className="font-bold">
              Special Mahaseva
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-lighter group-hover:text-gold transition-colors">
            {isTe ? seva.titleTe : seva.title}
          </h3>
          <p className="text-xs sm:text-sm text-ivory/75 font-sans line-clamp-2 leading-relaxed">
            {isTe ? seva.shortDescTe : seva.shortDesc}
          </p>
        </div>

        {/* Benefits bullets */}
        <div className="space-y-1.5 pt-2 border-t border-gold/15">
          {(isTe ? seva.benefitsTe : seva.benefits).slice(0, 2).map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-ivory/80 font-sans">
              <CheckCircle className="w-3.5 h-3.5 text-gold-light shrink-0" />
              <span className="line-clamp-1">{b}</span>
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-gold/20 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-ivory/60 uppercase font-sans tracking-wider block">
              {t('price')}
            </span>
            <span className="font-cinzel text-xl font-black text-gold-lighter">
              {formatCurrency(seva.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/sevas/${seva.slug}`}>
              <Button variant="ghost" size="sm" className="text-xs px-2.5 py-1 text-gold-light hover:text-gold">
                {t('viewDetails')}
              </Button>
            </Link>
            <Link href={`/book-seva?seva=${seva.slug}`}>
              <Button variant="gold" size="sm" className="text-xs font-bold px-3 py-1.5">
                <Flame className="w-3.5 h-3.5 mr-1" />
                {t('bookNow')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
