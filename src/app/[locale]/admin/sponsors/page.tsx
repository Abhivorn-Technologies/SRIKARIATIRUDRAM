'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Plus, Download, Search, Edit2, Award, Star } from 'lucide-react';

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([
    {
      id: 1,
      name: 'Sri Sai Ram Infra Developers',
      tier: 'Maha Poshaka (Grand Sponsor)',
      contribution: '₹10,00,000',
      contactPerson: 'Sri M. Raghava Rao',
      phone: '+91 98480 11223',
      bannerActive: true,
      logoUrl: '/assets/sponsors/sponsor1.png',
    },
    {
      id: 2,
      name: 'Kasyapa Granites & Exports',
      tier: 'Raja Poshaka (Principal Sponsor)',
      contribution: '₹5,00,000',
      contactPerson: 'Sri K. Venkata Raman',
      phone: '+91 94401 22334',
      bannerActive: true,
      logoUrl: '/assets/sponsors/sponsor2.png',
    },
    {
      id: 3,
      name: 'Vijaya Dairy & Agro Foods',
      tier: 'Annadanam Poshaka (Daily Feeding Patron)',
      contribution: '₹3,00,000',
      contactPerson: 'Sri P. Subba Rao',
      phone: '+91 98850 33445',
      bannerActive: true,
      logoUrl: '/assets/sponsors/sponsor3.png',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              PATRONS & CORPORATE SUPPORTERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-gold" />
            Sponsors & Poshaka Council
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage corporate patrons, Poshaka recognitions, digital banner placements, and Yagnam stage felicitations.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
          <Plus className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Add Sponsor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Maha Poshakas</span>
          <h3 className="text-xl font-black text-ivory mt-1">4 Corporates</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Sponsorship Corpus</span>
          <h3 className="text-xl font-black text-gold mt-1">₹35,00,000</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Active Banners</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">10 Placements</h3>
        </Card>
      </div>

      {/* Sponsors Cards */}
      <div className="space-y-3">
        {sponsors.map((sp) => (
          <Card key={sp.id} className="p-5 bg-burgundy-deep/90 border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm" className="font-cinzel text-[10px]">
                  {sp.tier}
                </Badge>
                <span className="text-xs font-black text-gold-light">{sp.contribution}</span>
              </div>
              <h3 className="text-sm font-bold text-ivory">{sp.name}</h3>
              <p className="text-xs text-ivory/60">
                Contact: {sp.contactPerson} • {sp.phone}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Banner Display Active
              </span>
              <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
                <Edit2 className="w-3.5 h-3.5 text-gold" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
