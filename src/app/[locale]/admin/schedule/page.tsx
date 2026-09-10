'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Save, Sparkles } from 'lucide-react';
import { scheduleList } from '@/data/schedule';

export default function AdminSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-gold-lighter flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            28-Day Schedule & Slot Capacity Manager
          </h1>
          <p className="text-xs text-ivory/70 font-sans">
            Adjust slot availability, limits, and pricing for each Nakshatra of the Mahayagnam.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
          <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scheduleList.map((day) => (
          <Card key={day.dayNumber} className="p-4 bg-burgundy/80 border-gold/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold text-gold">
                Day {String(day.dayNumber).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-ivory/60">{day.date}</span>
            </div>

            <div>
              <h4 className="font-bold text-ivory text-sm">{day.nakshatra}</h4>
              <p className="text-[11px] text-gold-light/80 truncate">{day.pradhanaHomam}</p>
            </div>

            <div className="pt-2 border-t border-gold/15 flex items-center justify-between">
              <select
                defaultValue={day.status}
                className="text-xs px-2 py-1 rounded bg-burgundy-dark border border-gold/30 text-ivory outline-none"
              >
                <option value="available">Available</option>
                <option value="few_slots">Few Slots</option>
                <option value="fully_booked">Fully Booked</option>
              </select>
              <span className="text-xs font-semibold text-gold-light">
                {day.price ? `₹${day.price.toLocaleString('en-IN')}` : 'Free'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
