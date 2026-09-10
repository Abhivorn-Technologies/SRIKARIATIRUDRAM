'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, Flame, Users, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { scheduleList } from '@/data/schedule';

export default function AdminTodayProgrammePage() {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const currentDay = scheduleList.find((d) => d.dayNumber === activeDayNumber) || scheduleList[0];
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              REAL-TIME CEREMONIAL DESK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-gold" />
            Today&apos;s Programme Manager
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Update live timings, ongoing Yagnam rituals, chief guest honors, and priest batches for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeDayNumber}
            onChange={(e) => setActiveDayNumber(Number(e.target.value))}
            className="px-3 py-2 text-xs rounded-lg bg-burgundy-dark border border-gold/40 text-ivory font-cinzel outline-none"
          >
            {scheduleList.map((d) => (
              <option key={d.dayNumber} value={d.dayNumber}>
                Day {String(d.dayNumber).padStart(2, '0')} — {d.nakshatra} ({d.date})
              </option>
            ))}
          </select>

          <Button
            onClick={handleSave}
            variant="gold"
            size="sm"
            className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm"
          >
            <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
            Update Today
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Today&apos;s programme details successfully broadcasted!</span>
        </div>
      )}

      {/* Day Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Current Day & Nakshatra</span>
          <h3 className="text-xl font-black text-ivory">Day {currentDay.dayNumber}: {currentDay.nakshatra}</h3>
          <p className="text-xs text-gold/80">{currentDay.date}</p>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Pradhana Deity & Homam</span>
          <h3 className="text-lg font-bold text-ivory truncate">{currentDay.pradhanaHomam}</h3>
          <p className="text-xs text-gold/80">{currentDay.presidingDeity}</p>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Yagnashala Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-300">Rituals In Progress</span>
          </div>
          <p className="text-xs text-ivory/60">Morning & Evening batches active</p>
        </Card>
      </div>

      {/* Schedule Items Timeline */}
      <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2 border-b border-gold/20 pb-3">
          <Flame className="w-4 h-4 text-gold" />
          Day {currentDay.dayNumber} Ceremonial Sequence & Live Highlights
        </h3>

        <div className="space-y-3">
          {currentDay.programmeTimeline && currentDay.programmeTimeline.length > 0 ? (
            currentDay.programmeTimeline.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-burgundy/60 border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-gold/15 text-gold font-mono text-xs font-bold shrink-0 border border-gold/30">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-ivory">{item.ritual}</h4>
                    <p className="text-[11px] text-ivory/70">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm">Active</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-ivory/60 font-sans">
              Schedule details automatically synchronized with master 28-day itinerary.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
