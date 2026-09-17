'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Link } from '@/i18n/routing';

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
  AlertCircle,
  Database,
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Trash2,
  Ticket
} from 'lucide-react';

interface AssignedSeva {
  availability_id: string;
  seva_id: string;
  slug: string;
  title: string;
  title_te?: string;
  amount: number;
  category: string;
  capacity: number;
  booked_count: number;
  status: string; // "AVAILABLE" | "HIDDEN" | "FEW_SLOTS_LEFT" | "FULLY_BOOKED"
  available_slots: number;
}

interface MasterSeva {
  id: string;
  slug: string;
  title: string;
  amount: number;
  category: string;
  icon?: string;
  active: boolean;
}

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [masterSevas, setMasterSevas] = useState<MasterSeva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [expandedDaySeva, setExpandedDaySeva] = useState<number | null>(null);
  
  // Seva allocation action states
  const [addingSevaToDay, setAddingSevaToDay] = useState<{ day_number: number; date: string } | null>(null);
  const [selectedSevaId, setSelectedSevaId] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState(500);
  const [editingAvailId, setEditingAvailId] = useState<string | null>(null);
  const [editCapacityVal, setEditCapacityVal] = useState<number>(500);
  const [actionMsg, setActionMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({
    day_number: 29,
    date: '2026-12-23',
    date_display: '23 December 2026',
    nakshatra: '',
    day_type: 'REGULAR',
    title: '',
    morning_programme: '06:30 AM Suprabhatam & Rudrabhishekam',
    special_programme: '',
    evening_programme: '06:00 PM Deeparadhana & Harathi',
    status: 'SCHEDULED'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [dbCount, setDbCount] = useState<number | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingSevas, setIsSeedingSevas] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statusRes, scheduleRes, sevasRes] = await Promise.all([
        fetch('/api/admin/schedule/seed'),
        fetch('/api/admin/schedule'),
        fetch('/api/admin/sevas')
      ]);

      const statusJson = await statusRes.json();
      if (statusJson.success) setDbCount(statusJson.count);

      const json = await scheduleRes.json();
      if (json.success) {
        const data = json.data || [];
        setSchedules(data);
        if (data.length > 0) {
          const maxDay = Math.max(...data.map((d: any) => d.day_number || 0));
          setNewItemData((prev: any) => ({ ...prev, day_number: maxDay + 1 }));
        }
      } else {
        setError(json.error || 'Failed to load schedules');
      }

      const sevasJson = await sevasRes.json();
      if (sevasJson.success) {
        setMasterSevas((sevasJson.data || []).filter((s: MasterSeva) => s.active !== false));
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData)
      });
      const json = await res.json();
      if (json.success) {
        setIsAddingNew(false);
        await fetchSchedules();
      } else {
        alert(json.error || 'Failed to create schedule card');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating schedule card');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedDatabase = async (force = false) => {
    try {
      setIsSeeding(true);
      setSeedResult(null);
      const res = await fetch('/api/admin/schedule/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      const json = await res.json();
      setSeedResult({ success: json.success, message: json.message });
      if (json.success) {
        await fetchSchedules();
      }
    } catch (err: any) {
      setSeedResult({ success: false, message: err.message || 'Seed failed' });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedSevas = async (force = false) => {
    try {
      setIsSeedingSevas(true);
      setActionMsg(null);
      const res = await fetch('/api/admin/schedule/sevas/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force })
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: 'ok', text: 'Seva allocations seeded successfully across all 28 days!' });
        await fetchSchedules();
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed to seed sevas' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'err', text: err.message || 'Seva seed failed' });
    } finally {
      setIsSeedingSevas(false);
    }
  };

  const handleToggleSevaVisibility = async (availId: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === 'HIDDEN' ? 'AVAILABLE' : 'HIDDEN';
    try {
      const res = await fetch('/api/admin/schedule/sevas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability_id: availId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({
          type: 'ok',
          text: `"${title}" is now ${newStatus === 'HIDDEN' ? 'HIDDEN from devotees' : 'VISIBLE for booking'}.`,
        });
        await fetchSchedules();
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed to update visibility' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'err', text: err.message });
    }
  };

  const handleSaveSevaCapacity = async (availId: string) => {
    try {
      const res = await fetch('/api/admin/schedule/sevas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability_id: availId, capacity: editCapacityVal }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: 'ok', text: 'Ticket capacity updated to ' + editCapacityVal });
        setEditingAvailId(null);
        await fetchSchedules();
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed to update capacity' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'err', text: err.message });
    }
  };

  const handleRemoveSevaFromDay = async (availId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from this day?`)) return;
    try {
      const res = await fetch('/api/admin/schedule/sevas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability_id: availId }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: 'ok', text: `Removed "${title}" from day` });
        await fetchSchedules();
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed to remove Seva' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'err', text: err.message });
    }
  };

  const handleAddSevaToDaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingSevaToDay || !selectedSevaId) return;
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/schedule/sevas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: addingSevaToDay.date,
          seva_id: selectedSevaId,
          capacity: selectedCapacity,
          status: 'AVAILABLE'
        })
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: 'ok', text: 'Seva added to day successfully!' });
        setAddingSevaToDay(null);
        setSelectedSevaId('');
        await fetchSchedules();
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed to assign Seva' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'err', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              28-Day Schedule & Seva Allocation Desk
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Unified management for dates, Nakshatras, rituals, ticket capacities, and live Seva booking toggles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSchedules}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* DB Status indicator */}
          {dbCount !== null && (
            <span className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-lg border ${
              dbCount >= 28
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/60 border-amber-500/30 text-amber-400'
            }`}>
              <Database className="w-3 h-3" />
              {dbCount >= 28 ? `DB: All 28 days ✓` : `DB: ${dbCount}/28 days`}
            </span>
          )}

          {/* Seed Schedule Button */}
          {dbCount !== null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSeedDatabase(true)}
              disabled={isSeeding}
              className="border-gold/30 text-gold/80 hover:bg-gold/10 text-xs"
            >
              <Upload className={`w-3.5 h-3.5 mr-1.5 ${isSeeding ? 'animate-pulse' : ''}`} />
              {isSeeding ? 'Seeding...' : 'Seed Schedules'}
            </Button>
          )}

          {/* Auto-Seed Defaults Sevas button */}
          <Button
            size="sm"
            onClick={() => handleSeedSevas(true)}
            disabled={isSeedingSevas}
            className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs shadow-gold-sm"
          >
            <Flame className={`w-3.5 h-3.5 mr-1.5 ${isSeedingSevas ? 'animate-spin' : ''}`} />
            {isSeedingSevas ? 'Seeding Sevas...' : 'Auto-Seed Default Sevas'}
          </Button>

          {/* Add New Schedule Card button */}
          <Button
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="bg-[#3A000B] border border-gold/40 text-gold hover:bg-[#4A000E] text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Schedule Day
          </Button>
        </div>
      </div>

      {actionMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between gap-3 border ${
          actionMsg.type === 'ok'
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            {actionMsg.type === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{actionMsg.text}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-ivory/60 hover:text-ivory">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* 28-Day Schedule & Seva Allocation Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Nakshatra</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Programme Title</th>
                <th className="py-3 px-4">Sevas & Ticket Inventory</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.map((item) => {
                const assignedSevas: AssignedSeva[] = item.assigned_sevas || [];
                const isExpanded = expandedDaySeva === item.day_number;

                return (
                  <React.Fragment key={item.day_number}>
                    <tr className="hover:bg-gold/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gold">
                        Day {String(item.day_number).padStart(2, '0')}
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
                      <td className="py-3 px-4 max-w-[200px] truncate text-ivory/80">
                        {item.title}
                      </td>

                      {/* Sevas Overview */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setExpandedDaySeva(isExpanded ? null : item.day_number)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1A0004] border border-gold/30 hover:border-gold/60 text-gold text-[11px] font-semibold transition-all"
                        >
                          <Ticket className="w-3.5 h-3.5 text-gold" />
                          <span>{assignedSevas.length} Seva(s) Assigned</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="text-[10px] border-gold/40 text-gold bg-gold/10">
                          {item.status || 'SCHEDULED'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingItem({ ...item })}
                            className="h-7 px-2 text-gold hover:bg-gold/10 text-xs"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Day
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedDaySeva(isExpanded ? null : item.day_number)}
                            className="h-7 px-2 border-gold/30 text-gold hover:bg-gold/10 text-xs"
                          >
                            <Flame className="w-3.5 h-3.5 mr-1" /> Sevas
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Seva Allocation Panel for this day */}
                    {isExpanded && (
                      <tr className="bg-[#1D0005]">
                        <td colSpan={8} className="p-4 border-b border-gold/30">
                          <div className="bg-[#120003] border border-gold/30 rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gold/20">
                              <div>
                                <h4 className="font-cinzel text-sm font-bold text-gold flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-gold-light" />
                                  Day {item.day_number} Seva Allocation Desk & Ticket Capacity
                                </h4>
                                <p className="text-[11px] text-ivory/60">{item.date_display} • {item.nakshatra}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setAddingSevaToDay({ day_number: item.day_number, date: item.date })}
                                className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs h-7"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Seva to Day {item.day_number}
                              </Button>
                            </div>

                            {assignedSevas.length === 0 ? (
                              <div className="text-center py-6 text-ivory/60 text-xs space-y-2">
                                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                                <p>No Sevas currently assigned to Day {item.day_number}.</p>
                                <Button
                                  size="sm"
                                  onClick={() => setAddingSevaToDay({ day_number: item.day_number, date: item.date })}
                                  className="bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 text-xs"
                                >
                                  + Add First Seva to Day {item.day_number}
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {assignedSevas.map((sa) => {
                                  const isEditingCap = editingAvailId === sa.availability_id;
                                  const isHidden = sa.status === 'HIDDEN';

                                  return (
                                    <div
                                      key={sa.availability_id}
                                      className={`p-3 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                                        isHidden
                                          ? 'bg-zinc-950/60 border-zinc-700/50 opacity-70'
                                          : 'bg-[#240006] border-gold/30 hover:border-gold/60'
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-2">
                                          <div>
                                            <h5 className="font-bold text-ivory text-xs">{sa.title}</h5>
                                            <p className="text-[11px] text-gold font-mono font-semibold">₹{sa.amount}</p>
                                          </div>
                                          <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                              isHidden
                                                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                                : sa.available_slots === 0
                                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                                : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                            }`}
                                          >
                                            {isHidden ? 'HIDDEN' : sa.available_slots === 0 ? 'SOLD OUT' : 'VISIBLE'}
                                          </span>
                                        </div>

                                        <div className="mt-3 text-[11px] space-y-1 bg-[#1A0004] p-2 rounded-lg border border-gold/10">
                                          <div className="flex justify-between text-ivory/80">
                                            <span>Max Capacity:</span>
                                            <span className="font-mono font-bold text-ivory">{sa.capacity} tickets</span>
                                          </div>
                                          <div className="flex justify-between text-ivory/80">
                                            <span>Booked Tickets:</span>
                                            <span className="font-mono font-bold text-amber-400">{sa.booked_count}</span>
                                          </div>
                                          <div className="flex justify-between text-ivory/80 border-t border-gold/10 pt-1 mt-1">
                                            <span>Devotee Pending Slots:</span>
                                            <span className="font-mono font-bold text-emerald-400">{sa.available_slots} remaining</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Controls for this Seva */}
                                      <div className="flex items-center justify-between pt-2 border-t border-gold/15 gap-2">
                                        <div className="flex items-center gap-1">
                                          {/* Toggle Visibility */}
                                          <button
                                            onClick={() => handleToggleSevaVisibility(sa.availability_id, sa.status, sa.title)}
                                            title={isHidden ? 'Show on Public Website' : 'Hide from Public Website'}
                                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                                              isHidden
                                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                                                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                                            }`}
                                          >
                                            {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            <span>{isHidden ? 'Show' : 'Hide'}</span>
                                          </button>

                                          {/* Edit Capacity Button */}
                                          <button
                                            onClick={() => {
                                              setEditingAvailId(sa.availability_id);
                                              setEditCapacityVal(sa.capacity);
                                            }}
                                            className="p-1.5 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-xs font-semibold flex items-center gap-1"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            <span>Capacity</span>
                                          </button>
                                        </div>

                                        {/* Remove Seva Button */}
                                        <button
                                          onClick={() => handleRemoveSevaFromDay(sa.availability_id, sa.title)}
                                          className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors"
                                          title="Remove Seva from this Day"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      {/* Edit Capacity Inline Form */}
                                      {isEditingCap && (
                                        <div className="mt-2 p-2 bg-[#170003] border border-gold/40 rounded-lg space-y-2">
                                          <label className="text-[10px] text-gold font-bold block">Set Max Capacity Limit:</label>
                                          <div className="flex gap-2">
                                            <Input
                                              type="number"
                                              value={editCapacityVal}
                                              onChange={(e) => setEditCapacityVal(Number(e.target.value))}
                                              className="h-7 text-xs bg-[#240006] text-ivory border-gold/30"
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => handleSaveSevaCapacity(sa.availability_id)}
                                              className="h-7 bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => setEditingAvailId(null)}
                                              className="h-7 text-xs text-ivory/60"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Seva Modal */}
      {addingSevaToDay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSevaToDaySubmit} className="w-full max-w-md bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-base font-bold text-gold">
                  Add Seva to Day {addingSevaToDay.day_number}
                </h3>
                <p className="text-xs text-ivory/60">Date: {addingSevaToDay.date}</p>
              </div>
              <button type="button" onClick={() => setAddingSevaToDay(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ivory/70 block mb-1">Select Seva *</label>
                <select
                  value={selectedSevaId}
                  onChange={(e) => setSelectedSevaId(e.target.value)}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2.5 text-xs"
                  required
                >
                  <option value="">-- Choose a Master Seva --</option>
                  {masterSevas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} (₹{s.amount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Maximum Ticket Capacity *</label>
                <Input
                  type="number"
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(Number(e.target.value))}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setAddingSevaToDay(null)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {isSaving ? 'Assigning...' : 'Assign Seva to Day'}
              </Button>
            </div>
          </form>
        </div>
      )}

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
                {isSaving ? 'Saving...' : 'Save to Database'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Schedule Card Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNew} className="w-full max-w-xl bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">
                  Create New Schedule Card
                </h3>
                <p className="text-xs text-ivory/60">Add a custom program card directly to MongoDB</p>
              </div>
              <button type="button" onClick={() => setIsAddingNew(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Day Number *</label>
                  <Input
                    type="number"
                    value={newItemData.day_number || ''}
                    onChange={(e) => setNewItemData({ ...newItemData, day_number: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Display Date *</label>
                  <Input
                    value={newItemData.date_display || ''}
                    onChange={(e) => setNewItemData({ ...newItemData, date_display: e.target.value, date: e.target.value })}
                    placeholder="e.g. 23 December 2026"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Nakshatra Name *</label>
                  <Input
                    value={newItemData.nakshatra || ''}
                    onChange={(e) => setNewItemData({ ...newItemData, nakshatra: e.target.value })}
                    placeholder="e.g. Rohini Nakshatram"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Day Classification *</label>
                  <select
                    value={newItemData.day_type || 'REGULAR'}
                    onChange={(e) => setNewItemData({ ...newItemData, day_type: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="REGULAR">REGULAR (Nakshatra Hawan & Shanthi)</option>
                    <option value="CHANDI">CHANDI (Chandi Homam Day)</option>
                    <option value="SARPA_SUKTA">SARPA_SUKTA (Sarpa Sukta Homam Day)</option>
                    <option value="ASLESHA_BALI">ASLESHA_BALI (Aslesha Bali Pooja Day)</option>
                    <option value="SUBRAMANYESWARA_KALYANAM">SUBRAMANYESWARA_KALYANAM (Krithika Day)</option>
                    <option value="POORNAHUTI">POORNAHUTI (Grand Finale Day)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Programme Main Title *</label>
                <Input
                  value={newItemData.title || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, title: e.target.value })}
                  placeholder="e.g. Special Maha Yagnam Programme"
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Morning Rituals</label>
                <Input
                  value={newItemData.morning_programme || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, morning_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Special Homam / Ritual</label>
                <Input
                  value={newItemData.special_programme || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, special_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Evening Rituals</label>
                <Input
                  value={newItemData.evening_programme || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, evening_programme: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {isSaving ? 'Creating...' : 'Create Card in Database'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
