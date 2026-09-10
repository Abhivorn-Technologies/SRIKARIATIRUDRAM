import { bookingService } from '@/services/booking.service';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { ReceiptCard } from '@/components/booking/Receipt';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function AccountBookingDetailPage({
  params: { bookingId },
}: {
  params: { bookingId: string };
}) {
  const booking = await bookingService.getBookingById(bookingId);
  if (!booking) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <Link
            href="/account/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Bookings
          </Link>

          <ReceiptCard booking={booking} />
        </div>
      </div>
    </div>
  );
}
