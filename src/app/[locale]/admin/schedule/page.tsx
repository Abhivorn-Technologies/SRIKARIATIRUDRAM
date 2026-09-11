'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Save,
  Sparkles,
  Edit2,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/schedule');
      const json = await res.json();
      if (json.success) {
        setSchedules(json.data || []);
      } else {
        setError(json.error || 'Failed to load schedules');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/admin/schedule/${editingItem.day_number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const json = await res.json();
      if (json.success) {
        setSchedules(prev => prev.map(s => s.day_number === editingItem.day_number ? json.data : s));
        setEditingItem(null);
      } else {
        alert(json.error || 'Failed to update schedule');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = schedules.filter(s =>
    (s.nakshatra || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.date_display || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.day_number) === searchQuery
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              28-Day Mahayagnam Schedule Manager
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Dynamically control dates, Nakshatra assignments, special Homams, and daily rituals stored in Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSchedules}
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

      {/* Search Bar */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
          <Input
            placeholder="Search by Day, Nakshatra, Homam title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-9"
          />
        </div>
        <div className="text-xs text-gold font-cinzel">
          28 Days Active (25 Nov – 22 Dec 2026)
        </div>
      </Card>

      {/* 28-Day Schedule Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Assigned Nakshatra</th>
                <th className="py-3 px-4">Day Classification</th>
                <th className="py-3 px-4">Programme Title</th>
                <th className="py-3 px-4">Special Homam / Ritual</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.map((item) => (
                <tr key={item.day_number} className="hover:bg-gold/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gold">
                    Day {item.day_number}
                  </td>
                  <td className="py-3 px-4 text-ivory/90 whitespace-nowrap font-medium">
                    {item.date_display}
                  </td>
                  <td className="py-3 px-4 font-semibold text-ivory">
                    {item.nakshatra}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.day_type === 'CHANDI'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          : item.day_type === 'SARPA_SUKTA'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : item.day_type === 'ASLESHA_BALI'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                          : item.day_type === 'SUBRAMANYESWARA_KALYANAM'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : item.day_type === 'POORNAHUTI'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {item.day_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[240px] truncate text-ivory/80">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-ivory/70 max-w-[200px] truncate">
                    {item.special_programme || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className="text-[10px] border-gold/40 text-gold bg-gold/10">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingItem({ ...item })}
                      className="h-7 px-2 text-gold hover:bg-gold/10 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Day Schedule Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="w-full max-w-xl bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">
                  Edit Day {editingItem.day_number} Schedule
                </h3>
                <p className="text-xs text-ivory/60">{editingItem.date_display}</p>
              </div>
              <button type="button" onClick={() => setEditingItem(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Nakshatra Name *</label>
                  <Input
                    value={editingItem.nakshatra || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nakshatra: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Day Classification *</label>
                  <select
                    value={editingItem.day_type || 'REGULAR'}
                    onChange={(e) => setEditingItem({ ...editingItem, day_type: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="REGULAR">REGULAR (Nakshatra Hawan & Shanthi)</option>
                    <option value="CHANDI">CHANDI (Chandi Homam Day)</option>
                    <option value="SARPA_SUKTA">SARPA_SUKTA (Sarpa Sukta Homam Day)</option>
                    <option value="ASLESHA_BALI">ASLESHA_BALI (Aslesha Bali Pooja Day)</option>
                    <option value="SUBRAMANYESWARA_KALYANAM">SUBRAMANYESWARA_KALYANAM (Krithika Day)</option>
                    <option value="POORNAHUTI">POORNAHUTI (Grand Finale Day 28)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Programme Main Title *</label>
                <Input
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Morning Rituals</label>
                <Input
                  value={editingItem.morning_programme || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, morning_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Special Homam / Ritual</label>
                <Input
                  value={editingItem.special_programme || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, special_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Evening Rituals</label>
                <Input
                  value={editingItem.evening_programme || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, evening_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Status</label>
                  <select
                    value={editingItem.status || 'SCHEDULED'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE TODAY</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Annadanam Menu</label>
                  <Input
                    value={editingItem.annadanam_menu || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, annadanam_menu: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {isSaving ? 'Saving...' : 'Save to Supabase Database'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
