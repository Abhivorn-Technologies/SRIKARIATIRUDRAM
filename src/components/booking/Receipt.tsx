'use client';

import React from 'react';
import Image from 'next/image';
import { ConfirmedBooking } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Printer,
  CheckCircle,
  Share2,
  Calendar,
  Phone,
  MapPin,
  Building,
  ArrowRight,
  Home,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { sevasList } from '@/data/sevas';

export function ReceiptCard({
  booking,
  onReset,
}: {
  booking: ConfirmedBooking;
  onReset?: () => void;
}) {
  const matchedSeva = sevasList.find(
    (s) => s.slug === booking.sevaSlug || s.id === booking.sevaId
  );
  const sevaTitle = matchedSeva ? matchedSeva.title : booking.sevaSlug.replace(/-/g, ' ').toUpperCase();

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const text = encodeURIComponent(
      `Om Namah Shivaya! 🙏\n\nI have registered for ${sevaTitle} at LOKAKALYANAHITA SRIKARI ATI RUDRA MAHAYAGNAM.\n\nBooking ID: ${booking.bookingId}\nDate: ${booking.date} (${booking.nakshatra || ''})\nDevotee: ${booking.primaryDevotee.fullName}\nGotram: ${booking.primaryDevotee.gotram}\nVenue: Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam\nHelpline: 9490462652`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleAddToCalendar = () => {
    if (typeof window === 'undefined') return;
    const title = encodeURIComponent(`Srikari Ati Rudra Mahayagnam - ${sevaTitle}`);
    const details = encodeURIComponent(
      `Booking ID: ${booking.bookingId}\nSeva: ${sevaTitle}\nDevotee: ${booking.primaryDevotee.fullName}\nGotram: ${booking.primaryDevotee.gotram}\nVenue: Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam`
    );
    const location = encodeURIComponent(
      'Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam, Behind MLRIT College, Basuragadi, Hyderabad'
    );
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(calUrl, '_blank');
  };

  return (
    <div className="w-full max-w-3xl mx-auto print:max-w-none print:w-full print:m-0 print:p-0">
      {/* ============================================================ */}
      {/* RECEIPT MAIN CARD CONTAINER                                  */}
      {/* ============================================================ */}
      <div className="bg-sacred-card border-2 border-gold/60 rounded-3xl p-6 sm:p-8 shadow-gold-xl text-ivory space-y-5 print:bg-white print:text-black print:border-2 print:border-[#8B1E2D] print:rounded-2xl print:p-5 print:shadow-none print:space-y-3.5 print-receipt-document">
        
        {/* ============================================================ */}
        {/* 1. OFFICIAL HEADER & LOGO                                    */}
        {/* ============================================================ */}
        <div className="text-center pb-4 border-b border-gold/30 print:border-[#C99A3D]/60 print:pb-3 space-y-1.5 print-avoid-break">
          {/* Screen-Only Srikari Official Logo */}
          <div className="flex justify-center items-center mb-1 print:hidden">
            <Image
              src="/assets/icons/SRIKARIATI RUDRAM.svg"
              alt="Srikari Ati Rudram"
              width={240}
              height={60}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Dedicated Print/PDF-Only Official Receipt Logo */}
          <div className="print-only-logo mb-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/icons/print%20logo.png"
              alt="Srikari Ati Rudra Mahayagnam"
              className="h-14 sm:h-16 w-auto object-contain mx-auto"
            />
          </div>

          <span className="font-cinzel text-xs sm:text-sm font-bold text-gold tracking-widest uppercase block print:text-[#8B1E2D]">
            SRIKARI ATI RUDRA MAHAYAGNAM
          </span>

          <h2 className="font-cinzel text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-wider uppercase print:text-[#5A0714] print:bg-none">
            LOKAKALYANAHITA NAKSHATRA SHANTHI SAHITA
            <br /> SRIKARI ATI RUDRA MAHAYAGNAM
          </h2>

          <div className="inline-block px-3 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold-light print:bg-[#FAF4E6] print:border-[#C99A3D] print:text-[#5A0714] text-[11px] sm:text-xs font-semibold tracking-wide uppercase font-cinzel">
            SEVA CONFIRMATION / OFFICIAL RECEIPT
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CONFIRMATION STATUS & BOOKING ID BANNER                   */}
        {/* ============================================================ */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-300 print:bg-[#F0FDF4] print:border-[#16A34A] print:text-[#14532D] print:py-2 print:px-3 print-avoid-break">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400 print:text-[#16A34A] shrink-0" />
            <span>PAYMENT STATUS: <span className="uppercase text-emerald-200 print:text-[#14532D]">CONFIRMED</span></span>
          </div>

          <div className="font-mono font-black text-xs sm:text-sm text-gold-light bg-burgundy-deep/80 px-3 py-1 rounded-lg border border-gold/30 print:bg-white print:border-[#C99A3D] print:text-[#5A0714] print:py-0.5">
            BOOKING / RECEIPT NUMBER: {booking.bookingId}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. DEVOTEE & SANKALPAM DETAILS (TWO COLUMNS)                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-sans print:gap-3 print-avoid-break">
          {/* Devotee Information */}
          <div className="space-y-1.5 bg-burgundy-deep/70 p-3.5 sm:p-4 rounded-xl border border-gold/25 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-3">
            <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
              <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                DEVOTEE INFORMATION
              </span>
            </div>
            <div>
              <span className="text-[11px] text-ivory/60 print:text-gray-600 block">Devotee Name:</span>
              <span className="font-bold text-ivory text-sm sm:text-base print:text-[#1A0004] block">
                {booking.primaryDevotee.fullName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Mobile / WhatsApp:</span>
                <span className="font-medium text-ivory/90 print:text-[#1A0004]">{booking.primaryDevotee.phone}</span>
              </div>
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Email:</span>
                <span className="font-medium text-ivory/90 print:text-[#1A0004] truncate block">{booking.primaryDevotee.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Location:</span>
                <span className="font-medium text-ivory/90 print:text-[#1A0004]">
                  {booking.primaryDevotee.city}, {booking.primaryDevotee.country}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Attending In-Person:</span>
                <span className="font-semibold text-gold-light print:text-[#8B1E2D]">
                  {booking.primaryDevotee.attendingPersonally === 'yes' ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Sankalpam Details */}
          <div className="space-y-1.5 bg-burgundy-deep/70 p-3.5 sm:p-4 rounded-xl border border-gold/25 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-3">
            <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
              <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                SANKALPAM DETAILS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Gotram:</span>
                <span className="font-bold text-gold-lighter print:text-[#1A0004] text-xs sm:text-sm">
                  {booking.primaryDevotee.gotram}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Nakshatram:</span>
                <span className="font-bold text-gold-lighter print:text-[#1A0004] text-xs sm:text-sm">
                  {booking.primaryDevotee.nakshatra}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Rasi:</span>
                <span className="font-bold text-gold-lighter print:text-[#1A0004] text-xs sm:text-sm">
                  {booking.primaryDevotee.rasi || '—'}
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-gold/15 print:border-[#D6A532]/30">
              <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Names Chanted in Sankalpam:</span>
              <span className="font-medium text-ivory print:text-[#1A0004] text-xs line-clamp-2 print:line-clamp-none">
                {booking.primaryDevotee.sankalpamNames}
              </span>
            </div>
            {booking.specialPrayers && (
              <div className="pt-1">
                <span className="text-[10.5px] text-ivory/60 print:text-gray-600 block">Special Sankalpam / Prayers:</span>
                <span className="font-normal text-ivory/90 print:text-[#1A0004] text-xs italic">
                  {booking.specialPrayers}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. SEVA & PAYMENT DETAILS (TWO COLUMNS)                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-sans print:gap-3 print-avoid-break">
          {/* Seva & Schedule */}
          <div className="space-y-1.5 bg-burgundy-deep/80 p-3.5 sm:p-4 rounded-xl border border-gold/30 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-3">
            <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
              <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                SEVA & AUSPICIOUS SCHEDULE
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-ivory/70 print:text-gray-600 text-xs">Selected Seva:</span>
              <span className="font-bold text-gold-lighter print:text-[#5A0714] text-right font-cinzel">
                {sevaTitle}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-ivory/70 print:text-gray-600 text-xs">Programme Date:</span>
              <span className="font-semibold text-ivory print:text-[#1A0004] text-right">
                {booking.date}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-ivory/70 print:text-gray-600 text-xs">Nakshatra & Day:</span>
              <span className="font-medium text-ivory/90 print:text-[#1A0004] text-right">
                {booking.nakshatra || 'Rohini'} {booking.dayNumber ? `(Day ${booking.dayNumber} of 28)` : ''}
              </span>
            </div>
          </div>

          {/* Payment & Dakshina Summary */}
          <div className="space-y-1.5 bg-burgundy-deep/80 p-3.5 sm:p-4 rounded-xl border border-gold/30 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-2.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 border-b border-gold/20 print:border-[#D6A532]/40 pb-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold print:bg-[#8B1E2D]" />
                <span className="text-[11px] text-gold uppercase font-bold tracking-wider print:text-[#8B1E2D] font-cinzel">
                  PAYMENT & DAKSHINA DETAILS
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-ivory/70 print:text-gray-600">Payment Status:</span>
                <span className="font-bold text-emerald-400 print:text-[#14532D] uppercase">
                  CONFIRMED & VERIFIED
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-ivory/70 print:text-gray-600">Payment Date:</span>
                <span className="font-semibold text-ivory/90 print:text-[#1A0004]">
                  {booking.bookingDate || booking.date || new Date().toISOString().split('T')[0]}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-ivory/70 print:text-gray-600">Transaction ID / Ref:</span>
                <span className="font-mono text-ivory/90 print:text-[#1A0004] font-bold">
                  {booking.transactionRef || booking.transactionId || 'RAZORPAY_VERIFIED'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-ivory/70 print:text-gray-600">Payment Channel / UPI:</span>
                <span className="font-semibold text-gold-light print:text-[#8B1E2D] uppercase">
                  {booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'UPI / ONLINE GATEWAY'}
                </span>
              </div>
            </div>

            <div className="pt-1.5 mt-1 border-t border-gold/25 print:border-[#D6A532]/40 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ivory/80 print:text-[#5A0714] font-cinzel">
                Total Dakshina:
              </span>
              <span className="font-cinzel text-lg sm:text-xl font-black text-gold print:text-[#8B1E2D]">
                {formatCurrency(booking.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. FAMILY MEMBERS IN SANKALPAM (IF PRESENT)                  */}
        {/* ============================================================ */}
        {booking.familyMembers && booking.familyMembers.length > 0 && (
          <div className="space-y-2 bg-burgundy-deep/60 p-3 sm:p-3.5 rounded-xl border border-gold/20 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-2.5 print-avoid-break">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold print:text-[#8B1E2D] block font-cinzel">
              Additional Family Members in Sankalpam ({booking.familyMembers.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-sans">
              {booking.familyMembers.map((fm, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-primary/40 border border-gold/20 flex items-center justify-between print:bg-white print:border-[#D6A532]/40 print:py-1 print:px-2"
                >
                  <div>
                    <span className="font-bold text-ivory print:text-[#1A0004] block">{fm.name}</span>
                    <span className="text-[10px] text-ivory/70 print:text-gray-600">
                      {fm.gotram ? `Gotram: ${fm.gotram}` : ''} {fm.nakshatra ? `• ${fm.nakshatra}` : ''}
                    </span>
                  </div>
                  {fm.relation && (
                    <span className="text-[10px] font-semibold text-gold-light bg-burgundy-deep px-1.5 py-0.5 rounded border border-gold/20 print:bg-[#FAF4E6] print:border-[#C99A3D] print:text-[#5A0714]">
                      {fm.relation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. VENUE & CONTACT DETAILS                                    */}
        {/* ============================================================ */}
        <div className="p-3.5 rounded-xl bg-burgundy-deep/90 border border-gold/25 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-ivory/85 print:bg-[#FAF7F2] print:border-[#D6A532]/70 print:p-2.5 print-avoid-break">
          {/* Venue Info */}
          <div className="space-y-1">
            <span className="text-gold print:text-[#8B1E2D] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px] font-cinzel">
              <MapPin className="w-3.5 h-3.5 text-gold print:text-[#8B1E2D]" /> YAGNA VENUE
            </span>
            <div className="text-[11px] print:text-[#1A0004] space-y-0.5 leading-snug">
              <span className="font-bold block">Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam</span>
              <span className="block text-ivory/70 print:text-gray-700">Nandanavanam Layout, Behind MLRIT College</span>
              <span className="block text-ivory/70 print:text-gray-700">Basuragadi, Hyderabad, Telangana, India</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 sm:border-l sm:border-gold/20 sm:pl-3 print:border-[#D6A532]/40">
            <span className="text-gold print:text-[#8B1E2D] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px] font-cinzel">
              <Phone className="w-3.5 h-3.5 text-gold print:text-[#8B1E2D]" /> CONTACT & SUPPORT
            </span>
            <div className="text-[11px] print:text-[#1A0004] space-y-0.5 leading-snug">
              <span className="block">
                WhatsApp: <strong className="font-semibold text-ivory print:text-[#1A0004]">9490462652</strong>
              </span>
              <span className="block">
                Secondary: <strong className="font-semibold text-ivory print:text-[#1A0004]">7569253943</strong>
              </span>
              <span className="block">
                Email: <span className="text-ivory/80 print:text-gray-700">info@srikariatirudram.com</span>
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 7. SACRED FOOTER                                             */}
        {/* ============================================================ */}
        <div className="text-center pt-3 border-t border-gold/30 print:border-[#C99A3D]/50 space-y-1 print-avoid-break">
          <div className="font-cinzel text-sm sm:text-base font-bold text-gold print:text-[#8B1E2D] tracking-widest">
            || OM NAMAH SHIVAYA ||
          </div>
          <div className="text-[11px] font-medium text-ivory/80 print:text-[#1A0004]">
            <strong>Srikari Seva Samiti</strong>, Hyderabad, India
          </div>
          <div className="text-[10px] text-ivory/60 print:text-gray-600 italic">
            In association with Srikari Spiritual, USA
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. ACTION BUTTONS (SCREEN ONLY - HIDDEN ON PRINT)            */}
      {/* ============================================================ */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-3 print:hidden no-print">
        <Button
          variant="gold"
          size="md"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
          className="font-bold uppercase tracking-wider shadow-gold-sm text-xs sm:text-sm"
        >
          Download / Print Receipt
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={handleShareWhatsApp}
          leftIcon={<Share2 className="w-4 h-4" />}
          className="font-bold uppercase tracking-wider text-xs sm:text-sm"
        >
          Share on WhatsApp
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={handleAddToCalendar}
          leftIcon={<Calendar className="w-4 h-4" />}
          className="font-bold uppercase tracking-wider text-xs sm:text-sm"
        >
          Add to Calendar
        </Button>

        {onReset && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            leftIcon={<ArrowRight className="w-4 h-4" />}
            className="text-xs sm:text-sm text-gold-light hover:text-gold"
          >
            Book Another Seva
          </Button>
        )}

        <Link href="/">
          <Button
            variant="ghost"
            size="md"
            leftIcon={<Home className="w-4 h-4" />}
            className="text-xs sm:text-sm text-ivory/80 hover:text-ivory"
          >
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
