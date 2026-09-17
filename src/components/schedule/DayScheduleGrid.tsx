'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ScheduleDay, ProgrammeItem } from '@/types/schedule';
import { DayScheduleCard } from './DayScheduleCard';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Clock,
  Sun,
  Moon,
  CalendarDays,
  Sparkles,
  Info,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

type FilterType = 'all' | 'available' | 'few_slots' | 'fully_booked';
const CARDS_PER_PAGE = 8;

export function DayScheduleGrid({ days }: { days: ScheduleDay[] }) {
  const t = useTranslations('schedule');
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddressCopied, setShowAddressCopied] = useState(false);

  const filterButtons: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: t('filterAll'), count: days.length },
    { id: 'available', label: t('filterAvailable'), count: days.filter((d) => d.status === 'available').length },
    { id: 'few_slots', label: t('filterFewSlots'), count: days.filter((d) => d.status === 'few_slots').length },
    { id: 'fully_booked', label: t('filterFullyBooked'), count: days.filter((d) => d.status === 'fully_booked').length },
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredDays = useMemo(() => {
    return days.filter((d) => {
      // Status filter
      if (activeFilter !== 'all' && d.status !== activeFilter) {
        return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();

      const dayMatch = `day ${d.dayNumber}`.includes(term) || `दिन ${d.dayNumber}`.includes(term) || `దినం ${d.dayNumber}`.includes(term) || d.dayNumber.toString() === term;
      const nakshatraMatch =
        d.nakshatra.toLowerCase().includes(term) ||
        d.nakshatraTe.toLowerCase().includes(term) ||
        (d.nakshatraHi && d.nakshatraHi.toLowerCase().includes(term));
      const dateMatch =
        d.date.toLowerCase().includes(term) ||
        d.dateTe.toLowerCase().includes(term) ||
        (d.dateHi && d.dateHi.toLowerCase().includes(term));
      const homamMatch =
        d.pradhanaHomam.toLowerCase().includes(term) ||
        d.pradhanaHomamTe.toLowerCase().includes(term) ||
        (d.pradhanaHomamHi && d.pradhanaHomamHi.toLowerCase().includes(term));
      const specialSevaMatch =
        (d.specialSeva && d.specialSeva.toLowerCase().includes(term)) ||
        (d.specialSevaTe && d.specialSevaTe.toLowerCase().includes(term)) ||
        (d.specialSevaHi && d.specialSevaHi.toLowerCase().includes(term));
      const rasiMatch =
        d.rasi.toLowerCase().includes(term) ||
        d.rasiTe.toLowerCase().includes(term) ||
        (d.rasiHi && d.rasiHi.toLowerCase().includes(term));
      const sevasMatch =
        d.availableSevas?.some((s) => s.toLowerCase().includes(term)) ||
        (d.sevaSlug && d.sevaSlug.toLowerCase().includes(term));

      return dayMatch || nakshatraMatch || dateMatch || homamMatch || specialSevaMatch || rasiMatch || sevasMatch;
    });
  }, [days, activeFilter, searchTerm]);

  // Total pages calculation (10 cards per page)
  const totalPages = Math.ceil(filteredDays.length / CARDS_PER_PAGE) || 1;

  // Slice cards for current page (10 cards per page)
  const paginatedDays = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredDays.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [filteredDays, currentPage]);

  // Group paginated days into rows of 4
  const dayRows = useMemo(() => {
    const rows: ScheduleDay[][] = [];
    for (let i = 0; i < paginatedDays.length; i += 4) {
      rows.push(paginatedDays.slice(i, i + 4));
    }
    return rows;
  }, [paginatedDays]);

  const handleCopyAddress = () => {
    const fullAddress = `${t('venueName')}, ${t('venueAddress')}, ${t('venueLandmark')}`;
    navigator.clipboard?.writeText(fullAddress);
    setShowAddressCopied(true);
    setTimeout(() => setShowAddressCopied(false), 3000);
  };

  return (
    <div className="space-y-10 pb-28">
      {/* 3. Section Intro Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gold-lighter ${
          isTe ? 'font-telugu leading-[1.4]' : isHi ? 'font-hindi leading-[1.4]' : 'font-cinzel'
        }`}>
          {t('introHeading')}
        </h2>
        <p className={`text-xs sm:text-sm md:text-base text-ivory/80 leading-relaxed ${
          isTe ? 'font-telugu leading-[1.7]' : isHi ? 'font-hindi leading-[1.7]' : 'font-sans'
        }`}>
          {t('introDescription')}
        </p>

        {/* Common Daily Programme Sequence Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-burgundy-dark via-burgundy-deep to-burgundy-dark border border-gold/40 shadow-xl text-left space-y-2">
          <div className={`flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest ${
            isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
          }`}>
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>{t('commonSequenceTitle')}</span>
          </div>
          <p className={`text-xs sm:text-sm text-gold-light/95 leading-relaxed font-medium ${
            isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
          }`}>
            {t('commonSequence')}
          </p>
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mt-4" />
      </div>

      {/* 4 & 5. Filter & Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-burgundy-deep/90 border border-gold/30 shadow-xl backdrop-blur-md">
        {/* Search Input */}
        <div className="w-full lg:w-96 relative">
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 text-xs sm:text-sm bg-burgundy-dark/80 border-gold/40 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold"
          />
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold/70 hover:text-gold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {filterButtons.map((btn) => {
            const isActive = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => handleFilterChange(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep border-gold shadow-gold-sm font-black'
                    : 'bg-burgundy/60 text-ivory/80 border-gold/20 hover:border-gold/50 hover:text-gold-lighter'
                }`}
              >
                <span>{btn.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                    isActive ? 'bg-burgundy-deep text-gold' : 'bg-gold/10 text-gold-light'
                  }`}
                >
                  {btn.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between px-2 text-xs text-ivory/60 font-sans">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-gold-light" />
          Showing Cards <strong className="text-gold-light">{(currentPage - 1) * CARDS_PER_PAGE + 1}–{Math.min(currentPage * CARDS_PER_PAGE, filteredDays.length)}</strong> of {filteredDays.length} (Page {currentPage} of {totalPages})
        </span>
        {(searchTerm || activeFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
              setCurrentPage(1);
            }}
            className="text-gold hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Responsive Grid of Cards for Current Page */}
      <div className="space-y-4 sm:space-y-5">
        {dayRows.map((row, rowIndex) => (
          <motion.div
            key={`row-${currentPage}-${rowIndex}-${row[0]?.dayNumber || 0}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
              delay: rowIndex * 0.1,
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch"
          >
            {row.map((day) => (
              <div key={day.dayNumber} className="h-full">
                <DayScheduleCard day={day} />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* 8 Cards Per Page Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-burgundy-deep/90 border border-gold/30 shadow-xl backdrop-blur-md">
          <span className="text-xs text-ivory/70 font-sans">
            Page <strong className="text-gold font-bold">{currentPage}</strong> of <strong className="text-gold font-bold">{totalPages}</strong> (8 Cards per page)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="border-gold/30 text-gold hover:bg-gold/10 text-xs px-3"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all font-cinzel ${
                  currentPage === pageNum
                    ? 'bg-gold text-burgundy-deep shadow-gold-sm font-black'
                    : 'bg-burgundy/60 text-ivory/80 border border-gold/20 hover:border-gold/50 hover:text-gold-lighter'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="border-gold/30 text-gold hover:bg-gold/10 text-xs px-3"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* 16. Contact & Venue Information on Schedule Page */}
      <Card
        variant="gold-border"
        className="p-6 sm:p-8 bg-gradient-to-r from-burgundy-deep via-burgundy to-burgundy-deep border-gold/40 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className={`flex items-center gap-2 text-gold-light text-xs uppercase tracking-widest font-bold ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
            }`}>
              <MapPin className="w-4 h-4 text-gold" />
              {t('venueTitle')}
            </div>
            <h3 className={`text-xl sm:text-2xl font-black text-ivory ${
              isTe ? 'font-telugu leading-relaxed' : isHi ? 'font-hindi leading-relaxed' : 'font-cinzel'
            }`}>
              {t('venueName')}
            </h3>
            <p className={`text-xs sm:text-sm text-ivory/80 leading-relaxed ${
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            }`}>
              {t('venueAddress')} • <strong className="text-gold-light">{t('venueLandmark')}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-ivory/90 pt-1">
              <a
                href={`tel:${t('primaryPhone')}`}
                className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-light" />
                <span>Primary: {t('primaryPhone')}</span>
              </a>
              <a
                href={`tel:${t('secondaryPhone')}`}
                className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-light" />
                <span>Secondary: {t('secondaryPhone')}</span>
              </a>
              <a
                href={`https://wa.me/91${t('whatsApp')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {t('whatsApp')}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              variant="gold"
              size="md"
              onClick={handleCopyAddress}
              className={`w-full sm:w-auto font-bold uppercase tracking-wider text-xs px-5 py-2.5 ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : ''
              }`}
            >
              <Navigation className="w-3.5 h-3.5 mr-1.5" />
              {showAddressCopied ? (isTe ? 'చిరునామా కాపీ చేయబడింది!' : isHi ? 'पता कॉपी हो गया!' : 'Address Copied!') : t('getDirections')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ProgrammeTimeline({ programme }: { programme: ProgrammeItem[] }) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  return (
    <div className="space-y-6">
      {programme.map((item, index) => {
        const isMorning = item.session === 'morning';

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-4 sm:gap-6 relative pl-4 border-l-2 border-gold/40 pb-6 last:pb-0"
          >
            {/* Dot marker */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-burgundy-deep border-2 border-gold flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
            </div>

            {/* Time & Session badge */}
            <div className="w-28 sm:w-36 shrink-0 space-y-1">
              <span className={`text-xs sm:text-sm font-bold text-gold-light flex items-center gap-1.5 ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {isTe ? item.timeTe : isHi ? (item.timeHi || item.time) : item.time}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/40 text-ivory/80 ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : ''
              }`}>
                {isMorning ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-400" />}
                {isMorning ? (isTe ? 'ఉదయం' : isHi ? 'प्रातः' : 'Morning') : (isTe ? 'సాయంత్రం' : isHi ? 'संध्या' : 'Evening')}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1 bg-sacred-card p-4 rounded-xl border border-gold/25 w-full">
              <h4 className={`text-sm sm:text-base font-bold text-ivory ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
              }`}>
                {isTe ? item.ritualTe : isHi ? (item.ritualHi || item.ritual) : item.ritual}
              </h4>
              <p className={`text-xs sm:text-sm text-ivory/75 leading-relaxed ${
                isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
              }`}>
                {isTe ? item.descriptionTe : isHi ? (item.descriptionHi || item.description) : item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
