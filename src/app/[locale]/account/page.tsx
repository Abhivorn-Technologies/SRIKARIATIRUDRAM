'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { DashboardStatsGrid, DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link } from '@/i18n/routing';
import { Flame, Calendar, ArrowRight, RefreshCw, Smartphone } from 'lucide-react';

export default function DevoteeDashboardPage() {
  const { session, login } = useDevoteeAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');

  const fetchDashboardData = (phone: string) => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Failed to load devotee dashboard from MongoDB:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (session?.phone) {
      fetchDashboardData(session.phone);
    } else {
      fetchDashboardData('');
    }
  }, [session?.phone]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length >= 10) {
      login(phoneInput);
    }
  };

  const profile = data?.profile;
  const stats = data?.stats || {
    totalBookings: 0,
    upcomingSevas: 0,
    donationsCount: 0,
    annadanamDays: 0,
    totalContributed: 0
  };
  const bookings = data?.bookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary via-burgundy-deep to-primary border border-gold/40 shadow-gold-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest block font-sans">
            Devotee Dashboard (Live MongoDB)
          </span>
          <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-lighter mt-1">
            Welcome, {profile?.fullName || session?.fullName || 'Sacred Devotee'}
          </h1>
          <p className="text-xs md:text-sm text-ivory/80 font-sans mt-1">
            Gotram: <strong>{profile?.gotram || 'Not Provided'}</strong> • Janma Star: <strong>{profile?.nakshatra || 'Not Provided'}</strong>{profile?.rasi ? ` (${profile.rasi} Rasi)` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/schedule">
            <Button variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
              <Flame className="w-4 h-4 mr-1.5" /> Book New Seva
            </Button>
          </Link>
        </div>
      </div>

      {!session?.phone && (
        <Card className="p-5 bg-burgundy-deep/90 border-gold/30 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="font-cinzel text-sm font-bold text-gold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Connect Your Mobile Number to View Live Bookings
              </h3>
              <p className="text-xs text-ivory/70">
                Enter your 10-digit mobile number used during Seva booking to instantly load your real MongoDB receipts & Sankalpams.
              </p>
            </div>
            <form onSubmit={handlePhoneSubmit} className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="10-digit Mobile No"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="bg-[#1A0004] border-gold/30 text-xs w-44"
              />
              <Button type="submit" variant="gold" size="sm" className="text-xs font-bold shrink-0">
                Load Data
              </Button>
            </form>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Key Stats */}
          {loading ? (
            <div className="p-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Fetching real-time records from MongoDB...</p>
            </div>
          ) : (
            <>
              <DashboardStatsGrid stats={stats} />

              {/* Recent Seva Bookings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-xl font-bold text-gold-lighter">
                    Recent Seva Bookings & Sankalpams ({bookings.length})
                  </h3>
                  <Link href="/account/bookings" className="text-xs font-semibold text-gold-light hover:text-gold flex items-center gap-1">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <DevoteeBookingCard key={booking.bookingId} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center space-y-3 bg-[#1A0004] border-gold/20">
                    <Calendar className="w-10 h-10 text-gold/40 mx-auto" />
                    <h4 className="font-cinzel text-base font-bold text-gold-light">No Seva Bookings Found</h4>
                    <p className="text-xs text-ivory/70 max-w-sm mx-auto">
                      Bookings registered with mobile number {session?.phone || 'your phone'} will appear here automatically with PDF receipts.
                    </p>
                    <Link href="/schedule">
                      <Button variant="gold" size="sm" className="font-bold text-xs">
                        Book Your Seva Now
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
