import { devoteeService } from '@/services/devotee.service';
import { bookingService } from '@/services/booking.service';
import { DashboardStatsGrid, DevoteeBookingCard } from '@/components/account/DashboardStats';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Flame, Calendar, ArrowRight } from 'lucide-react';

export default async function DevoteeDashboardPage() {
  const stats = await devoteeService.getStats();
  const bookings = await bookingService.getDevoteeBookings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary via-burgundy-deep to-primary border border-gold/40 shadow-gold-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest block font-sans">
            Devotee Dashboard
          </span>
          <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-lighter mt-1">
            Welcome, Sri K. Satyanarayana Sharma
          </h1>
          <p className="text-xs md:text-sm text-ivory/80 font-sans mt-1">
            Gotram: <strong>Bharadwaja</strong> • Janma Star: <strong>Arudra</strong> (Mithuna Rasi)
          </p>
        </div>

        <Link href="/book-seva">
          <Button variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
            <Flame className="w-4 h-4 mr-1.5" /> Book New Seva
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Key Stats */}
          <DashboardStatsGrid stats={stats} />

          {/* Recent Seva Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-bold text-gold-lighter">
                Recent Seva Bookings & Sankalpams
              </h3>
              <Link href="/account/bookings" className="text-xs font-semibold text-gold-light hover:text-gold flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
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
    </div>
  );
}
