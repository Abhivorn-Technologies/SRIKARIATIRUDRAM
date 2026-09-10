'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Scroll, Printer, Calendar } from 'lucide-react';

export default function AdminSankalpamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-gold-lighter flex items-center gap-2">
            <Scroll className="w-5 h-5 text-gold" />
            Sankalpam / Purohit Daily Desk
          </h1>
          <p className="text-xs text-ivory/70 font-sans">
            Generate and print daily devotee Sankalpam lists for Yagnashala homam rituals.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
          <Printer className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Print Daily Sheet (PDF)
        </Button>
      </div>

      <Card variant="gold-border" className="p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-xs text-gold-light font-semibold">Select Day:</label>
          <select className="px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none">
            {Array.from({ length: 28 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Day {String(i + 1).padStart(2, '0')} — Special Nakshatra Sankalpam
              </option>
            ))}
          </select>
        </div>

        <div className="p-8 text-center text-xs text-ivory/60 font-sans border border-dashed border-gold/20 rounded-xl">
          <p className="text-sm font-semibold text-gold-light mb-1">Priest Chant Registry</p>
          <p>Devotee Names, Gotrams, Nakshatras, and Family details formatted for A4 printing.</p>
        </div>
      </Card>
    </div>
  );
}
