'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FileText, Save, Edit3, CheckCircle2 } from 'lucide-react';

export default function AdminContentPage() {
  const [saved, setSaved] = useState(false);

  const [sections, setSections] = useState([
    {
      id: 'about_intro',
      title: 'About Mahayagnam Significance',
      page: 'About Page',
      lastUpdated: '10 Sep 2026',
      content: 'The Srikari Ati Rudra Mahayagnam is a momentous 28-day Vedic yagnam dedicated to Lord Shiva for universal peace (Loka Kalyanam).',
    },
    {
      id: 'annadanam_appeal',
      title: 'Maha Annadanam Divine Message',
      page: 'Annadanam Page',
      lastUpdated: '08 Sep 2026',
      content: 'Anna Daanam Samam Daanam Na Bhuto Na Bhavishyati. Feeding thousands of devotees and Vedic priests daily throughout the 28 sacred days.',
    },
    {
      id: 'purohit_message',
      title: 'Chief Acharya Vedic Invocation',
      page: 'Home Page',
      lastUpdated: '06 Sep 2026',
      content: 'Chanting of Sri Rudra Prashna 14,641 times across 11 sacred Homam Kundas by 121 Vedic scholars.',
    },
  ]);

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
              EDITORIAL & DEVOTIONAL COPY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-gold" />
            Static Content & Message Editor
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Update Vedic introductions, trust appeal statements, and editorial content displayed across the portal.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="gold"
          size="sm"
          className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Save Content Changes
        </Button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Devotional text and copy changes saved successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <Card key={sec.id} variant="gold-border" className="p-5 bg-burgundy-deep/90 border-gold/30 space-y-3">
            <div className="flex items-center justify-between border-b border-gold/15 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gold-lighter font-cinzel">{sec.title}</h3>
                <span className="text-[10px] text-ivory/50">Location: {sec.page} • Last updated {sec.lastUpdated}</span>
              </div>
              <Badge variant="outline" size="sm" className="text-[10px] border-gold/30 text-gold-light">
                Published
              </Badge>
            </div>

            <textarea
              defaultValue={sec.content}
              rows={3}
              className="w-full p-3 rounded-lg bg-burgundy-dark/90 border border-gold/30 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold outline-none"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
