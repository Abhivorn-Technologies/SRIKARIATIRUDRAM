'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Utensils, PlusCircle, RefreshCw, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminAnnadanamPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    sponsor_name: '',
    mobile: '',
    email: '',
    date: '2026-11-25',
    amount: 5116,
    occasion: 'In loving memory of Parents',
    display_name: ''
  });

  const fetchAnnadanam = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/annadanam');
      const json = await res.json();
      if (json.success) {
        setSponsors(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch Annadanam records');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnadanam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/annadanam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setIsAddOpen(false);
        fetchAnnadanam();
      } else {
        alert(json.error || 'Failed to add sponsor');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this Annadanam record?')) return;
    try {
      const res = await fetch(`/api/admin/annadanam/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchAnnadanam();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalRaised = sponsors.reduce((acc, s) => acc + Number(s.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              28-Day Maha Annadanam Sponsors
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Sacred Mahaprasadam sponsorship ledger for thousands of visiting devotees
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnnadanam}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Add Annadanam Sponsor
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">Total Sponsors</span>
          <h3 className="text-2xl font-bold font-cinzel text-ivory mt-1">{sponsors.length} Sponsors</h3>
        </Card>
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">Total Annadanam Funds</span>
          <h3 className="text-2xl font-bold font-cinzel text-gold mt-1">₹{totalRaised.toLocaleString('en-IN')}</h3>
        </Card>
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">Daily Target Capacity</span>
          <h3 className="text-2xl font-bold font-cinzel text-emerald-400 mt-1">1,000+ Meals/Day</h3>
        </Card>
      </div>

      {/* Sponsors Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Sponsored Date</th>
                <th className="py-3 px-4">Sponsor / Devotee</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Occasion / Sankalpam</th>
                <th className="py-3 px-4">Display Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {sponsors.length > 0 ? (
                sponsors.map((s) => (
                  <tr key={s.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-ivory">
                      {s.date} (Day {s.day_number || 1})
                    </td>
                    <td className="py-3 px-4 font-semibold text-ivory">
                      {s.sponsor_name}
                    </td>
                    <td className="py-3 px-4 text-ivory/70">
                      {s.mobile}
                    </td>
                    <td className="py-3 px-4 text-ivory/80">
                      {s.occasion || '-'}
                    </td>
                    <td className="py-3 px-4 text-gold">
                      {s.display_name || s.sponsor_name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      ₹{Number(s.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(s.id)}
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ivory/50 italic">
                    {loading ? 'Loading Annadanam sponsors...' : 'No Annadanam records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">Add Annadanam Sponsorship</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Sponsor Full Name *</label>
                  <Input
                    value={formData.sponsor_name}
                    onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Contact Mobile *</label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Sponsorship Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Amount (₹) *</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Occasion / In Memory Of</label>
                <Input
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Public Display Name</label>
                <Input
                  placeholder="e.g. Sri Ramakrishna Kutumbam"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {saving ? 'Saving...' : 'Save Sponsorship'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
