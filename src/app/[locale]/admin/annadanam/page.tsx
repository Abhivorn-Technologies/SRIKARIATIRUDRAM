'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Utensils, Heart, Download } from 'lucide-react';

export default function AdminAnnadanamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-gold-lighter flex items-center gap-2">
            <Utensils className="w-5 h-5 text-gold" />
            Maha Annadanam & General Donations Tracker
          </h1>
          <p className="text-xs text-ivory/70 font-sans">
            Monitor daily meals sponsored, donor records, and generate 80G tax receipts.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
          <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
          Download Donor List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-burgundy/80 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel font-bold">Total Meals Sponsored</span>
          <h3 className="text-2xl font-black text-ivory mt-1">5,800 Meals</h3>
        </Card>
        <Card className="p-5 bg-burgundy/80 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel font-bold">Full Day Sponsors</span>
          <h3 className="text-2xl font-black text-ivory mt-1">14 Days</h3>
        </Card>
        <Card className="p-5 bg-burgundy/80 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel font-bold">General Donations</span>
          <h3 className="text-2xl font-black text-ivory mt-1">₹4,25,000</h3>
        </Card>
      </div>
    </div>
  );
}
