'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Locale, locales, localeNames } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher({ className }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale !== currentLocale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  const currentLabel = localeNames[currentLocale] || 'English';

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left shrink-0 z-50', className)}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-between gap-2 h-[34px] min-w-[110px] px-3 bg-[#2B0005]/95 hover:bg-[#3A0008] backdrop-blur-md border border-[#D6A532]/60 hover:border-[#D6A532] rounded-full text-xs font-semibold text-[#FAF4E6] shadow-[0_0_12px_rgba(214,165,50,0.2)] hover:shadow-[0_0_16px_rgba(214,165,50,0.35)] transition-all duration-200 cursor-pointer focus:outline-none select-none',
          isOpen && 'border-[#D6A532] ring-1 ring-[#D6A532]/50 bg-[#3A0008]'
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" aria-hidden="true" />
          <span
            className={cn(
              'truncate font-medium text-xs',
              currentLocale === 'te' && 'font-telugu text-[12px] leading-normal',
              currentLocale === 'hi' && 'font-hindi text-[12px] leading-normal'
            )}
          >
            {currentLabel}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-[#F2C14E]/80 transition-transform duration-200 shrink-0 ml-1',
            isOpen && 'rotate-180 text-[#F2C14E]'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu - Light Cream Solid Background with Dark Maroon Typography */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 min-w-[145px] w-40 rounded-[14px] bg-[#FAF4E6] border border-[#D6A532]/70 shadow-[0_10px_25px_rgba(0,0,0,0.4),0_0_12px_rgba(214,165,50,0.2)] p-1.5 z-[100] overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            {locales.map((loc) => {
              const isSelected = currentLocale === loc;
              const label = localeNames[loc];

              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={cn(
                    'w-full px-3 py-2 text-xs sm:text-[13px] rounded-lg flex items-center justify-between transition-colors text-left cursor-pointer',
                    loc === 'te' && 'font-telugu text-[13px]',
                    loc === 'hi' && 'font-hindi text-[13px]',
                    isSelected
                      ? 'bg-[#EBD294]/50 text-[#2B0005] font-bold shadow-xs'
                      : 'text-[#3A0008] font-medium hover:bg-[#F0E2C8] hover:text-[#2B0005]'
                  )}
                  role="menuitem"
                >
                  <span className="leading-normal">{label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#8B5E0A] shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

