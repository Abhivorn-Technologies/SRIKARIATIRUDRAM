import { bookingService } from '@/services/booking.service';
import { DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Flame } from 'lucide-react';

export default async function AccountBookingsPage() {
  const bookings = await bookingService.getDevoteeBookings();

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
                My Seva Bookings
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70 font-sans">
                Review your active and completed Yajna seva records
              </p>
            </div>

            <Link href="/book-seva">
              <Button variant="gold" size="sm" className="font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 mr-1.5" /> Book New Seva
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <DevoteeBookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
