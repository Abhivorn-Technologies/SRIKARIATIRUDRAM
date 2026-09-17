'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { Heart, RefreshCw, Download } from 'lucide-react';

export default function AccountDonationsPage() {
  const { session } = useDevoteeAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.donations) {
          setDonations(json.data.donations);
        }
      })
      .catch((err) => console.error('Failed to load donations from MongoDB:', err))
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
                Donation History & Receipts ({donations.length})
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70">
                Track your auspicious contributions from MongoDB matching mobile number {session?.phone || 'your account'}
              </p>
            </div>
            <Link href="/donate">
              <Button variant="gold" size="sm" className="font-bold">
                <Heart className="w-3.5 h-3.5 mr-1" /> Donate
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Loading Donations from MongoDB...</p>
            </div>
          ) : donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((d: any) => (
                <Card key={d.id} variant="sacred" className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                        {d.id} • {d.date}
                      </span>
                      <h4 className="font-cinzel text-base font-bold text-ivory mt-0.5">
                        {d.purposeLabel}
                      </h4>
                    </div>
                    <Badge variant="success" size="sm">COMPLETED</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-ivory/60 block">Receipt No:</span>
                      <strong className="font-mono text-gold-light">{d.receiptNumber}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-ivory/60 block">Amount Contributed</span>
                      <span className="font-cinzel text-xl font-black text-gold">{formatCurrency(d.amount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gold/15 flex justify-end">
                    <Link href="/donate">
                      <Button variant="outline" size="sm" className="text-xs border-gold/40 text-gold" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        Download Certificate
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center space-y-3 bg-[#1A0004] border-gold/20">
              <Heart className="w-12 h-12 text-gold/40 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-gold-light">No Donations Found</h3>
              <p className="text-xs text-ivory/70 max-w-sm mx-auto">
                General Yajna donations and Goseva contributions associated with {session?.phone || 'your phone number'} will appear here.
              </p>
              <Link href="/donate">
                <Button variant="gold" size="sm" className="font-bold text-xs">
                  Make a Donation
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
