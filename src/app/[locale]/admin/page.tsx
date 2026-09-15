'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  Heart,
  MessageSquare,
  Sparkle,
  Phone,
  Mail,
  User,
  Tag,
  Filter
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'28days' | 'special' | 'donations' | 'annadanam' | 'enquiries'>('28days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');

  // Master Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [annadanamList, setAnnadanamList] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashRes, bookingsRes, donationsRes, annadanamRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/dashboard').then((r) => r.json()),
        fetch('/api/admin/bookings?limit=100').then((r) => r.json()),
        fetch('/api/admin/donations').then((r) => r.json()),
        fetch('/api/admin/annadanam').then((r) => r.json()),
        fetch('/api/admin/enquiries').then((r) => r.json())
      ]);

      if (dashRes.success) setMetrics(dashRes.data);
      if (bookingsRes.success) setAllBookings(bookingsRes.data || []);
      if (donationsRes.success) setDonations(donationsRes.data || []);
      if (annadanamRes.success) setAnnadanamList(annadanamRes.data || []);
      if (enquiriesRes.success) setEnquiries(enquiriesRes.data || []);
    } catch (err: any) {
      console.error('Error fetching master admin data:', err);
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  // Filtered lists for each tab based on searchQuery
  const queryLower = searchQuery.toLowerCase().trim();

  // 1. 28-Days Regular Seva Bookings (Day 1 - Day 28)
  const regularBookings = useMemo(() => {
    return allBookings.filter((b: any) => {
      const sevaNameLower = (b.seva_name || '').toLowerCase();
      const isSpecial = sevaNameLower.includes('special') || sevaNameLower.includes('chandi') || sevaNameLower.includes('maharudra');
      if (isSpecial) return false;

      const matchesSearch =
        !queryLower ||
        (b.full_name || '').toLowerCase().includes(queryLower) ||
        (b.phone_number || '').includes(queryLower) ||
        (b.booking_id || '').toLowerCase().includes(queryLower) ||
        (b.gotram || '').toLowerCase().includes(queryLower) ||
        (b.seva_name || '').toLowerCase().includes(queryLower);

      const matchesDay = selectedDayFilter === 'all' || String(b.day_number) === selectedDayFilter;

      return matchesSearch && matchesDay;
    });
  }, [allBookings, queryLower, selectedDayFilter]);

  // 2. Special Seva Bookings
  const specialBookings = useMemo(() => {
    return allBookings.filter((b: any) => {
      const sevaNameLower = (b.seva_name || '').toLowerCase();
      const isSpecial = sevaNameLower.includes('special') || sevaNameLower.includes('chandi') || sevaNameLower.includes('maharudra') || b.seva_id?.includes('special');
      if (!isSpecial) return false;

      return (
        !queryLower ||
        (b.full_name || '').toLowerCase().includes(queryLower) ||
        (b.phone_number || '').includes(queryLower) ||
        (b.booking_id || '').toLowerCase().includes(queryLower) ||
        (b.gotram || '').toLowerCase().includes(queryLower) ||
        (b.seva_name || '').toLowerCase().includes(queryLower)
      );
    });
  }, [allBookings, queryLower]);

  // 3. General Donations & Goseva
  const filteredDonations = useMemo(() => {
    return donations.filter((d: any) => {
      return (
        !queryLower ||
        (d.donor_name || '').toLowerCase().includes(queryLower) ||
        (d.phone || '').includes(queryLower) ||
        (d.purpose || '').toLowerCase().includes(queryLower) ||
        (d.transaction_id || '').toLowerCase().includes(queryLower)
      );
    });
  }, [donations, queryLower]);

  // 4. Annadanam Sponsorships
  const filteredAnnadanam = useMemo(() => {
    return annadanamList.filter((a: any) => {
      return (
        !queryLower ||
        (a.sponsor_name || '').toLowerCase().includes(queryLower) ||
        (a.phone || '').includes(queryLower) ||
        (a.gotram || '').toLowerCase().includes(queryLower) ||
        (a.date || '').includes(queryLower)
      );
    });
  }, [annadanamList, queryLower]);

  // 5. Contact Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e: any) => {
      return (
        !queryLower ||
        (e.name || '').toLowerCase().includes(queryLower) ||
        (e.phone || '').includes(queryLower) ||
        (e.email || '').toLowerCase().includes(queryLower) ||
        (e.message || '').toLowerCase().includes(queryLower)
      );
    });
  }, [enquiries, queryLower]);

  // Calculated totals for metrics display
  const totalRegularCount = allBookings.filter((b) => !(b.seva_name || '').toLowerCase().includes('special')).length;
  const totalSpecialCount = allBookings.filter((b) => (b.seva_name || '').toLowerCase().includes('special')).length;
  const totalDonationsAmount = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#2A0006] via-[#1F0004] to-[#120002] border border-gold/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-[11px] font-cinzel font-bold text-gold tracking-widest uppercase">
              Master Operational Command Center
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory">
            Ati Rudra Mahayagnam Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 mt-1">
            Unified Control Room for 28-Day Sevas, Special Sevas, Donations, Annadanam & Devotee Enquiries
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAllDashboardData}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs px-3 h-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Sync Database
          </Button>

          <Link href="/admin/sankalpam">
            <Button variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10 text-xs px-3 h-8">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Sankalpam List
            </Button>
          </Link>

          <Link href="/admin/bookings">
            <Button size="sm" className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs px-3 h-8">
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              New Booking
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

      {/* Unified Top 5 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. 28 Days Seva Bookings */}
        <Card
          onClick={() => setActiveTab('28days')}
          className={`p-4 cursor-pointer transition-all border ${
            activeTab === '28days'
              ? 'bg-[#330008] border-gold shadow-lg shadow-gold/10 scale-[1.02]'
              : 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
          }`}
        >
          <div className="flex items-center justify-between text-ivory/70">
            <span className="text-[11px] font-cinzel tracking-wider uppercase font-semibold">28-Day Sevas</span>
            <Calendar className="w-4 h-4 text-gold" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-ivory">
              {loading ? '...' : totalRegularCount}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Active Bookings</div>
          </div>
        </Card>

        {/* 2. Special Sevas */}
        <Card
          onClick={() => setActiveTab('special')}
          className={`p-4 cursor-pointer transition-all border ${
            activeTab === 'special'
              ? 'bg-[#330008] border-gold shadow-lg shadow-gold/10 scale-[1.02]'
              : 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
          }`}
        >
          <div className="flex items-center justify-between text-ivory/70">
            <span className="text-[11px] font-cinzel tracking-wider uppercase font-semibold">Special Sevas</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-gold">
              {loading ? '...' : totalSpecialCount}
            </div>
            <div className="text-[10px] text-amber-300 mt-0.5">Special Rituals</div>
          </div>
        </Card>

        {/* 3. General Donations */}
        <Card
          onClick={() => setActiveTab('donations')}
          className={`p-4 cursor-pointer transition-all border ${
            activeTab === 'donations'
              ? 'bg-[#330008] border-gold shadow-lg shadow-gold/10 scale-[1.02]'
              : 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
          }`}
        >
          <div className="flex items-center justify-between text-ivory/70">
            <span className="text-[11px] font-cinzel tracking-wider uppercase font-semibold font-semibold">Donations</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-ivory">
              {loading ? '...' : `₹${totalDonationsAmount.toLocaleString('en-IN')}`}
            </div>
            <div className="text-[10px] text-rose-300 mt-0.5">{donations.length} Donors</div>
          </div>
        </Card>

        {/* 4. Annadanam */}
        <Card
          onClick={() => setActiveTab('annadanam')}
          className={`p-4 cursor-pointer transition-all border ${
            activeTab === 'annadanam'
              ? 'bg-[#330008] border-gold shadow-lg shadow-gold/10 scale-[1.02]'
              : 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
          }`}
        >
          <div className="flex items-center justify-between text-ivory/70">
            <span className="text-[11px] font-cinzel tracking-wider uppercase font-semibold">Annadanam</span>
            <Utensils className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-ivory">
              {loading ? '...' : annadanamList.length}
            </div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Meal Sponsors</div>
          </div>
        </Card>

        {/* 5. Contact Enquiries */}
        <Card
          onClick={() => setActiveTab('enquiries')}
          className={`p-4 cursor-pointer transition-all border ${
            activeTab === 'enquiries'
              ? 'bg-[#330008] border-gold shadow-lg shadow-gold/10 scale-[1.02]'
              : 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
          }`}
        >
          <div className="flex items-center justify-between text-ivory/70">
            <span className="text-[11px] font-cinzel tracking-wider uppercase font-semibold">Enquiries</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-cinzel font-bold text-ivory">
              {loading ? '...' : enquiries.length}
            </div>
            <div className="text-[10px] text-cyan-300 mt-0.5">Devotee Messages</div>
          </div>
        </Card>
      </div>

      {/* Main Command Center Box with Tabs */}
      <Card className="p-5 bg-[#240006]/95 border-gold/25 space-y-5">
        {/* Navigation Tabs Header - CLEAN ALIGNED GRID */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gold/20 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 bg-[#180003] p-1.5 rounded-xl border border-gold/20 flex-1">
            <button
              onClick={() => setActiveTab('28days')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-cinzel font-bold transition-all whitespace-nowrap ${
                activeTab === '28days'
                  ? 'bg-gold text-maroon shadow-md'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>28-Day Sevas ({regularBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('special')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-cinzel font-bold transition-all whitespace-nowrap ${
                activeTab === 'special'
                  ? 'bg-gold text-maroon shadow-md'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Special Sevas ({specialBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-cinzel font-bold transition-all whitespace-nowrap ${
                activeTab === 'donations'
                  ? 'bg-gold text-maroon shadow-md'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span>Donations ({filteredDonations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('annadanam')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-cinzel font-bold transition-all whitespace-nowrap ${
                activeTab === 'annadanam'
                  ? 'bg-gold text-maroon shadow-md'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 shrink-0" />
              <span>Annadanam ({filteredAnnadanam.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-cinzel font-bold transition-all whitespace-nowrap ${
                activeTab === 'enquiries'
                  ? 'bg-gold text-maroon shadow-md'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Enquiries ({filteredEnquiries.length})</span>
            </button>
          </div>

          {/* Quick Search & Links */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
              <Input
                placeholder="Search name, phone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs bg-[#150002] border-gold/30 text-ivory h-9 focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Optional 28-Day Quick Day Selector for Tab 1 */}
        {activeTab === '28days' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-gold/10">
            <span className="text-[11px] font-cinzel text-gold font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter Day:
            </span>
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 transition-colors ${
                selectedDayFilter === 'all'
                  ? 'bg-gold text-maroon font-bold'
                  : 'bg-[#180003] text-ivory/70 hover:text-gold border border-gold/20'
              }`}
            >
              All Days
            </button>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(String(day))}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 transition-colors ${
                  selectedDayFilter === String(day)
                    ? 'bg-gold text-maroon font-bold'
                    : 'bg-[#180003] text-ivory/70 hover:text-gold border border-gold/20'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: 28-DAY SEVA BOOKINGS */}
        {activeTab === '28days' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-ivory">
                  28 Days Seva Bookings Feed
                </h3>
                <p className="text-xs text-ivory/60">
                  Showing regular Mahayagnam Seva bookings across all 28 sacred days
                </p>
              </div>
              <Link href="/admin/bookings">
                <Button size="sm" variant="outline" className="border-gold/30 text-gold text-xs h-8 hover:bg-gold/10">
                  Manage All Bookings <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory">
                <thead>
                  <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider bg-[#180003]">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Devotee Name & Phone</th>
                    <th className="py-3 px-3">Gotram & Nakshatram</th>
                    <th className="py-3 px-3">Seva Offering</th>
                    <th className="py-3 px-3">Date / Day</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {regularBookings.length > 0 ? (
                    regularBookings.map((b: any) => (
                      <tr key={b.id || b.booking_id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gold">{b.booking_id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-ivory">{b.full_name}</div>
                          <div className="text-[11px] text-ivory/50 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gold/70" /> {b.phone_number}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-ivory/90 font-medium">{b.gotram || 'N/A'}</div>
                          <div className="text-[11px] text-gold/80">{b.janma_nakshatra || b.nakshatra}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-ivory/90 max-w-[180px] truncate">
                          {b.seva_name}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="text-ivory/80">{b.selected_date}</div>
                          <Badge variant="outline" className="border-gold/30 text-[10px] text-gold px-1.5 py-0">
                            Day {b.day_number || 1}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gold">
                          ₹{Number(b.amount || 0).toLocaleString('en-IN')}
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
                          <Link href="/admin/bookings">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-gold hover:bg-gold/10">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-ivory/50 italic">
                        {loading ? 'Fetching 28-day bookings...' : 'No 28-day seva bookings match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SPECIAL SEVAS BOOKINGS */}
        {activeTab === 'special' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-ivory">
                  Special Sevas & Yagnam Bookings
                </h3>
                <p className="text-xs text-ivory/60">
                  Special Archana, Chandi Homam, Maharudra & Grand Sevas
                </p>
              </div>
              <Link href="/admin/sevas">
                <Button size="sm" variant="outline" className="border-gold/30 text-gold text-xs h-8 hover:bg-gold/10">
                  Manage Seva Catalog <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory">
                <thead>
                  <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider bg-[#180003]">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Devotee Details</th>
                    <th className="py-3 px-3">Special Seva Title</th>
                    <th className="py-3 px-3">Gotram / Nakshatram</th>
                    <th className="py-3 px-3">Scheduled Date</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {specialBookings.length > 0 ? (
                    specialBookings.map((b: any) => (
                      <tr key={b.id || b.booking_id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gold">{b.booking_id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-ivory">{b.full_name}</div>
                          <div className="text-[11px] text-ivory/50">{b.phone_number}</div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-semibold">
                            {b.seva_name}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-ivory/90">{b.gotram || 'N/A'}</div>
                          <div className="text-[11px] text-gold/80">{b.janma_nakshatra || b.nakshatra}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-ivory/80">
                          {b.selected_date}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gold">
                          ₹{Number(b.amount || 0).toLocaleString('en-IN')}
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
                          <Link href="/admin/bookings">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-gold hover:bg-gold/10">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-ivory/50 italic">
                        {loading ? 'Fetching special seva bookings...' : 'No special seva bookings match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GENERAL DONATIONS & GOSEVA */}
        {activeTab === 'donations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-ivory">
                  General Donations & Goseva Feed
                </h3>
                <p className="text-xs text-ivory/60">
                  Contributions towards Mandir Nirmaan, Goseva, Dravya & Yagnam
                </p>
              </div>
              <Link href="/admin/donations">
                <Button size="sm" variant="outline" className="border-gold/30 text-gold text-xs h-8 hover:bg-gold/10">
                  Full Donations Page <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory">
                <thead>
                  <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider bg-[#180003]">
                    <th className="py-3 px-3">Donation ID</th>
                    <th className="py-3 px-3">Donor Name & Contact</th>
                    <th className="py-3 px-3">Purpose / Category</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredDonations.length > 0 ? (
                    filteredDonations.map((d: any) => (
                      <tr key={d.id || d.donation_id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gold">{d.donation_id || d.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-ivory">{d.donor_name}</div>
                          <div className="text-[11px] text-ivory/50 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gold/70" /> {d.phone || d.email || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="border-rose-500/40 text-rose-300">
                            {d.purpose || 'General Donation'}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gold">
                          ₹{Number(d.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.payment_status === 'SUCCESS'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {d.payment_status === 'SUCCESS' ? 'RECEIVED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-ivory/70 whitespace-nowrap">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-ivory/50 italic">
                        {loading ? 'Fetching donation records...' : 'No general donations match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANNADANAM SPONSORSHIPS */}
        {activeTab === 'annadanam' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-ivory">
                  Annadanam Meal Sponsorships
                </h3>
                <p className="text-xs text-ivory/60">
                  Daily meal sponsors and Prasadam contributions for devotees
                </p>
              </div>
              <Link href="/admin/annadanam">
                <Button size="sm" variant="outline" className="border-gold/30 text-gold text-xs h-8 hover:bg-gold/10">
                  Annadanam Schedule <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory">
                <thead>
                  <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider bg-[#180003]">
                    <th className="py-3 px-3">Date Sponsored</th>
                    <th className="py-3 px-3">Sponsor Name & Phone</th>
                    <th className="py-3 px-3">Gotram</th>
                    <th className="py-3 px-3">Meals / Sponsorship</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredAnnadanam.length > 0 ? (
                    filteredAnnadanam.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-ivory whitespace-nowrap">{a.date}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-ivory">{a.sponsor_name}</div>
                          <div className="text-[11px] text-ivory/50">{a.phone || 'N/A'}</div>
                        </td>
                        <td className="py-3 px-3 text-ivory/80">{a.gotram || 'N/A'}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
                            {a.meal_type || 'Full Day Prasadam'} ({a.meals_count || 100} Meals)
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gold">
                          ₹{Number(a.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              a.payment_status === 'SUCCESS'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {a.payment_status === 'SUCCESS' ? 'CONFIRMED' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-ivory/50 italic">
                        {loading ? 'Fetching Annadanam records...' : 'No Annadanam sponsorships match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-ivory">
                  Devotee Contact Enquiries
                </h3>
                <p className="text-xs text-ivory/60">
                  Incoming questions and messages submitted by devotees via website
                </p>
              </div>
              <Link href="/admin/enquiries">
                <Button size="sm" variant="outline" className="border-gold/30 text-gold text-xs h-8 hover:bg-gold/10">
                  View Full Inbox <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory">
                <thead>
                  <tr className="border-b border-gold/20 text-gold font-cinzel uppercase text-[11px] tracking-wider bg-[#180003]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Devotee Name</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Message</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((e: any) => (
                      <tr key={e.id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-3 text-ivory/70 whitespace-nowrap">
                          {e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-ivory">{e.name}</td>
                        <td className="py-3 px-3">
                          <div className="text-ivory/90">{e.phone}</div>
                          <div className="text-[11px] text-ivory/50">{e.email || ''}</div>
                        </td>
                        <td className="py-3 px-3 text-ivory/80 max-w-xs truncate">{e.message}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              e.status === 'RESOLVED'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {e.status || 'NEW'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link href="/admin/enquiries">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-gold hover:bg-gold/10">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-ivory/50 italic">
                        {loading ? 'Fetching enquiries...' : 'No contact enquiries match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
