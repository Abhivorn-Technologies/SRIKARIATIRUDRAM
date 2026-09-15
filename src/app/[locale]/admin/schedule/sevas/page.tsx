"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Link } from "@/i18n/routing";
import {
  Flame, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2,
  ChevronDown, ChevronUp, Upload, Database, ArrowLeft, Eye, EyeOff, Edit2, Check, X
} from "lucide-react";

interface AssignedSeva {
  availability_id: string;
  seva_id: string;
  slug: string;
  title: string;
  title_te?: string;
  amount: number;
  category: string;
  icon?: string;
  capacity: number;
  booked_count: number;
  status: string; // "AVAILABLE" | "HIDDEN" | "FEW_SLOTS_LEFT" | "FULLY_BOOKED"
  available_slots: number;
}

interface DayRow {
  day_number: number;
  date: string;
  date_display: string;
  nakshatra: string;
  day_type: string;
  assigned_sevas: AssignedSeva[];
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

export default function AdminDaySevasPage() {
  const [days, setDays] = useState<DayRow[]>([]);
  const [masterSevas, setMasterSevas] = useState<MasterSeva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Expand Day 1 by default
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [addingTo, setAddingTo] = useState<{ dayNumber: number; date: string } | null>(null);
  const [selectedSevaId, setSelectedSevaId] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState(500);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Edit capacity state
  const [editingAvailId, setEditingAvailId] = useState<string | null>(null);
  const [editCapacityVal, setEditCapacityVal] = useState<number>(500);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [daysRes, sevasRes] = await Promise.all([
        fetch("/api/admin/schedule/sevas"),
        fetch("/api/admin/sevas"),
      ]);
      const daysJson = await daysRes.json();
      const sevasJson = await sevasRes.json();
      if (daysJson.success) setDays(daysJson.data || []);
      else setError(daysJson.error || "Failed to load day-seva data");
      if (sevasJson.success) setMasterSevas(sevasJson.data?.filter((s: MasterSeva) => s.active !== false) || []);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSeedAll = async (force = false) => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/schedule/sevas/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const json = await res.json();
      setSeedResult({ success: json.success, message: json.message });
      if (json.success) await fetchData();
    } catch (err: any) {
      setSeedResult({ success: false, message: err.message || "Seed failed" });
    } finally {
      setIsSeeding(false);
    }
  };

  // Toggle Seva Visibility (AVAILABLE <-> HIDDEN)
  const handleToggleVisibility = async (availId: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === "HIDDEN" ? "AVAILABLE" : "HIDDEN";
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({
          type: "ok",
          text: `"${title}" is now ${newStatus === "HIDDEN" ? "HIDDEN from devotees" : "VISIBLE to devotees"}.`,
        });
        await fetchData();
      } else {
        setActionMsg({ type: "err", text: json.error || "Failed to update status" });
      }
    } catch (err: any) {
      setActionMsg({ type: "err", text: err.message });
    }
  };

  // Update Seva Capacity
  const handleSaveCapacity = async (availId: string) => {
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId, capacity: editCapacityVal }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: "ok", text: "Capacity updated to " + editCapacityVal + " slots." });
        setEditingAvailId(null);
        await fetchData();
      } else {
        setActionMsg({ type: "err", text: json.error || "Failed to update capacity" });
      }
    } catch (err: any) {
      setActionMsg({ type: "err", text: err.message });
    }
  };

  // Delete Seva from Day
  const handleRemoveSeva = async (availId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from this day?`)) return;
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: "ok", text: `"${title}" removed from day.` });
        await fetchData();
      } else {
        setActionMsg({ type: "err", text: json.error || "Failed to remove" });
      }
    } catch (err: any) {
      setActionMsg({ type: "err", text: err.message });
    }
  };

  // Add Seva to Day
  const handleAddSeva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingTo || !selectedSevaId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: addingTo.date, seva_id: selectedSevaId, capacity: selectedCapacity, status: "AVAILABLE" }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({ type: "ok", text: "Seva assigned to day successfully." });
        setAddingTo(null);
        setSelectedSevaId("");
        setSelectedCapacity(500);
        await fetchData();
      } else {
        setActionMsg({ type: "err", text: json.error || "Failed to add seva" });
      }
    } catch (err: any) {
      setActionMsg({ type: "err", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const dayTypeColor = (t: string) => {
    switch (t) {
      case "CHANDI": return "bg-rose-950/80 text-rose-300 border-rose-500/40";
      case "SARPA_SUKTA": return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      case "ASLESHA_BALI": return "bg-purple-950/80 text-purple-300 border-purple-500/40";
      case "SUBRAMANYESWARA_KALYANAM": return "bg-amber-950/80 text-amber-300 border-amber-500/40";
      case "POORNAHUTI": return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      default: return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const totalAssigned = days.reduce((s, d) => s + (d.assigned_sevas?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/schedule" className="text-gold/60 hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Flame className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">28-Day Seva Allocation Desk</h1>
          </div>
          <p className="text-xs text-ivory/70">
            Control exact sevas, tickets capacity, and show/hide toggles for every single day of the 28-day festival.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <span className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-lg border bg-emerald-950/60 border-emerald-500/30 text-emerald-400">
            <Database className="w-3 h-3" />
            {totalAssigned} active allocations
          </span>

          <Button size="sm" onClick={() => handleSeedAll(false)} disabled={isSeeding}
            className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs">
            <Upload className={`w-3.5 h-3.5 mr-1.5 ${isSeeding ? "animate-pulse" : ""}`} />
            {isSeeding ? "Seeding..." : "Auto-Seed Defaults"}
          </Button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className={`p-3.5 rounded-xl flex items-center gap-3 border text-xs font-sans shadow-md animate-in fade-in duration-200 ${
          actionMsg.type === "ok"
            ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
            : "bg-red-950/80 border-red-500/50 text-red-200"
        }`}>
          {actionMsg.type === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
          <span>{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} className="ml-auto text-current/60 hover:text-current">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 28-Day Schedule Accordion */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gold/70 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold" />
            <span>Loading 28-Day Seva Allocations...</span>
          </div>
        ) : (
          days.map((day) => {
            const isOpen = expandedDay === day.day_number;
            const sevaCount = day.assigned_sevas?.length || 0;
            const visibleCount = day.assigned_sevas?.filter(s => s.status !== "HIDDEN").length || 0;

            return (
              <Card key={day.day_number} className="bg-[#240006]/90 border-gold/20 overflow-hidden shadow-md">
                {/* Row Header */}
                <div className="flex items-center justify-between p-4 bg-[#1A0004]/80 border-b border-gold/15">
                  <button
                    onClick={() => setExpandedDay(isOpen ? null : day.day_number)}
                    className="flex items-center gap-4 text-left flex-1"
                  >
                    <span className="font-mono font-bold text-gold text-sm w-14 shrink-0">Day {String(day.day_number).padStart(2, "0")}</span>
                    <span className="text-xs text-ivory/80 font-medium w-36 shrink-0">{day.date_display}</span>
                    <span className="text-xs text-ivory font-bold flex-1 truncate">{day.nakshatra}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${dayTypeColor(day.day_type)}`}>
                      {day.day_type}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                      visibleCount > 0 ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-400" : "bg-amber-950/60 border-amber-500/30 text-amber-400"
                    }`}>
                      {visibleCount} Visible ({sevaCount} Total)
                    </span>
                  </button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => {
                        setExpandedDay(day.day_number);
                        setAddingTo({ dayNumber: day.day_number, date: day.date });
                        setSelectedSevaId(masterSevas[0]?.id || "");
                        setSelectedCapacity(500);
                      }}
                      className="text-[11px] h-7 px-2.5 font-bold uppercase tracking-wider shrink-0"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Seva
                    </Button>

                    <button
                      onClick={() => setExpandedDay(isOpen ? null : day.day_number)}
                      className="p-1 rounded text-gold/60 hover:text-gold"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="p-4 space-y-4 bg-burgundy-deep/60">
                    {/* Add Seva Inline Form */}
                    {addingTo?.dayNumber === day.day_number && (
                      <form onSubmit={handleAddSeva} className="p-4 rounded-xl border border-gold/40 bg-burgundy/90 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-2">
                          <span className="text-xs font-bold font-cinzel text-gold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-gold" />
                            Add New Seva to Day {day.day_number} ({day.nakshatra})
                          </span>
                          <button type="button" onClick={() => setAddingTo(null)} className="text-ivory/60 hover:text-ivory">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[11px] text-ivory/70 font-cinzel">Select Seva from Master Catalog</label>
                            <select
                              value={selectedSevaId}
                              onChange={(e) => setSelectedSevaId(e.target.value)}
                              required
                              className="w-full bg-burgundy-dark border border-gold/40 text-ivory rounded-lg p-2 text-xs outline-none focus:border-gold"
                            >
                              {masterSevas.map((sv) => (
                                <option key={sv.id} value={sv.id}>
                                  {sv.title} — ₹{Number(sv.amount).toLocaleString("en-IN")} ({sv.category})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-ivory/70 font-cinzel">Ticket Capacity</label>
                            <input
                              type="number"
                              value={selectedCapacity}
                              onChange={(e) => setSelectedCapacity(parseInt(e.target.value, 10) || 100)}
                              min={1}
                              required
                              className="w-full bg-burgundy-dark border border-gold/40 text-ivory rounded-lg p-2 text-xs outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-gold/10">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setAddingTo(null)} className="text-xs text-ivory/70">
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" disabled={isSaving || !selectedSevaId} variant="gold" className="text-xs font-bold">
                            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                            Save Seva to Day {day.day_number}
                          </Button>
                        </div>
                      </form>
                    )}

                    {/* Assigned Sevas List */}
                    {sevaCount === 0 ? (
                      <div className="p-6 text-center border border-dashed border-gold/20 rounded-xl space-y-2">
                        <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                        <p className="text-xs text-amber-200/80 font-sans">
                          No sevas assigned to Day {day.day_number} ({day.nakshatra}).
                        </p>
                        <Button
                          size="sm"
                          variant="gold"
                          onClick={() => {
                            setAddingTo({ dayNumber: day.day_number, date: day.date });
                            setSelectedSevaId(masterSevas[0]?.id || "");
                          }}
                          className="text-xs font-bold mt-1"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add First Seva to Day {day.day_number}
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {day.assigned_sevas.map((s) => {
                          const isHidden = s.status === "HIDDEN";
                          const isEditingCap = editingAvailId === s.availability_id;

                          return (
                            <div
                              key={s.availability_id}
                              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                isHidden
                                  ? "bg-zinc-950/60 border-zinc-800 opacity-60"
                                  : "bg-[#1A0004] border-gold/20 hover:border-gold/40"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-ivory font-cinzel">{s.title}</span>
                                    <Badge variant="gold" size="sm" className="text-[10px]">
                                      {s.category}
                                    </Badge>
                                  </div>
                                  {s.title_te && <p className="text-[11px] text-gold-light/80 font-telugu">{s.title_te}</p>}
                                </div>

                                <span className="text-sm font-bold font-mono text-gold shrink-0">
                                  ₹{Number(s.amount).toLocaleString("en-IN")}
                                </span>
                              </div>

                              {/* Footer Controls: Hide Toggle, Capacity, Delete */}
                              <div className="pt-2 border-t border-gold/15 flex items-center justify-between text-xs">
                                {/* Toggle Show/Hide from User */}
                                <button
                                  onClick={() => handleToggleVisibility(s.availability_id, s.status, s.title)}
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                                    isHidden
                                      ? "bg-red-950/80 border-red-500/50 text-red-300 hover:bg-red-900/80"
                                      : "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80"
                                  }`}
                                  title={isHidden ? "Click to SHOW to users on website" : "Click to HIDE from users on website"}
                                >
                                  {isHidden ? (
                                    <>
                                      <EyeOff className="w-3.5 h-3.5 text-red-400" />
                                      <span>HIDDEN FROM USERS</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>VISIBLE TO USERS</span>
                                    </>
                                  )}
                                </button>

                                {/* Capacity & Actions */}
                                <div className="flex items-center gap-3">
                                  {isEditingCap ? (
                                    <div className="flex items-center gap-1">
                                      <Input
                                        type="number"
                                        min="1"
                                        value={editCapacityVal}
                                        onChange={(e) => setEditCapacityVal(parseInt(e.target.value, 10) || 1)}
                                        className="w-16 h-7 text-xs bg-burgundy-dark border-gold/50 text-ivory px-1.5"
                                      />
                                      <button
                                        onClick={() => handleSaveCapacity(s.availability_id)}
                                        className="p-1 rounded bg-gold/20 text-gold hover:bg-gold/30"
                                        title="Save capacity"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingAvailId(null)}
                                        className="p-1 rounded bg-red-950/50 text-red-300"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      onClick={() => {
                                        setEditingAvailId(s.availability_id);
                                        setEditCapacityVal(s.capacity);
                                      }}
                                      className="font-mono text-xs text-ivory/80 cursor-pointer hover:text-gold flex items-center gap-1"
                                      title="Click to edit capacity"
                                    >
                                      <span className="text-[10px] text-ivory/50">Cap:</span>
                                      <strong className="text-gold">{s.capacity}</strong>
                                      <Edit2 className="w-3 h-3 text-gold/60" />
                                    </span>
                                  )}

                                  <button
                                    onClick={() => handleRemoveSeva(s.availability_id, s.title)}
                                    className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                                    title="Remove this seva from this day"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}