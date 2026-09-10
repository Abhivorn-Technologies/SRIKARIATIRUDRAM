'use client';

import React from 'react';
import { ConfirmedBooking } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Printer, Download, CheckCircle, Share2, Calendar, Phone, MapPin, Building, ArrowRight, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function ReceiptCard({
  booking,
  onReset,
}: {
  booking: ConfirmedBooking;
  onReset?: () => void;
}) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const text = encodeURIComponent(
      `Om Namah Shivaya! 🙏\n\nI have registered for ${booking.sevaSlug.replace(/-/g, ' ').toUpperCase()} at LOKAKALYANAHITA SRIKARI ATI RUDRA MAHAYAGNAM.\n\nBooking ID: ${booking.bookingId}\nDate: ${booking.date} (${booking.nakshatra || ''})\nDevotee: ${booking.primaryDevotee.fullName}\nGotram: ${booking.primaryDevotee.gotram}\nVenue: Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam\nHelpline: 9490462652`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleAddToCalendar = () => {
    if (typeof window === 'undefined') return;
    const title = encodeURIComponent(`Srikari Ati Rudra Mahayagnam - ${booking.sevaSlug.replace(/-/g, ' ').toUpperCase()}`);
    const details = encodeURIComponent(`Booking ID: ${booking.bookingId}\nSeva: ${booking.sevaSlug}\nDevotee: ${booking.primaryDevotee.fullName}\nGotram: ${booking.primaryDevotee.gotram}\nVenue: Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam`);
    const location = encodeURIComponent('Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam, Behind MLRIT College, Basuragadi, Hyderabad');
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(calUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto bg-sacred-card border-2 border-gold/60 rounded-3xl p-6 sm:p-10 shadow-gold-xl text-ivory space-y-6 print:border-black print:text-black print:bg-white print:shadow-none">
      {/* Header with Sacred ॐ */}
      <div className="text-center pb-6 border-b border-gold/30 space-y-2">
        <div className="w-14 h-14 rounded-full border-2 border-gold mx-auto p-1 flex items-center justify-center bg-burgundy-deep print:border-black print:bg-transparent">
          <span className="font-cinzel text-2xl font-bold text-gold print:text-black">ॐ</span>
        </div>
        <span className="font-cinzel text-xs font-bold text-gold tracking-widest uppercase block print:text-black">
          SRIKARI ATI RUDRAM
        </span>
        <h2 className="font-cinzel text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-wider uppercase print:text-black print:bg-none">
          LOKAKALYANAHITA NAKSHATRA SHANTHI SAHITA
          <br className="hidden sm:inline" /> SRIKARI ATI RUDRA MAHAYAGNAM
        </h2>
        <p className="text-xs text-gold-light/90 font-sans tracking-wide print:text-black">
          Official Seva Sankalpam Registration Receipt
        </p>
      </div>

      {/* Confirmation Status Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-300 print:border-black print:text-black print:bg-transparent">
        <span className="flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Payment Status: <strong className="text-emerald-200 uppercase print:text-black">Confirmed & Blessed</strong></span>
        </span>
        <span className="font-mono font-black text-sm text-gold-light bg-burgundy-deep/80 px-3 py-1 rounded-lg border border-gold/30 print:border-black print:text-black print:bg-transparent">
          Booking ID: {booking.bookingId}
        </span>
      </div>

      {/* Grid: Devotee & Sankalpam Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
        <div className="space-y-1.5 bg-burgundy-deep/70 p-4 rounded-xl border border-gold/25 print:border-black print:bg-transparent">
          <span className="text-[11px] text-gold uppercase font-bold tracking-wider block print:text-black">Primary Devotee</span>
          <span className="font-bold text-ivory text-base block print:text-black">{booking.primaryDevotee.fullName}</span>
          <span className="text-ivory/80 block print:text-black">Mobile: {booking.primaryDevotee.phone}</span>
          <span className="text-ivory/80 block print:text-black">Email: {booking.primaryDevotee.email}</span>
          <span className="text-ivory/80 block print:text-black">Location: {booking.primaryDevotee.city}, {booking.primaryDevotee.country}</span>
          <span className="text-ivory/80 block print:text-black">
            Attending Personally: <strong className="text-gold-light print:text-black">{booking.primaryDevotee.attendingPersonally === 'yes' ? 'Yes' : 'No'}</strong>
          </span>
        </div>

        <div className="space-y-1.5 bg-burgundy-deep/70 p-4 rounded-xl border border-gold/25 print:border-black print:bg-transparent">
          <span className="text-[11px] text-gold uppercase font-bold tracking-wider block print:text-black">Sankalpam & Astrology</span>
          <span className="text-ivory/90 block print:text-black">
            Gotram: <strong className="text-gold-lighter font-semibold print:text-black">{booking.primaryDevotee.gotram}</strong>
          </span>
          <span className="text-ivory/90 block print:text-black">
            Nakshatram: <strong className="text-gold-lighter font-semibold print:text-black">{booking.primaryDevotee.nakshatra}</strong>
          </span>
          {booking.primaryDevotee.rasi && (
            <span className="text-ivory/90 block print:text-black">
              Rasi: <strong className="text-gold-lighter font-semibold print:text-black">{booking.primaryDevotee.rasi}</strong>
            </span>
          )}
          <span className="text-ivory/90 block pt-1 border-t border-gold/15 print:text-black">
            Chanted Names: <strong className="text-ivory font-semibold block text-xs print:text-black">{booking.primaryDevotee.sankalpamNames}</strong>
          </span>
        </div>
      </div>

      {/* Seva & Schedule Details */}
      <div className="p-4 rounded-xl bg-burgundy-deep/80 border border-gold/30 space-y-2.5 text-xs sm:text-sm font-sans print:border-black print:bg-transparent">
        <div className="flex justify-between">
          <span className="text-gold-light print:text-black">Selected Seva:</span>
          <span className="font-bold text-ivory print:text-black">{booking.sevaSlug.replace(/-/g, ' ').toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gold-light print:text-black">Muhurtham Date:</span>
          <span className="font-bold text-ivory print:text-black">
            {booking.date} {booking.nakshatra ? `(${booking.nakshatra})` : ''} {booking.dayNumber ? `• Day ${booking.dayNumber}` : ''}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gold-light print:text-black">Transaction Ref:</span>
          <span className="font-mono text-ivory/80 print:text-black">{booking.transactionRef}</span>
        </div>
      </div>

      {/* Family Members in Sankalpam */}
      {booking.familyMembers && booking.familyMembers.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gold block print:text-black">
            Additional Family Members in Sankalpam ({booking.familyMembers.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            {booking.familyMembers.map((fm, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-primary/40 border border-gold/20 flex items-center justify-between print:border-black print:bg-transparent">
                <div>
                  <span className="font-bold text-ivory block print:text-black">{fm.name}</span>
                  <span className="text-[11px] text-ivory/70 print:text-black">
                    {fm.gotram ? `Gotram: ${fm.gotram}` : ''} {fm.nakshatra ? `• ${fm.nakshatra}` : ''}
                  </span>
                </div>
                {fm.relation && (
                  <span className="text-xs font-semibold text-gold-light bg-burgundy-deep px-2 py-0.5 rounded border border-gold/20 print:border-black print:text-black print:bg-transparent">
                    {fm.relation}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Amount Summary */}
      <div className="pt-4 border-t-2 border-gold/40 flex items-center justify-between print:border-black">
        <div>
          <span className="text-xs text-ivory/70 uppercase tracking-wider font-bold block print:text-black">Total Dakshina Offered</span>
          <span className="text-[11px] text-emerald-400 font-semibold print:text-black">Digital Receipt Verified</span>
        </div>
        <span className="font-cinzel text-2xl sm:text-3xl font-black text-gold print:text-black">
          {formatCurrency(booking.grandTotal)}
        </span>
      </div>

      {/* Official Organizer & Venue Footer */}
      <div className="p-4 rounded-xl bg-burgundy-deep/90 border border-gold/25 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-sans text-ivory/80 print:border-black print:bg-transparent">
        <div className="space-y-0.5">
          <span className="text-gold font-bold uppercase tracking-wider flex items-center gap-1 print:text-black">
            <Building className="w-3.5 h-3.5" /> Organizer
          </span>
          <span className="font-semibold text-ivory block print:text-black">Srikari Seva Samiti</span>
          <span className="text-[10px] text-ivory/60 block print:text-black">in assoc. with Srikari Spiritual NC (USA)</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-gold font-bold uppercase tracking-wider flex items-center gap-1 print:text-black">
            <MapPin className="w-3.5 h-3.5" /> Venue
          </span>
          <span className="font-semibold text-ivory block print:text-black">Sri Hampi Virupaksha Sanchalitha Srikari Devi Alayam</span>
          <span className="text-[10px] text-ivory/60 block print:text-black">Behind MLRIT College, Basuragadi, Hyderabad</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-gold font-bold uppercase tracking-wider flex items-center gap-1 print:text-black">
            <Phone className="w-3.5 h-3.5" /> Contacts & Support
          </span>
          <span className="block print:text-black font-semibold">Primary: 9490462652</span>
          <span className="block print:text-black font-semibold">Secondary: 7569253943</span>
          <span className="block print:text-black text-[10px]">Email: info@srikariatirudram.com</span>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
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
