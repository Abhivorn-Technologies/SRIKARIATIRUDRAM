'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { User, Calendar, Flame, Heart, Utensils, FileText, Bell, LogOut } from 'lucide-react';

export function AccountSidebar() {
  const t = useTranslations('account');
  const pathname = usePathname();

  const navLinks = [
    { href: '/account', label: t('dashboard'), icon: Flame, exact: true },
    { href: '/account/bookings', label: t('myBookings'), icon: Calendar },
    { href: '/account/sankalpam', label: t('sankalpamRecords'), icon: User },
    { href: '/account/donations', label: t('donationsHistory'), icon: Heart },
    { href: '/account/annadanam', label: t('annadanamBookings'), icon: Utensils },
    { href: '/account/receipts', label: t('myReceipts'), icon: FileText },
    { href: '/account/profile', label: t('profile'), icon: User },
  ];

  return (
    <Card variant="sacred" className="p-4 space-y-2 border-gold/30">
      <div className="p-3 border-b border-gold/20 mb-2">
        <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
          Devotee Account
        </span>
        <h4 className="font-cinzel text-base font-bold text-ivory">
          K. Satyanarayana
        </h4>
        <span className="text-xs text-ivory/60 font-sans">+91 98765 43210</span>
      </div>

      <nav className="space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-gold-lighter border border-gold/40 shadow-gold-sm'
                  : 'text-ivory/80 hover:bg-white/5 hover:text-gold-light'
              }`}
            >
              <Icon className="w-4 h-4 text-gold-light" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <Link
          href="/account/login"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/40 transition-colors mt-4 pt-4 border-t border-gold/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </nav>
    </Card>
  );
}
