import { bookingService } from '@/services/booking.service';
import { DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Calendar } from 'lucide-react';

export default async function AccountUpcomingPage() {
  const bookings = await bookingService.getDevoteeBookings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="border-b border-gold/20 pb-4">
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
              Upcoming Sevas & Darshan Schedule
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Your confirmed pujas scheduled for the upcoming Yajna days
            </p>
          </div>

          <div className="space-y-4">
            {bookings.slice(0, 1).map((booking) => (
              <DevoteeBookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
