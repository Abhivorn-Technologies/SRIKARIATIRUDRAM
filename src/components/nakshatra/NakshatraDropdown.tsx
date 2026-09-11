'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useLocale } from 'next-intl';
import { NAKSHATRAS } from '@/lib/constants';
import { ChevronDown, Check, Star, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NakshatraOption {
  id: string;
  value: string;
  nameEn: string;
  nameTe: string;
  nameHi?: string;
  rasiEn: string;
  rasiTe: string;
  rasiHi?: string;
  dayIndex: number;
  isConcluding?: boolean;
}

export interface NakshatraDropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  className?: string;
  id?: string;
}

const NAKSHATRA_HI_MAP: Record<string, { nameHi: string; rasiHi: string }> = {
  rohini: { nameHi: 'रोहिणी', rasiHi: 'वृषभ' },
  mrigasira: { nameHi: 'मृगशिरा', rasiHi: 'वृषभ / मिथुन' },
  ardra: { nameHi: 'आर्द्रा', rasiHi: 'मिथुन' },
  punarvasu: { nameHi: 'पुनर्वसु', rasiHi: 'मिथुन / कर्क' },
  pushya: { nameHi: 'पुष्य', rasiHi: 'कर्क' },
  ashlesha: { nameHi: 'आश्लेषा', rasiHi: 'कर्क' },
  magha: { nameHi: 'मघा', rasiHi: 'सिंह' },
  'purva-phalguni': { nameHi: 'पूर्वा फाल्गुनी', rasiHi: 'सिंह' },
  'uttara-phalguni': { nameHi: 'उत्तरा फाल्गुनी', rasiHi: 'सिंह / कन्या' },
  hasta: { nameHi: 'हस्त', rasiHi: 'कन्या' },
  chitta: { nameHi: 'चित्रा', rasiHi: 'कन्या / तुला' },
  swathi: { nameHi: 'स्वाती', rasiHi: 'तुला' },
  vishakha: { nameHi: 'विशाखा', rasiHi: 'तुला / वृश्चिक' },
  anuradha: { nameHi: 'अनुराधा', rasiHi: 'वृश्चिक' },
  jyeshta: { nameHi: 'ज्येष्ठा', rasiHi: 'वृश्चिक' },
  moola: { nameHi: 'मूल', rasiHi: 'धनु' },
  purvashada: { nameHi: 'पूर्वाषाढ़ा', rasiHi: 'धनु' },
  uttarashada: { nameHi: 'उत्तराषाढ़ा', rasiHi: 'धनु / मकर' },
  shravana: { nameHi: 'श्रवण', rasiHi: 'मकर' },
  dhanishta: { nameHi: 'धनिष्ठा', rasiHi: 'मकर / कुंभ' },
  sathabhisha: { nameHi: 'शतभिषा', rasiHi: 'कुंभ' },
  'purva-bhadrapada': { nameHi: 'पूर्व भाद्रपदा', rasiHi: 'कुंभ / मीन' },
  'uttara-bhadrapada': { nameHi: 'उत्तर भाद्रपदा', rasiHi: 'मीन' },
  revathi: { nameHi: 'रेवती', rasiHi: 'मीन' },
  krittika: { nameHi: 'कृत्तिका', rasiHi: 'मेष / वृषभ' },
  bharani: { nameHi: 'भरणी', rasiHi: 'मेष' },
  ashwini: { nameHi: 'अश्विनी', rasiHi: 'मेष' },
};

