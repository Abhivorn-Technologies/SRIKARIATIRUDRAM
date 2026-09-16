import { bookingService } from '@/services/booking.service';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountReceiptsPage() {
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
              Consecrated Receipts & Booking Confirmations
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Download your formal booking confirmations and donation receipts
            </p>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <Card key={b.bookingId} variant="sacred" className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-burgundy-deep border border-gold/30 flex items-center justify-center text-gold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-ivory">
                      {b.bookingId} - {b.sevaSlug.replace(/-/g, ' ').toUpperCase()}
                    </h4>
                    <span className="text-xs text-ivory/60">
                      Date: {b.bookingDate} • Amount: {formatCurrency(b.grandTotal)}
                    </span>
                  </div>
                </div>

                <Link href={`/book-seva/receipt/${b.bookingId}`}>
                  <Button variant="outline" size="sm" className="text-xs" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
