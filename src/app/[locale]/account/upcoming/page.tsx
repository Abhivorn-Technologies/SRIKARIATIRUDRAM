'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link } from '@/i18n/routing';
import { Calendar, RefreshCw, Flame } from 'lucide-react';
import { bookingService } from '@/services/booking.service';

export default function AccountUpcomingPage() {
  const { session } = useDevoteeAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then((json) => {
        let list: any[] = [];
        if (json.success && Array.isArray(json.data?.bookings) && json.data.bookings.length > 0) {
          list = json.data.bookings;
        } else {
          // Fallback to local bookings
          bookingService.getDevoteeBookings().then(localList => {
            if (localList && localList.length > 0) setBookings(localList);
          });
          return;
        }
        setBookings(list);
      })
      .catch(async (err) => {
        console.error('Failed to load upcoming sevas from MongoDB:', err);
        const localList = await bookingService.getDevoteeBookings();
        if (localList && localList.length > 0) setBookings(localList);
      })
      .finally(() => setLoading(false));
  }, [session?.phone]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
                Upcoming Sevas & Darshan Schedule ({bookings.length})
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70">
                Your confirmed pujas scheduled for the upcoming Yajna days in MongoDB
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
              <p className="text-xs text-gold-light">Loading Upcoming Sevas from MongoDB...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <DevoteeBookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center space-y-3 bg-[#1A0004] border-gold/20">
              <Calendar className="w-12 h-12 text-gold/40 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-gold-light">No Upcoming Sevas Found</h3>
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