export function NakshatraDropdown({
  value,
  onChange,
  label,
  className,
  id,
}: NakshatraDropdownProps) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const generatedId = useId();
  const selectId = id || `nakshatra-selector-${generatedId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Build the list of all 27 Nakshatras + Day 28 Concluding
  const allOptions: NakshatraOption[] = React.useMemo(() => {
    const list: NakshatraOption[] = NAKSHATRAS.map((n) => {
      const hi = NAKSHATRA_HI_MAP[n.id] || { nameHi: n.nameEn, rasiHi: n.rasiEn };
      return {
        id: n.id,
        value: n.id,
        nameEn: n.nameEn,
        nameTe: n.nameTe,
        nameHi: hi.nameHi,
        rasiEn: n.rasiEn,
        rasiTe: n.rasiTe,
        rasiHi: hi.rasiHi,
        dayIndex: n.dayIndex,
      };
    });

    // Add Day 28 Concluding
    list.push({
      id: '28',
      value: '28',
      nameEn: 'Rohini (Grand Concluding Day)',
      nameTe: 'రోహిణి (మహా ముగింపు దినం)',
      nameHi: 'रोहिणी (भव्य पूर्णाहुति दिवस)',
      rasiEn: 'Vrishabha',
      rasiTe: 'వృషభం',
      rasiHi: 'वृषभ',
      dayIndex: 28,
      isConcluding: true,
    });

    return list;
  }, []);

  // Determine currently selected option
  const selectedOption = React.useMemo(() => {
    const valStr = String(value).toLowerCase().trim();
    if (valStr === '28' || valStr === 'day-28' || valStr === 'rohini-concluding') {
      return allOptions.find((o) => o.id === '28') || allOptions[0];
    }
    const match = allOptions.find(
      (o) =>
        o.id.toLowerCase() === valStr ||
        o.value.toLowerCase() === valStr ||
        o.nameEn.toLowerCase().replace(/[^a-z]/g, '') === valStr.replace(/[^a-z]/g, '') ||
        String(o.dayIndex) === valStr
    );
    return match || allOptions[0];
  }, [value, allOptions]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return allOptions;
    const q = searchQuery.toLowerCase().trim();
    return allOptions.filter((opt) => {
      const dayMatch = `day ${opt.dayIndex}`.includes(q) || `${opt.dayIndex}` === q;
      const enMatch = opt.nameEn.toLowerCase().includes(q) || opt.rasiEn.toLowerCase().includes(q);
      const teMatch = opt.nameTe.toLowerCase().includes(q) || opt.rasiTe.toLowerCase().includes(q);
      const hiMatch = (opt.nameHi && opt.nameHi.toLowerCase().includes(q)) || (opt.rasiHi && opt.rasiHi.toLowerCase().includes(q));
      return dayMatch || enMatch || teMatch || hiMatch;
    });
  }, [allOptions, searchQuery]);

  // Check collision & decide whether to open upward
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 320px below and more space above, open upward
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
      
      // Auto-focus search input if opened
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleSelect = (opt: NakshatraOption) => {
    onChange(opt.id);
    setIsOpen(false);
    setSearchQuery('');
    triggerRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = filteredOptions.findIndex((o) => o.id === selectedOption.id);
        setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(filteredOptions.length - 1);
        break;
    }
  };

  // Format label string
  const formatOptionLabel = (opt: NakshatraOption) => {
    const starName = isTe ? opt.nameTe : isHi ? opt.nameHi || opt.nameEn : opt.nameEn;
    const rasiName = isTe ? opt.rasiTe : isHi ? opt.rasiHi || opt.rasiEn : opt.rasiEn;
    const dayText = isTe ? `${opt.dayIndex}వ రోజు` : isHi ? `दिन ${opt.dayIndex}` : `Day ${opt.dayIndex}`;

    return `${starName} (${rasiName}) — ${dayText}`;
  };

  const selectedDisplayLabel = formatOptionLabel(selectedOption);

  return (
    <div ref={containerRef} className={cn('w-full space-y-1.5 text-left relative', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            'block text-xs font-bold uppercase tracking-wider text-gold font-sans',
            isTe ? 'font-telugu' : isHi ? 'font-hindi' : ''
          )}
        >
          {label}
        </label>
      )}

      {/* Closed Selector Button (Trigger) */}
      <button
        id={selectId}
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${selectId}-listbox`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer outline-none select-none text-left',
          'bg-gradient-to-r from-[#2B0005] via-[#35030A] to-[#2B0005] border border-[#D6A532]/50 text-[#FAF4E6]',
          'hover:border-[#D6A532] hover:shadow-[0_0_12px_rgba(214,165,50,0.25)]',
          'focus:border-[#D6A532] focus:ring-2 focus:ring-[#D6A532]/40',
          isOpen && 'border-[#D6A532] ring-2 ring-[#D6A532]/40 shadow-[0_0_16px_rgba(214,165,50,0.3)]'
        )}
      >
        <span
          className={cn(
            'text-xs sm:text-sm font-semibold truncate tracking-wide text-[#FAF4E6]',
            isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-sans'
          )}
        >
          {selectedDisplayLabel}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D6A532]/20 text-[#F2C14E] border border-[#D6A532]/30 uppercase tracking-wider">
            {isTe ? `${selectedOption.dayIndex}వ రోజు` : isHi ? `दिन ${selectedOption.dayIndex}` : `Day ${selectedOption.dayIndex}`}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-[#D6A532] transition-transform duration-200',
              isOpen && 'rotate-180 text-[#F2C14E]'
            )}
          />
        </div>
      </button>

      {/* Custom Open Dropdown Popover */}
      {isOpen && (
        <div
          id={`${selectId}-listbox`}
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute left-0 right-0 z-50 w-full rounded-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-[#D6A532]',
            'bg-[#230005] text-[#FAF4E6] backdrop-blur-md',
            'animate-in fade-in zoom-in-95 duration-150',
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
        >
          {/* Quick Search Header */}
          <div className="p-1.5 border-b border-[#D6A532]/25 mb-1.5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#D6A532] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={isTe ? 'నక్షత్రం లేదా రోజు వెతకండి...' : isHi ? 'नक्षत्र या दिन खोजें...' : 'Search Nakshatra or Day...'}
                className={cn(
                  'w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-[#170003] border border-[#D6A532]/40 text-[#FAF4E6] placeholder-[#FAF4E6]/75',
                  'focus:outline-none focus:border-[#D6A532] focus:ring-1 focus:ring-[#D6A532]',
                  isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#FAF4E6]/50 hover:text-[#FAF4E6]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <span className="text-[10px] text-[#D6A532] font-semibold px-2 py-0.5 rounded bg-[#D6A532]/10 border border-[#D6A532]/25 shrink-0">
              {filteredOptions.length} / 28
            </span>
          </div>

          {/* Options List with Custom Scrollbar */}
          <div
            ref={listboxRef}
            className="max-h-64 sm:max-h-72 overflow-y-auto space-y-1 pr-1 overscroll-contain"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#D6A532 #1A0004',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#FAF4E6]/60 font-sans">
                {isTe ? 'నక్షత్రాలు కనుగొనబడలేదు' : isHi ? 'कोई नक्षत्र नहीं मिला' : 'No matching Nakshatras found'}
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = selectedOption.id === opt.id;
                const isHighlighted = activeIndex === idx;
                const starName = isTe ? opt.nameTe : isHi ? opt.nameHi || opt.nameEn : opt.nameEn;
                const rasiName = isTe ? opt.rasiTe : isHi ? opt.rasiHi || opt.rasiEn : opt.rasiEn;

                return (
                  <div
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none text-xs sm:text-[13px]',
                      isSelected
                        ? 'bg-gradient-to-r from-[#D6A532]/35 via-[#D6A532]/20 to-transparent text-[#F2C14E] border-l-4 border-[#D6A532] font-bold shadow-xs'
                        : isHighlighted
                        ? 'bg-[#D6A532]/15 text-[#FAF4E6]'
                        : 'text-[#FAF4E6]/90 hover:bg-[#D6A532]/10 hover:text-[#FAF4E6]'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Star
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 transition-colors',
                          isSelected
                            ? 'text-[#F2C14E] fill-[#F2C14E]'
                            : isHighlighted
                            ? 'text-[#D6A532]'
                            : 'text-[#D6A532]/40'
                        )}
                      />

                      <span
                        className={cn(
                          'truncate font-semibold',
                          isSelected ? 'text-[#F2C14E]' : 'text-[#FAF4E6]',
                          isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                        )}
                      >
                        {starName}
                      </span>

                      <span
                        className={cn(
                          'text-[11px] shrink-0',
                          isSelected ? 'text-[#FAF4E6]/80' : 'text-[#FAF4E6]/60',
                          isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                        )}
                      >
                        ({rasiName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'text-[10px] font-black font-cinzel px-2 py-0.5 rounded border',
                          isSelected
                            ? 'bg-[#D6A532] text-[#2B0005] border-[#D6A532]'
                            : 'bg-[#170003] text-[#D6A532] border-[#D6A532]/30'
                        )}
                      >
                        Day {opt.dayIndex}
                      </span>

                      {isSelected && <Check className="w-4 h-4 text-[#F2C14E] stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
