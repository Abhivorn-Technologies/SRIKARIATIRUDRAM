'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { Utensils, RefreshCw } from 'lucide-react';

export default function AccountAnnadanamPage() {
  const { session } = useDevoteeAuth();
  const [annadanam, setAnnadanam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.annadanam) {
          setAnnadanam(json.data.annadanam);
        }
      })
      .catch((err) => console.error('Failed to load Annadanam records from MongoDB:', err))
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
                My Annadanam Sponsorships ({annadanam.length})
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70">
                Tracking your daily meal offerings from MongoDB matching mobile number {session?.phone || 'your account'}
              </p>
            </div>
            <Link href="/annadanam">
              <Button variant="gold" size="sm" className="font-bold">
                <Utensils className="w-3.5 h-3.5 mr-1" /> Sponsor Annadanam
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Loading Annadanam Sponsorships from MongoDB...</p>
            </div>
          ) : annadanam.length > 0 ? (
            <div className="space-y-4">
              {annadanam.map((s: any) => (
                <Card key={s.id} variant="sacred" className="p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                        {s.id}
                      </span>
                      <h4 className="font-cinzel text-base font-bold text-ivory mt-0.5">
                        {s.tier === 'morning' ? 'Morning Maha Prasadam Seva' : 'Full Day Annadanam Sponsorship'}
                      </h4>
                    </div>
                    <Badge variant="success" size="sm">CONFIRMED</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-ivory/60 block">Auspicious Date:</span>
                      <strong className="text-ivory">{s.date}</strong>
                    </div>
                    <div>
                      <span className="text-ivory/60 block">In Memory / Name Of:</span>
                      <strong className="text-gold-light">{s.inMemoryOf || s.sponsorName || 'Family Prosperity'}</strong>
                    </div>
                    <div>
                      <span className="text-ivory/60 block">Meals Provided:</span>
                      <strong className="text-emerald-400">~{(s.mealsServed || 1000).toLocaleString()} Devotees</strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center space-y-3 bg-[#1A0004] border-gold/20">
              <Utensils className="w-12 h-12 text-gold/40 mx-auto" />
              <h3 className="font-cinzel text-lg font-bold text-gold-light">No Annadanam Sponsorships Found</h3>
              <p className="text-xs text-ivory/70 max-w-sm mx-auto">
                Annadanam meal sponsorships associated with {session?.phone || 'your mobile number'} will appear here.
              </p>
              <Link href="/annadanam">
                <Button variant="gold" size="sm" className="font-bold text-xs">
                  Sponsor Annadanam Now
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
