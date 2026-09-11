'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDay, setFilterDay] = useState('all');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
      } else {
        setError(json.error || 'Failed to load dashboard metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const bookingsList = metrics?.recentBookings || [];

  const filteredBookings = bookingsList.filter((b: any) => {
    const matchesSearch =
      (b.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone_number || '').includes(searchQuery) ||
      (b.booking_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.gotram || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay = filterDay === 'all' || String(b.day_number) === filterDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#2A0006] via-[#1F0004] to-[#120002] border border-gold/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-[11px] font-cinzel font-bold text-gold tracking-widest uppercase">
              Live Operations Control
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory">
            Ati Rudra Mahayagnam Portal
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 mt-1">
            25 November – 22 December 2026 (28 Days) • Real-time Supabase Database Sync
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/admin/sankalpam">
            <Button variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Sankalpam List
            </Button>
          </Link>

          <Link href="/admin/bookings">
            <Button size="sm" className="bg-gold text-maroon font-bold hover:bg-gold-light">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              All Bookings
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bookings */}
        <Card className="p-4 sm:p-5 bg-[#240006]/90 border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-ivory/70 tracking-wider uppercase">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-cinzel font-bold text-ivory">
              {loading ? '...' : (metrics?.totalBookings || 0)}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>+{metrics?.todayBookings || 0} today</span>
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-4 sm:p-5 bg-[#240006]/90 border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-ivory/70 tracking-wider uppercase">
              Total Dakshina
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-cinzel font-bold text-gold">
              {loading ? '...' : `₹${(metrics?.totalRevenue || 0).toLocaleString('en-IN')}`}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              ₹{(metrics?.todayRevenue || 0).toLocaleString('en-IN')} today
            </div>
          </div>
        </Card>

        {/* Annadanam Sponsors */}
        <Card className="p-4 sm:p-5 bg-[#240006]/90 border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-ivory/70 tracking-wider uppercase">
              Annadanam Sponsors
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Utensils className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-cinzel font-bold text-ivory">
              {loading ? '...' : (metrics?.annadanamSponsors || 0)}
            </div>
            <div className="text-[11px] text-ivory/60 mt-1">
              ₹{(metrics?.annadanamRevenue || 0).toLocaleString('en-IN')} Raised
            </div>
          </div>
        </Card>

        {/* Available Capacity */}
        <Card className="p-4 sm:p-5 bg-[#240006]/90 border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-ivory/70 tracking-wider uppercase">
              Available Slots
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-cinzel font-bold text-emerald-400">
              {loading ? '...' : (metrics?.availableSlots || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-ivory/60 mt-1">
              {metrics?.bookedSlots || 0} Confirmed slots
            </div>
          </div>
        </Card>
      </div>

      {/* Main Row: Today's Programme Highlight & Seva Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Yajna Programme */}
        <Card className="p-5 bg-[#240006]/90 border-gold/20 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gold/15 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <h3 className="font-cinzel text-base font-bold text-ivory">
                Programme Overview: Day {metrics?.todayProgramme?.day_number || 1}
              </h3>
            </div>
            <Badge variant="outline" className="border-gold/40 text-gold text-xs">
              {metrics?.todayProgramme?.date_display || '25 November 2026'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#1A0004] border border-gold/15">
              <h4 className="text-sm font-bold text-gold font-cinzel">
                {metrics?.todayProgramme?.title || 'Mahayagna Mahotsava Arambham & Rohini Nakshatra Homam'}
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                Nakshatra: <span className="text-ivory font-semibold">{metrics?.todayProgramme?.nakshatra || 'Rohini'}</span> • Day Type: <span className="text-gold font-semibold">{metrics?.todayProgramme?.day_type || 'REGULAR'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#180003] border border-gold/10">
                <span className="text-gold/80 font-semibold block mb-0.5">Morning Rituals:</span>
                <span className="text-ivory/80">{metrics?.todayProgramme?.morning_programme || '06:30 AM Suprabhatam & Rudra Abhishekam'}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#180003] border border-gold/10">
                <span className="text-gold/80 font-semibold block mb-0.5">Special Programme:</span>
                <span className="text-ivory/80">{metrics?.todayProgramme?.special_programme || '08:30 AM Nakshatra Hawan'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/admin/schedule">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light p-0 h-auto text-xs">
                Edit 28-Day Schedule <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/live">
              <Button variant="outline" size="sm" className="border-gold/30 text-gold text-xs hover:bg-gold/10">
                <Video className="w-3.5 h-3.5 mr-1" /> Live Broadcast Settings
              </Button>
            </Link>
          </div>
        </Card>

        {/* Sevas Breakdown */}
        <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-4">
          <div className="flex items-center justify-between border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-ivory">Sevas Popularity</h3>
            <Link href="/admin/sevas" className="text-xs text-gold hover:underline">
              Manage Sevas
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.sevasBreakdown?.length > 0 ? (
              metrics.sevasBreakdown.map((seva: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <p className="font-semibold text-ivory truncate">{seva.name}</p>
                    <p className="text-[11px] text-ivory/50">{seva.count} bookings</p>
                  </div>
                  <span className="font-mono font-bold text-gold shrink-0">
                    ₹{seva.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-ivory/50 italic py-4 text-center">No seva bookings yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Bookings Table with Live Database Data */}
      <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gold/15 pb-4">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-ivory">
              Recent Devotee Registrations
            </h3>
            <p className="text-xs text-ivory/60">
              Real-time feed of devotee bookings across all 28 days
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
              <Input
                placeholder="Search devotee, gotram..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-8"
              />
            </div>

            <Link href="/admin/bookings">
              <Button size="sm" variant="outline" className="border-gold/40 text-gold text-xs h-8">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Devotee Details</th>
                <th className="py-2.5 px-3">Gotram / Nakshatram</th>
                <th className="py-2.5 px-3">Seva Offering</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gold">
                      {b.booking_id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-ivory">{b.full_name}</div>
                      <div className="text-[11px] text-ivory/50">{b.phone_number}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-ivory/90">{b.gotram || 'Not specified'}</div>
                      <div className="text-[11px] text-gold/80">{b.janma_nakshatra || b.nakshatra}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-ivory/90 max-w-[200px] truncate">
                      {b.seva_name}
                    </td>
                    <td className="py-3 px-3 text-ivory/70 whitespace-nowrap">
                      {b.selected_date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gold">
                      ₹{Number(b.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.payment_status === 'SUCCESS'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {b.payment_status === 'SUCCESS' ? 'CONFIRMED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/bookings`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-gold hover:bg-gold/10">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ivory/50 italic">
                    {loading ? 'Loading real bookings from database...' : 'No bookings found matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
