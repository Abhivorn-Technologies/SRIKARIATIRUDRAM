import { bookingService } from '@/services/booking.service';
import { ReceiptCard } from '@/components/booking/Receipt';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function BookingReceiptPage({
  params: { bookingId },
}: {
  params: { bookingId: string };
}) {
  const booking = await bookingService.getBookingById(bookingId);
  if (!booking) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/book-seva"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Seva Booking
        </Link>
        <Link
          href="/account"
          className="text-xs font-semibold text-ivory/80 hover:text-gold-light"
        >
          Go to Devotee Portal →
        </Link>
      </div>

      <ReceiptCard booking={booking} />
    </div>
  );
}
