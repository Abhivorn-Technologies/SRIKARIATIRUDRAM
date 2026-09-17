'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link } from '@/i18n/routing';
import { Flame, RefreshCw, Calendar } from 'lucide-react';
import { bookingService } from '@/services/booking.service';

export default function AccountBookingsPage() {
  const { session } = useDevoteeAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then(async (json) => {
        let list: any[] = [];
        if (json.success && Array.isArray(json.data?.bookings) && json.data.bookings.length > 0) {
          list = json.data.bookings;
        } else {
          const local = await bookingService.getDevoteeBookings();
          if (local && local.length > 0) list = local;
        }
        setBookings(list);
      })
      .catch(async (err) => {
        console.error('Failed to load bookings from MongoDB:', err);
        const local = await bookingService.getDevoteeBookings();
        if (local && local.length > 0) setBookings(local);
      })
      .finally(() => setLoading(false));
  }, [session?.phone]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
                My Seva Bookings ({bookings.length})
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70 font-sans">
                Live MongoDB records matching mobile number {session?.phone || 'all registered'}
              </p>
            </div>

            <Link href="/book-seva">
              <Button variant="gold" size="sm" className="font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 mr-1.5" /> Book New Seva
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Loading Seva Bookings from MongoDB...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <DevoteeBookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center space-y-3 bg-[#1A0004] border-gold/20">
              <Calendar className="w-12 h-12 text-gold/40 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-gold-light">No Bookings Found</h3>
              <p className="text-xs text-ivory/70 max-w-sm mx-auto">
                No active Seva bookings found for phone number {session?.phone || 'your account'}.
              </p>
              <Link href="/book-seva">
                <Button variant="gold" size="sm" className="font-bold text-xs">
                  Book Your Seva Now
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
