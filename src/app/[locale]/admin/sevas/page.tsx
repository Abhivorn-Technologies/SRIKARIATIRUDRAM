'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Flame,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  IndianRupee,
  Clock,
  ShieldCheck,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminSevasPage() {
  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingSeva, setEditingSeva] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSevas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/sevas');
      const json = await res.json();
      if (json.success) {
        setSevas(json.data || []);
      } else {
        setError(json.error || 'Failed to load Sevas');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSevas();
  }, []);

  const handleSaveSeva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeva) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/admin/sevas/${editingSeva.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSeva)
      });
      const json = await res.json();
      if (json.success) {
        setSevas(prev => prev.map(s => s.id === editingSeva.id ? json.data : s));
        setEditingSeva(null);
      } else {
        alert(json.error || 'Failed to update Seva');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving Seva');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSevas = sevas.filter((s) => {
    const matchesSearch =
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && (s.category || '').toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Approved Seva Offerings & Quotas
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Database-driven pricing, daily devotee limits, and online booking statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSevas}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#240006]/90 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold/70">Total Sevas</span>
          <h3 className="text-xl font-bold font-cinzel text-ivory mt-1">{sevas.length}</h3>
        </Card>
        <Card className="p-4 bg-[#240006]/90 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold/70">Active Online</span>
          <h3 className="text-xl font-bold font-cinzel text-emerald-400 mt-1">
            {sevas.filter(s => s.active).length}
          </h3>
        </Card>
        <Card className="p-4 bg-[#240006]/90 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold/70">Homam Offerings</span>
          <h3 className="text-xl font-bold font-cinzel text-gold mt-1">
            {sevas.filter(s => s.category === 'homam').length}
          </h3>
        </Card>
        <Card className="p-4 bg-[#240006]/90 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold/70">Database Pricing</span>
          <h3 className="text-xl font-bold font-cinzel text-emerald-400 mt-1">Strict Enforced</h3>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
          <Input
            placeholder="Search seva title, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-9"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
        >
          <option value="all">All Categories</option>
          <option value="homam">Homam</option>
          <option value="abhishekam">Abhishekam</option>
          <option value="archana">Archana</option>
          <option value="kalyanam">Kalyanam</option>
          <option value="donation">Donation / Annadanam</option>
        </select>
      </Card>

      {/* Sevas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSevas.map((seva) => (
          <Card
            key={seva.id}
            className="p-5 bg-[#240006]/90 border-gold/20 flex flex-col justify-between space-y-4 hover:border-gold/40 transition-all shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{seva.icon || '🕉️'}</span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${
                      seva.active
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                        : 'border-zinc-500/40 text-zinc-400'
                    }`}
                  >
                    {seva.active ? 'Active' : 'Disabled'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingSeva({ ...seva })}
                    className="h-7 w-7 p-0 text-gold hover:bg-gold/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-cinzel text-sm font-bold text-ivory tracking-wide">
                  {seva.title}
                </h3>
                {seva.title_te && (
                  <p className="text-[11px] text-gold/80 mt-0.5">{seva.title_te}</p>
                )}
                <p className="text-xs text-ivory/60 mt-1.5 line-clamp-2">
                  {seva.short_desc}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gold/15 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-ivory/50 block">Dakshina</span>
                <span className="font-mono font-bold text-base text-gold">
                  ₹{Number(seva.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-ivory/50 block">Daily Quota</span>
                <span className="font-semibold text-ivory">{seva.capacity} slots</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Seva Modal */}
      {editingSeva && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSeva} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">Edit Seva Configuration</h3>
                <p className="text-xs text-ivory/60">{editingSeva.title}</p>
              </div>
              <button type="button" onClick={() => setEditingSeva(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ivory/70 block mb-1">Seva Title (English) *</label>
                <Input
                  value={editingSeva.title || ''}
                  onChange={(e) => setEditingSeva({ ...editingSeva, title: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Telugu Title</label>
                <Input
                  value={editingSeva.title_te || ''}
                  onChange={(e) => setEditingSeva({ ...editingSeva, title_te: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Dakshina Amount (₹) *</label>
                  <Input
                    type="number"
                    value={editingSeva.amount || 0}
                    onChange={(e) => setEditingSeva({ ...editingSeva, amount: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Daily Capacity Limit *</label>
                  <Input
                    type="number"
                    value={editingSeva.capacity || 50}
                    onChange={(e) => setEditingSeva({ ...editingSeva, capacity: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Category</label>
                  <select
                    value={editingSeva.category || 'homam'}
                    onChange={(e) => setEditingSeva({ ...editingSeva, category: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="homam">Homam</option>
                    <option value="abhishekam">Abhishekam</option>
                    <option value="archana">Archana</option>
                    <option value="kalyanam">Kalyanam</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Online Booking Status</label>
                  <select
                    value={editingSeva.active ? 'true' : 'false'}
                    onChange={(e) => setEditingSeva({ ...editingSeva, active: e.target.value === 'true' })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="true">Active (Visible & Bookable)</option>
                    <option value="false">Disabled / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Short Description</label>
                <textarea
                  value={editingSeva.short_desc || ''}
                  onChange={(e) => setEditingSeva({ ...editingSeva, short_desc: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-20"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setEditingSeva(null)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {isSaving ? 'Saving...' : 'Save Pricing & Quota to Supabase'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
