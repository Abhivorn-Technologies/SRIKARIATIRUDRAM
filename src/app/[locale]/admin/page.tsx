'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Link } from '@/i18n/routing';
import {
  Flame,
  Calendar,
  IndianRupee,
  Users,
  Utensils,
  Printer,
  PlusCircle,
  Video,
  ArrowUpRight,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { scheduleList } from '@/data/schedule';

export default function AdminDashboardPage() {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample recent bookings
  const recentBookings = [
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
      paymentMode: 'UPI / Online',
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
      paymentMode: 'Online NetBanking',
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
      paymentMode: 'Awaiting Verification',
    },
    {
      id: 'SRK-2026-1078',
      devoteeName: 'Dr. Srinivas & Geetha',
      phone: '+91 97000 11223',
      gotram: 'Harithasa',
      nakshatra: 'Rohini',
      dayNumber: 1,
      seva: 'Maha Annadanam Sponsor (1 Day)',
      amount: 25000,
      date: '25 Nov 2026',
      status: 'CONFIRMED',
      paymentMode: 'Online UPI',
    },
  ];

  const filteredBookings = recentBookings.filter((b) => {
    if (selectedDayFilter !== 'all' && b.dayNumber.toString() !== selectedDayFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.id.toLowerCase().includes(q) ||
        b.devoteeName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.gotram.toLowerCase().includes(q) ||
        b.nakshatra.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-cinzel font-bold tracking-widest text-gold">
              Srikari Ati Rudram Control Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-xs text-ivory/60">25 Nov – 22 Dec 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/sankalpam">
            <Button variant="outline" size="sm" className="text-xs border-gold/40 hover:border-gold">
              <Printer className="w-3.5 h-3.5 mr-1.5 text-gold" />
              Print Today&apos;s Sankalpam
            </Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
              New Counter Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-5 bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep border-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold-light font-cinzel font-bold uppercase tracking-wider">
              Total Collections
            </span>
            <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ivory font-cinzel">₹28,45,000</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this week
            </p>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep border-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold-light font-cinzel font-bold uppercase tracking-wider">
              Registered Sankalpams
            </span>
            <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ivory font-cinzel">1,420 Devotees</h3>
            <p className="text-[11px] text-gold-light/70 font-sans">
              Across 28 Days (27 Nakshatras)
            </p>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep border-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold-light font-cinzel font-bold uppercase tracking-wider">
              Annadanam Meals
            </span>
            <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ivory font-cinzel">5,800 Meals</h3>
            <p className="text-[11px] text-emerald-400 font-sans">
              14 Full Days Fully Sponsored
            </p>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy-deep via-burgundy to-burgundy-deep border-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold-light font-cinzel font-bold uppercase tracking-wider">
              Slot Occupancy
            </span>
            <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ivory font-cinzel">82% Booked</h3>
            <p className="text-[11px] text-amber-300 font-sans">
              Few slots left on 6 Special Days
            </p>
          </div>
        </Card>
      </div>

      {/* 28-Day Schedule Slot Quick Monitor */}
      <Card variant="gold-border" className="p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/20 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-gold-lighter flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              28-Day Schedule & Slot Capacity Monitor
            </h3>
            <p className="text-xs text-ivory/70 font-sans">
              Real-time slot status for each Nakshatra of the Mahayagnam
            </p>
          </div>
          <Link href="/admin/schedule">
            <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
              Manage Slots & Capacity →
            </Button>
          </Link>
        </div>

        {/* 28 Days Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
          {scheduleList.slice(0, 28).map((day) => {
            const isFull = day.status === 'fully_booked';
            const isFew = day.status === 'few_slots';

            return (
              <div
                key={day.dayNumber}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isFull
                    ? 'bg-rose-950/40 border-rose-500/30'
                    : isFew
                    ? 'bg-amber-950/40 border-amber-500/30'
                    : 'bg-burgundy/60 border-gold/20 hover:border-gold/50'
                }`}
              >
                <div className="text-[10px] font-bold text-gold/80 font-cinzel">
                  Day {String(day.dayNumber).padStart(2, '0')}
                </div>
                <div className="text-xs font-semibold text-ivory truncate mt-0.5">
                  {day.nakshatra}
                </div>
                <div className="text-[9px] text-ivory/60 truncate">
                  {day.date.split(' ')[0]} {day.date.split(' ')[1]}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isFull
                        ? 'bg-rose-500/20 text-rose-300'
                        : isFew
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isFull ? 'Full' : isFew ? 'Few Slots' : 'Available'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Devotee Bookings CRM */}
      <Card variant="gold-border" className="p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-gold-lighter flex items-center gap-2">
              <Flame className="w-4 h-4 text-gold" />
              Recent Seva Bookings & Sankalpams
            </h3>
            <p className="text-xs text-ivory/70 font-sans">
              Latest incoming online and counter registrations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search name, gotram, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
              />
              <Search className="w-3.5 h-3.5 text-gold absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <select
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory focus:border-gold outline-none"
            >
              <option value="all">All 28 Days</option>
              {Array.from({ length: 28 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/20 text-gold-light uppercase text-[10px] font-cinzel font-bold tracking-wider">
                <th className="py-2.5 px-3">Booking Ref</th>
                <th className="py-2.5 px-3">Devotee & Gotram</th>
                <th className="py-2.5 px-3">Day & Nakshatra</th>
                <th className="py-2.5 px-3">Seva Details</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-gold">
                    {b.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-ivory">{b.devoteeName}</div>
                    <div className="text-[11px] text-ivory/60">
                      Gotram: <span className="text-gold-light">{b.gotram}</span> • {b.phone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-ivory">Day {b.dayNumber}</div>
                    <div className="text-[11px] text-gold-light">{b.nakshatra} ({b.date})</div>
                  </td>
                  <td className="py-3 px-3 text-ivory/90 max-w-[200px] truncate">
                    {b.seva}
                  </td>
                  <td className="py-3 px-3 font-semibold text-gold-light">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.status === 'CONFIRMED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-gold hover:text-gold-lighter underline text-xs font-semibold">
                      Details
                    </button>
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
