'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, HeartHandshake, RefreshCw } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  title?: string;
  category: string;
  amount?: number;
  contact_person?: string;
  phone?: string;
  active: boolean;
}

export function SponsorGrid() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const t = useTranslations('sponsors');

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetch('/api/sponsors', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setSponsors(json.data);
        }
      } catch (err) {
        console.error('Failed to load dynamic sponsors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSponsors();
  }, []);

  const grandSponsors = sponsors.filter((s) => s.category === 'MAHAYAJNA' || !s.category);
  const otherSponsors = sponsors.filter((s) => s.category !== 'MAHAYAJNA' && s.category);

  if (loading && sponsors.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-gold animate-spin mx-auto mb-3" />
        <p className="text-sm text-ivory/70 font-sans">Loading devout Yajna patrons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Grand Patrons */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gold/30 pb-3">
          <Award className="w-6 h-6 text-gold fill-gold" />
          <h2 className="font-cinzel text-xl md:text-2xl font-black text-gold-lighter uppercase tracking-wider">
            {t('diamond')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(grandSponsors.length > 0 ? grandSponsors : sponsors).map((sp) => (
            <Card key={sp.id} variant="gold-border" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm">
                  {sp.title || 'Maha Poshaka (Grand Sponsor)'}
                </Badge>
                {sp.amount ? (
                  <span className="text-xs text-gold-light font-bold">
                    ₹{Number(sp.amount).toLocaleString('en-IN')}
                  </span>
                ) : null}
              </div>
              <h3 className="font-cinzel text-lg md:text-xl font-bold text-ivory">
                {sp.name}
              </h3>
              {sp.contact_person && (
                <p className="text-xs sm:text-sm text-ivory/70 font-sans leading-relaxed">
                  Patron: {sp.contact_person}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Patrons */}
      {otherSponsors.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gold/30 pb-3">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg md:text-xl font-bold text-gold-lighter uppercase tracking-wider">
              {t('gold')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherSponsors.map((sp) => (
              <Card key={sp.id} variant="sacred" className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="maroon" size="sm">
                    {sp.title || 'Poshaka Patron'}
                  </Badge>
                  {sp.amount ? (
                    <span className="text-xs text-gold-light font-bold">
                      ₹{Number(sp.amount).toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </div>
                <h4 className="font-cinzel text-base font-bold text-ivory">
                  {sp.name}
                </h4>
                {sp.contact_person && (
                  <p className="text-xs text-ivory/75 font-sans">
                    Patron: {sp.contact_person}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

