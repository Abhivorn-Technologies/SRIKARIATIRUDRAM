'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { FileText, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AccountReceiptsPage() {
  const { session } = useDevoteeAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Failed to load receipts from MongoDB:', err))
      .finally(() => setLoading(false));
  }, [session?.phone]);

  const bookings = data?.bookings || [];
  const donations = data?.donations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="border-b border-gold/20 pb-4">
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
              Official PDF Receipts & Confirmations
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Download your verified booking receipts and donation certificates from MongoDB
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Loading Official Receipts from MongoDB...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-cinzel text-base font-bold text-gold-light">
                Seva Booking Receipts ({bookings.length})
              </h3>

              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((b: any) => (
                    <Card key={b.bookingId} variant="sacred" className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-burgundy-deep border border-gold/30 flex items-center justify-center text-gold shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-cinzel text-sm font-bold text-ivory">
                              {b.bookingId} - {b.sevaName}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                              VERIFIED
                            </span>
                          </div>
                          <span className="text-xs text-ivory/60 block mt-0.5">
                            Yagnam Date: {b.selectedDate} • Amount: {formatCurrency(b.amount)} • Txn Ref: {b.transactionRef}
                          </span>
                        </div>
                      </div>

                      <Link href={`/book-seva/receipt/${b.bookingId}`} className="self-end sm:self-auto">
                        <Button variant="outline" size="sm" className="text-xs border-gold/40 text-gold hover:bg-gold/10" leftIcon={<Download className="w-3.5 h-3.5" />}>
                          Download PDF
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ivory/60 italic">No Seva booking receipts available yet.</p>
              )}

              {donations.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-cinzel text-base font-bold text-gold-light">
                    General Donation Receipts ({donations.length})
                  </h3>
                  {donations.map((d: any) => (
                    <Card key={d.id} variant="sacred" className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-burgundy-deep border border-gold/30 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-cinzel text-sm font-bold text-ivory">
                            {d.receiptNumber} - {d.purposeLabel}
                          </h4>
                          <span className="text-xs text-ivory/60">
                            Date: {d.date} • Amount: {formatCurrency(d.amount)}
                          </span>
                        </div>
                      </div>

                      <Link href="/donate">
                        <Button variant="outline" size="sm" className="text-xs border-gold/40 text-gold">
                          View Details
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
