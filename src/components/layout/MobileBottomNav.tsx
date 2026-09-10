'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Home, Calendar, Flame, Radio, User } from 'lucide-react';

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems = [
    { key: 'home', href: '/', icon: Home },
    { key: 'schedule', href: '/schedule', icon: Calendar },
    { key: 'sevas', href: '/sevas', icon: Flame, highlight: true },
    { key: 'live', href: '/live', icon: Radio, isLive: true },
    { key: 'account', href: '/account', icon: User },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-burgundy-deep/95 backdrop-blur-md border-t border-gold/30 px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-gradient text-burgundy-deep flex items-center justify-center shadow-gold-md border-2 border-ivory group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 fill-burgundy-deep" />
                </div>
                <span className="text-[10px] font-bold text-gold-lighter mt-1 uppercase tracking-tighter">
                  {t('bookSeva')}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-gold font-bold' : 'text-ivory/60 hover:text-ivory'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.isLive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium truncate max-w-[60px]">
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
