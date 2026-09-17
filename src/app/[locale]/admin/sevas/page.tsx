'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
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
  AlertCircle,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

export default function AdminSevasPage() {
  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingSeva, setEditingSeva] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmSeva, setDeleteConfirmSeva] = useState<any | null>(null);

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
      const payload = {
        ...editingSeva,
        amount: editingSeva.amount === '' ? 0 : Number(editingSeva.amount),
        capacity: editingSeva.capacity === '' ? 50 : Number(editingSeva.capacity)
      };
      const res = await fetch(`/api/admin/sevas/${editingSeva.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setSevas(prev => prev.map(s => s.id === editingSeva.id ? json.data : s));
        setEditingSeva(null);
      } else {
        setError(json.error || 'Failed to update Seva');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving Seva');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSevaActive = async (seva: any) => {
    const newActiveState = !(seva.active !== false);
    try {
      const res = await fetch(`/api/admin/sevas/${seva.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActiveState }),
      });
      const json = await res.json();
      if (json.success) {
        setSevas((prev) => prev.map((s) => (s.id === seva.id ? { ...s, active: newActiveState } : s)));
      } else {
        setError(json.error || 'Failed to update visibility status');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating visibility');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmSeva) return;
    const seva = deleteConfirmSeva;
    setDeleteConfirmSeva(null);
    try {
      const res = await fetch(`/api/admin/sevas/${seva.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSevas((prev) => prev.filter((s) => s.id !== seva.id));
        if (editingSeva?.id === seva.id) setEditingSeva(null);
      } else {
        setError(json.error || 'Failed to delete Seva');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting Seva');
    }
  };

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSevaData, setNewSevaData] = useState({
    title: '',
    title_te: '',
    amount: 1008,
    capacity: 50,
    category: 'homam',
    icon: '🕉️',
    active: true,
    short_desc: '',
    short_desc_te: '',
  });

  const handleCreateSevaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/sevas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSevaData),
      });
      const json = await res.json();
      if (json.success) {
        setSevas((prev) => [...prev, json.data]);
        setIsCreatingNew(false);
        setNewSevaData({
          title: '',
          title_te: '',
          amount: 1008,
          capacity: 50,
          category: 'homam',
          icon: '🕉️',
          active: true,
          short_desc: '',
          short_desc_te: '',
        });
      } else {
        setError(json.error || 'Failed to create Seva');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating Seva');
    } finally {
      setIsSaving(false);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const filteredSevas = sevas.filter((s) => {
    const matchesSearch =
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && (s.category || '').toLowerCase() === filterType.toLowerCase();
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const totalPages = Math.ceil(filteredSevas.length / itemsPerPage) || 1;
  const paginatedSevas = filteredSevas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            Database-driven pricing, daily devotee limits, and online booking statuses (Dynamic Special Sevas)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreatingNew(true)}
            className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add New Special Seva
          </Button>

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
            {sevas.filter(s => s.active !== false).length}
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
          <option value="special">Special Seva</option>
          <option value="donation">Donation / Annadanam</option>
        </select>
      </Card>

      {/* Sevas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedSevas.map((seva) => {
          const isActive = seva.active !== false;

          return (
            <Card
              key={seva.id}
              className={`p-5 flex flex-col justify-between space-y-4 transition-all shadow-md ${
                isActive
                  ? 'bg-[#240006]/90 border-gold/20 hover:border-gold/40'
                  : 'bg-zinc-950/80 border-zinc-800 opacity-70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{seva.icon || '🕉️'}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Hide / Unhide Quick Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSevaActive(seva)}
                      className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80'
                          : 'border-red-500/40 text-red-300 bg-red-950/60 hover:bg-red-900/80'
                      }`}
                      title={isActive ? 'Click to HIDE from devotees' : 'Click to SHOW to devotees'}
                    >
                      {isActive ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>VISIBLE TO USERS</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-red-400" />
                          <span>HIDDEN FROM USERS</span>
                        </>
                      )}
                    </button>

                    {/* Edit Seva Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSeva({ ...seva })}
                      className="h-7 w-7 p-0 text-gold hover:bg-gold/10"
                      title="Edit Seva"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>

                    {/* Delete Seva Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirmSeva(seva)}
                      className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                      title="Delete Seva"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          );
        })}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSevas.length}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={[15, 30, 50]}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Add New Special Seva Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSevaSubmit} className="w-full max-w-lg max-h-[90vh] bg-[#240006] border border-gold/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gold/20 flex items-center justify-between shrink-0 bg-[#240006]">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">Add New Special Seva</h3>
                <p className="text-xs text-ivory/60">Create a new offering visible to devotees</p>
              </div>
              <button type="button" onClick={() => setIsCreatingNew(false)} className="text-ivory/60 hover:text-ivory p-1 rounded-lg hover:bg-gold/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 space-y-3 text-xs overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="text-ivory/70 block mb-1">Seva Title (English) *</label>
                <Input
                  value={newSevaData.title}
                  onChange={(e) => setNewSevaData({ ...newSevaData, title: e.target.value })}
                  placeholder="e.g. Special Chandi Maha Homam"
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Telugu Title</label>
                <Input
                  value={newSevaData.title_te}
                  onChange={(e) => setNewSevaData({ ...newSevaData, title_te: e.target.value })}
                  placeholder="e.g. విశేష చండీ మహా హోమం"
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Dakshina Amount (₹) *</label>
                  <Input
                    type="number"
                    value={newSevaData.amount}
                    onChange={(e) => setNewSevaData({ ...newSevaData, amount: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Daily Capacity Limit *</label>
                  <Input
                    type="number"
                    value={newSevaData.capacity}
                    onChange={(e) => setNewSevaData({ ...newSevaData, capacity: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Category</label>
                  <select
                    value={newSevaData.category}
                    onChange={(e) => setNewSevaData({ ...newSevaData, category: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="homam">Homam</option>
                    <option value="abhishekam">Abhishekam</option>
                    <option value="archana">Archana</option>
                    <option value="kalyanam">Kalyanam</option>
                    <option value="special">Special Seva</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Icon Emoji</label>
                  <Input
                    value={newSevaData.icon}
                    onChange={(e) => setNewSevaData({ ...newSevaData, icon: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Short Description (English)</label>
                <textarea
                  value={newSevaData.short_desc}
                  onChange={(e) => setNewSevaData({ ...newSevaData, short_desc: e.target.value })}
                  placeholder="Auspicious homam performed with special Vedic sankalpam..."
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-gold outline-none"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Short Description (Telugu)</label>
                <textarea
                  value={newSevaData.short_desc_te}
                  onChange={(e) => setNewSevaData({ ...newSevaData, short_desc_te: e.target.value })}
                  placeholder="ప్రత్యేక వేద సంకల్పంతో నిర్వహించబడే పవిత్ర హోమము..."
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
            </div>

            {/* Modal Footer - Sticky at bottom */}
            <div className="p-4 bg-[#1A0004] border-t border-gold/20 flex items-center justify-end gap-3 shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsCreatingNew(false)} className="border-gold/30 text-gold text-xs px-5 py-2">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light px-5 py-2">
                {isSaving ? 'Creating...' : 'Save & Publish to Website'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Seva Modal */}
      {editingSeva && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSeva} className="w-full max-w-lg max-h-[90vh] bg-[#240006] border border-gold/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gold/20 flex items-center justify-between shrink-0 bg-[#240006]">
              <h3 className="font-cinzel text-lg font-bold text-gold">Edit Seva & Quota</h3>
              <button type="button" onClick={() => setEditingSeva(null)} className="text-ivory/60 hover:text-ivory p-1 rounded-lg hover:bg-gold/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 space-y-3 text-xs overflow-y-auto flex-1 custom-scrollbar">
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
                    value={editingSeva.amount ?? ''}
                    onChange={(e) => setEditingSeva({ ...editingSeva, amount: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Daily Capacity Limit *</label>
                  <Input
                    type="number"
                    value={editingSeva.capacity ?? ''}
                    onChange={(e) => setEditingSeva({ ...editingSeva, capacity: e.target.value })}
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
                    <option value="special">Special Seva</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Online Booking Status</label>
                  <select
                    value={editingSeva.active !== false ? 'true' : 'false'}
                    onChange={(e) => setEditingSeva({ ...editingSeva, active: e.target.value === 'true' })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="true">Active (Visible & Bookable)</option>
                    <option value="false">Disabled / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Short Description (English)</label>
                <textarea
                  value={editingSeva.short_desc || ''}
                  onChange={(e) => setEditingSeva({ ...editingSeva, short_desc: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-gold outline-none"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Short Description (Telugu)</label>
                <textarea
                  value={editingSeva.short_desc_te || ''}
                  onChange={(e) => setEditingSeva({ ...editingSeva, short_desc_te: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-gold outline-none"
                />
              </div>
            </div>

            {/* Modal Footer - Sticky at bottom */}
            <div className="p-4 bg-[#1A0004] border-t border-gold/20 flex items-center justify-between shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const target = editingSeva;
                  setEditingSeva(null);
                  setDeleteConfirmSeva(target);
                }}
                className="border-red-500/50 text-red-400 hover:bg-red-950/50 text-xs px-3 py-2"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete Seva
              </Button>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingSeva(null)} className="border-gold/30 text-gold text-xs px-4 py-2">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light px-4 py-2">
                  {isSaving ? 'Saving...' : 'Save Pricing & Quota to Database'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Custom Integrated Delete Confirmation Modal */}
      {deleteConfirmSeva && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#240006] border border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/50 mx-auto flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-ivory">
              Confirm Permanent Delete
            </h3>
            <p className="text-xs text-ivory/70 font-sans">
              Are you sure you want to permanently delete <strong className="text-gold-light">&quot;{deleteConfirmSeva.title}&quot;</strong> from the website database?
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmSeva(null)}
                className="border-gold/30 text-gold text-xs px-5 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2 shadow-md"
              >
                Delete Seva
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
