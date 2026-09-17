'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { Card } from '@/components/ui/Card';
import { User, Calendar, Flame, Heart, Utensils, FileText, LogOut } from 'lucide-react';

export function AccountSidebar() {
  const t = useTranslations('account');
  const pathname = usePathname();
  const { session, logout } = useDevoteeAuth();

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
    <>
      {/* Mobile Horizontal Navigation (Visible on screens < lg) */}
      <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none space-y-2">
        <div className="p-3 rounded-xl bg-burgundy-deep/90 border border-gold/30 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-gold tracking-widest block">
              Devotee Account
            </span>
            <h4 className="font-cinzel text-sm font-bold text-ivory truncate">
              {session?.fullName || 'Sacred Devotee'}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = '/account/login';
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#2B0005] font-bold shadow-md'
                    : 'bg-burgundy-deep/80 text-ivory/80 border border-gold/20 hover:text-gold-light'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2B0005]' : 'text-gold-light'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar (Visible on screens >= lg) */}
      <Card variant="sacred" className="hidden lg:block p-4 space-y-2 border-gold/30 print:hidden no-print">
        <div className="p-3 border-b border-gold/20 mb-2">
          <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
            Devotee Account
          </span>
          <h4 className="font-cinzel text-base font-bold text-ivory truncate">
            {session?.fullName || 'Sacred Devotee'}
          </h4>
          <span className="text-xs text-ivory/60 font-sans block truncate">
            +91 {session?.phone || '—'}
          </span>
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

          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = '/account/login';
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/40 transition-colors mt-4 pt-4 border-t border-gold/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </nav>
      </Card>
    </>
  );
}
