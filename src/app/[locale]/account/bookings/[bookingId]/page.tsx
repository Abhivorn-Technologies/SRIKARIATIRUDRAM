import { bookingService } from '@/services/booking.service';
import { bookingServerService } from '@/services/server/booking.server.service';
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
  let booking: any = null;

  try {
    const serverBooking = await bookingServerService.getBookingById(bookingId);
    if (serverBooking) {
      booking = {
        bookingId: serverBooking.booking_id,
        bookingDate: typeof serverBooking.created_at === 'string'
          ? serverBooking.created_at.split('T')[0]
          : new Date(serverBooking.created_at || Date.now()).toISOString().split('T')[0],
        status: serverBooking.booking_status?.toLowerCase() || 'confirmed',
        paymentStatus: serverBooking.payment_status || 'CONFIRMED',
        transactionRef: serverBooking.transaction_id || `TXN${Date.now().toString().slice(-10)}`,
        transactionId: serverBooking.transaction_id || '',
        sevaId: serverBooking.seva_id,
        sevaSlug: serverBooking.seva_id,
        sevaName: serverBooking.seva_name,
        amount: serverBooking.amount,
        selectedDate: serverBooking.selected_date,
        date: serverBooking.selected_date,
        dayNumber: serverBooking.day_number || 1,
        nakshatra: serverBooking.nakshatra || 'Rohini',
        rasi: serverBooking.rasi || '',
        timeSlot: serverBooking.time_slot || '08:30 AM – 12:00 PM',
        devoteeParticipation: serverBooking.attending_personally === 'no' ? 'not-attending' : 'attending',
        primaryDevotee: {
          fullName: serverBooking.full_name,
          gotram: serverBooking.gotram || 'Not Provided',
          nakshatra: serverBooking.janma_nakshatra || serverBooking.nakshatra || 'Not Provided',
          sankalpamNames: serverBooking.sankalpam_names || serverBooking.full_name,
          phone: serverBooking.phone_number,
          email: serverBooking.email || '',
          city: serverBooking.city || 'Hyderabad',
          country: serverBooking.country || 'India',
          attendingPersonally: serverBooking.attending_personally === 'no' ? 'no' : 'yes',
          rasi: serverBooking.rasi || '',
          address: serverBooking.address || '',
        },
        familyMembers: serverBooking.family_members || [],
        deliveryOption: serverBooking.delivery_option || 'postal_courier',
        paymentMethod: serverBooking.payment_method || 'upi',
        totalDakshina: serverBooking.amount,
        convenienceFee: 0,
        grandTotal: serverBooking.amount,
      };
    }
  } catch (err) {
    console.warn('Server MongoDB account booking lookup fallback:', err);
  }

  if (!booking) {
    booking = await bookingService.getBookingById(bookingId);
  }

  if (!booking) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:m-0 print:space-y-0 print:max-w-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 print:hidden no-print">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6 print:col-span-12 print:p-0 print:m-0 print:space-y-0 print:w-full">
          <Link
            href="/account/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold print:hidden no-print"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Bookings
          </Link>

          <ReceiptCard booking={booking} />
        </div>
      </div>
    </div>
  );
}
