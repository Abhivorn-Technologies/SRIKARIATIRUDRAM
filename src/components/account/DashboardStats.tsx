'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DevoteeStats } from '@/types/devotee';
import { ConfirmedBooking } from '@/types/booking';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Flame, Heart, Utensils, ArrowRight, Download, Clock } from 'lucide-react';

export function DashboardStatsGrid({ stats }: { stats: DevoteeStats }) {
  const t = useTranslations('account');

  const items = [
    { label: t('myBookings'), value: stats.totalBookings, icon: Flame, color: 'text-gold' },
    { label: t('upcomingSevas'), value: stats.upcomingSevas, icon: Calendar, color: 'text-emerald-400' },
    { label: t('donationsHistory'), value: stats.donationsCount, icon: Heart, color: 'text-red-400' },
    { label: t('annadanamBookings'), value: stats.annadanamDays, icon: Utensils, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <Card key={idx} variant="sacred" className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/60 border border-gold/30 flex items-center justify-center shrink-0">
              <Icon className={`w-6 h-6 ${it.color}`} />
            </div>
            <div>
              <span className="font-cinzel text-2xl font-black text-ivory block">
                {it.value}
              </span>
              <span className="text-xs text-ivory/70 font-sans">{it.label}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function DevoteeBookingCard({ booking }: { booking: any }) {
  const t = useTranslations('account');

  const sevaTitle = booking.sevaName || (booking.sevaSlug ? booking.sevaSlug.replace(/-/g, ' ').toUpperCase() : 'SEVA OFFERING');
  const dakshinaAmount = Number(booking.amount || booking.grandTotal || 0);
  const devoteeGotram = booking.primaryDevotee?.gotram || booking.gotram || 'Not Provided';
  const devoteeNakshatra = booking.primaryDevotee?.nakshatra || booking.nakshatra || 'Not Provided';

  return (
    <Card variant="sacred" className="p-5 border-gold/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/20 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
            {booking.bookingId}
          </span>
          <h4 className="font-cinzel text-lg font-bold text-gold-lighter mt-0.5">
            {sevaTitle}
          </h4>
        </div>
        <Badge variant="success" size="sm" className="self-start sm:self-center">
          {(booking.status || 'CONFIRMED').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-ivory/80 font-sans">
        <div>
          <span className="text-ivory/50 block text-[10px] uppercase">Muhurtham Date</span>
          <span className="font-semibold text-ivory">{booking.date || booking.selectedDate} (Day {booking.dayNumber || 1})</span>
        </div>
        <div>
          <span className="text-ivory/50 block text-[10px] uppercase">Gotram / Nakshatra</span>
          <span className="font-semibold text-ivory">{devoteeGotram} • {devoteeNakshatra}</span>
        </div>
        <div>
          <span className="text-ivory/50 block text-[10px] uppercase">Total Dakshina</span>
          <span className="font-bold text-gold-light">{formatCurrency(dakshinaAmount)}</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-gold/15 text-xs">
        <Link href={`/book-seva/receipt/${booking.bookingId}`} className="text-gold-light hover:text-gold flex items-center gap-1 font-semibold">
          <Download className="w-3.5 h-3.5" />
          <span>{t('download')} PDF Receipt</span>
        </Link>
        <Link href={`/book-seva/receipt/${booking.bookingId}`}>
          <Button variant="ghost" size="sm" className="text-xs text-ivory hover:text-gold-light">
            {t('viewDetails')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
