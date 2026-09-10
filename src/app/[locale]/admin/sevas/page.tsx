'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Flame, Plus, Search, Edit2, CheckCircle2, IndianRupee, Clock, ShieldCheck } from 'lucide-react';
import { sevasList } from '@/data/sevas';

export default function AdminSevasPage() {
  const [sevas, setSevas] = useState(sevasList);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredSevas = sevas.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && s.category.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              SEVA CATALOG & SLOTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-gold" />
            Seva Offerings & Quotas
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage daily and full-cycle sevas, pricing tiers, daily devotee limits, and online booking statuses.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
          <Plus className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Add New Seva
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Sevas</span>
          <h3 className="text-xl font-black text-ivory mt-1">{sevas.length}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Active Online</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{sevas.length}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Morning Batches</span>
          <h3 className="text-xl font-black text-gold mt-1">12</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Evening Batches</span>
          <h3 className="text-xl font-black text-gold mt-1">8</h3>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Seva name, deity, or category..."
              className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
            />
            <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
          >
            <option value="all">All Categories</option>
            <option value="daily">Daily Sevas</option>
            <option value="special">Special Yagnam</option>
            <option value="annadanam">Annadanam</option>
            <option value="nakshatra">Nakshatra Sevas</option>
          </select>
        </div>
      </Card>

      {/* Seva List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSevas.map((seva) => (
          <Card
            key={seva.id}
            className="p-5 bg-burgundy-deep/80 border-gold/25 hover:border-gold/50 transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" size="sm" className="text-[10px] border-gold/40 text-gold font-cinzel">
                  {seva.category.toUpperCase()}
                </Badge>
                <span className="text-xs font-black text-gold-light flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {seva.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-sm font-bold text-ivory">{seva.title}</h3>
                <p className="text-[11px] text-ivory/70 line-clamp-2 mt-1">{seva.shortDesc || seva.fullDesc}</p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-ivory/60 pt-2 border-t border-gold/15">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold/70" /> {seva.time || 'Morning & Evening'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gold/15">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Active & Booking
              </span>
              <Button variant="outline" size="sm" className="text-[11px] h-7 border-gold/30 hover:border-gold">
                <Edit2 className="w-3 h-3 mr-1 text-gold" /> Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
