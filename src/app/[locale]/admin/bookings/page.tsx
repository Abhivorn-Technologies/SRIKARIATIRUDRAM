'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList, PlusCircle, Download, Search, CheckCircle2, Clock, Eye, Printer, IndianRupee, Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = [
    {
      id: 'SRK-2026-1082',
      devoteeName: 'K. Venkata Raman & Family',
      phone: '+91 98490 12345',
      gotram: 'Kashyapa',
      nakshatra: 'Rohini',
      dayNumber: 1,
      seva: 'Ekadasa Rudra Abhishekam',
      amount: 5116,
      date: '25 Nov 2026',
      status: 'CONFIRMED',
      paymentMode: 'Online UPI',
      attendingPersonally: 'yes',
    },
    {
      id: 'SRK-2026-1081',
      devoteeName: 'Smt. Lakshmi & S. Murthy',
      phone: '+91 94401 67890',
      gotram: 'Bharadwaja',
      nakshatra: 'Mrigasira',
      dayNumber: 2,
      seva: 'Sarpa Suktam Homam',
      amount: 12116,
      date: '26 Nov 2026',
      status: 'CONFIRMED',
      paymentMode: 'NetBanking',
      attendingPersonally: 'yes',
    },
    {
      id: 'SRK-2026-1080',
      devoteeName: 'R. Anjaneyulu & Sons',
      phone: '+91 98850 44321',
      gotram: 'Gouthama',
      nakshatra: 'Ardra',
      dayNumber: 3,
      seva: 'Chandi Homam',
      amount: 12116,
      date: '27 Nov 2026',
      status: 'CONFIRMED',
      paymentMode: 'Counter Cash',
      attendingPersonally: 'yes',
    },
    {
      id: 'SRK-2026-1079',
      devoteeName: 'G. Viswanatha Sharma',
      phone: '+91 99480 88765',
      gotram: 'Vasishta',
      nakshatra: 'Pushya',
      dayNumber: 5,
      seva: 'Nakshatra Shanthi Sankalpam',
      amount: 10116,
      date: '29 Nov 2026',
      status: 'PENDING',
      paymentMode: 'UPI Verification',
      attendingPersonally: 'no',
    },
    {
      id: 'SRK-2026-1078',
      devoteeName: 'Dr. Srinivas & Geetha',
      phone: '+91 97000 11223',
      gotram: 'Harithasa',
      nakshatra: 'Rohini',
      dayNumber: 1,
      seva: 'Maha Annadanam Sponsor',
      amount: 25000,
      date: '25 Nov 2026',
      status: 'CONFIRMED',
      paymentMode: 'Online UPI',
      attendingPersonally: 'yes',
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.gotram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.seva.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              REGISTRATION & SANKALPAM PASSES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-gold" />
            Seva Bookings CRM
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Search, manage, and verify all online and counter Seva registrations, gotram details, and passes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="text-xs border-gold/40 hover:border-gold">
            <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
            Export CSV
          </Button>
          <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
            New Counter Booking
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Registrations</span>
          <h3 className="text-xl font-black text-ivory mt-1">1,420</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Confirmed Passes</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">1,412</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Pending Verification</span>
          <h3 className="text-xl font-black text-amber-400 mt-1">8</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Attending in Person</span>
          <h3 className="text-xl font-black text-gold mt-1">1,280</h3>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Booking ID, Devotee name, Gotram, phone, or Seva..."
              className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
            />
            <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
          >
            <option value="all">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Booking ID & Date</th>
                <th className="p-3.5">Devotee & Contact</th>
                <th className="p-3.5">Gotram / Nakshatra</th>
                <th className="p-3.5">Seva Offering & Day</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-gold-light">{b.id}</span>
                    <span className="text-[10px] text-ivory/60 block">{b.date}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-ivory">{b.devoteeName}</div>
                    <span className="text-[11px] text-ivory/60 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold/60" /> {b.phone}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-gold-light">{b.gotram}</span>
                    <span className="text-[11px] text-ivory/60 block">{b.nakshatra}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-ivory">{b.seva}</div>
                    <span className="text-[10px] text-gold/80 font-cinzel">Day {String(b.dayNumber).padStart(2, '0')}</span>
                  </td>
                  <td className="p-3.5 text-right font-black text-gold-light text-sm">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    {b.status === 'CONFIRMED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <Link
                      href={`/book-seva/receipt/${b.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-gold/80 hover:text-gold hover:bg-white/5 border border-gold/20 inline-block transition-colors"
                      title="Print / View Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
