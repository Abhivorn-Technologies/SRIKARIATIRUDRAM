'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { mainNavigation } from '@/data/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Menu, X, Flame, Radio, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isNavActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Do not render public header inside admin portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 print:hidden no-print ${
        isScrolled
          ? 'bg-burgundy-deep/95 backdrop-blur-md border-b border-gold/30 shadow-gold-sm py-2'
          : 'bg-gradient-to-b from-burgundy-deep/95 via-primary/85 to-burgundy-deep/90 border-b border-gold/20 shadow-gold-sm/40 py-2.5 lg:py-3'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 lg:px-3 xl:px-5 2xl:px-8">
        <div className="flex items-center justify-between gap-1 lg:gap-1.5 xl:gap-2.5 min-h-[46px] sm:min-h-[50px]">
          
          {/* 1. BRAND / LOGO (Left) */}
          <Link
            href="/"
            className="flex items-center shrink-0 group select-none py-0.5"
            aria-label="Srikari Ati Rudram Home"
          >
            <Image
              src="/assets/icons/SRIKARIATI RUDRAM.svg"
              alt="Srikari Ati Rudram"
              width={200}
              height={55}
              priority
              className="h-7 sm:h-9 md:h-10 lg:h-9 xl:h-11 2xl:h-12 w-auto max-w-[120px] sm:max-w-none object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* 2. DESKTOP NAVIGATION ITEMS (Single Horizontal Line, No Wrap) */}
          <nav
            className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 text-[10px] xl:text-[11px] 2xl:text-[12.5px] flex-nowrap shrink"
            aria-label="Main Navigation"
          >
            {mainNavigation.map((item) => {
              const isActive = isNavActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-1 xl:px-1.5 2xl:px-2.5 py-1 rounded-md uppercase font-semibold tracking-tight xl:tracking-wide transition-all duration-200 flex items-center gap-1 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-primary text-gold-light border border-gold/50 shadow-gold-sm font-bold'
                      : 'text-ivory/85 hover:text-gold-light hover:bg-white/5 border border-transparent'
                  }`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0 inline-block" />
                  )}
                  <span className="whitespace-nowrap inline-block">{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT ACTION ITEMS (Language Switcher, Book Seva CTA, Devotee Account) */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
            {/* Language Translator */}
            <div className="hidden sm:block shrink-0">
              <LanguageSwitcher />
            </div>

            {/* Book Seva Button with Floating Click Animation */}
            <motion.div
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{
                y: -2.5,
                scale: 0.98,
                boxShadow: '0 0 18px rgba(232, 199, 106, 0.55), 0 3px 12px rgba(201, 154, 61, 0.35)',
              }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 25,
                duration: 0.25,
              }}
              className="shrink-0"
            >
              <Link href="/schedule" className="block shrink-0">
                <Button
                  variant="gold"
                  size="sm"
                  leftIcon={<Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />}
                  className="font-bold text-[10px] sm:text-xs xl:text-xs 2xl:text-[13px] uppercase tracking-wider whitespace-nowrap px-2 sm:px-2.5 xl:px-3 py-1 sm:py-1.5 shadow-gold-md shrink-0 flex items-center"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span className="whitespace-nowrap font-bold" style={{ whiteSpace: 'nowrap' }}>
                    {t('bookSeva')}
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Devotee / Account Icon */}
            <Link
              href="/account"
              className={`p-1 sm:p-1.5 xl:p-2 rounded-full border transition-all duration-200 shrink-0 flex items-center justify-center ${
                isNavActive('/account')
                  ? 'border-gold bg-primary text-gold-light shadow-gold-sm'
                  : 'border-gold/30 hover:border-gold text-gold-light hover:bg-white/10'
              }`}
              title={t('account')}
              aria-label={t('account')}
            >
              <User className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 sm:p-1.5 text-ivory hover:text-gold-light rounded-lg border border-gold/30 bg-burgundy-deep transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE RESPONSIVE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden border-t border-gold/20 bg-burgundy-deep/98 backdrop-blur-xl px-4 pt-4 pb-6 mt-2 space-y-3"
          >
            {/* Mobile Quick Action Buttons & Language Switcher */}
            <div className="flex flex-col gap-2.5 pb-3 border-b border-gold/20">
              <div className="flex items-center justify-between gap-2">
                <div className="sm:hidden">
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-xs text-gold-lighter font-semibold px-3 py-1.5 rounded-md bg-primary/40 border border-gold/30 ml-auto"
                >
                  <User className="w-3.5 h-3.5 text-gold-light" />
                  <span>{t('account')}</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  whileTap={{ y: -2, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/schedule" className="w-full block">
                    <Button variant="gold" size="sm" className="w-full text-xs font-bold uppercase whitespace-nowrap">
                      <Flame className="w-3.5 h-3.5 mr-1 shrink-0" />
                      <span className="whitespace-nowrap">{t('bookSeva')}</span>
                    </Button>
                  </Link>
                </motion.div>
                <Link href="/live" className="w-full block">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase border-red-500/60 text-red-300">
                    <Radio className="w-3.5 h-3.5 mr-1 text-red-400 shrink-0" />
                    <span className="whitespace-nowrap">{t('live')}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Nav Links List */}
            <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto pt-1">
              {mainNavigation.map((item) => {
                const isActive = isNavActive(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-primary text-gold-lighter font-bold border border-gold/40 shadow-gold-sm'
                        : 'text-ivory/90 hover:bg-white/5 hover:text-gold-light'
                    }`}
                  >
                    <span>{t(item.key)}</span>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-600/80 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
