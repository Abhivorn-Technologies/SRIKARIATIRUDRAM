"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/routing";
import {
  Calendar,
  Clock,
  Flame,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit2,
  Check,
  X,
  Ticket,
  IndianRupee
} from "lucide-react";
import { scheduleList } from "@/data/schedule";

interface AssignedSeva {
  availability_id: string;
  seva_id: string;
  slug: string;
  title: string;
  title_te?: string;
  short_desc?: string;
  short_desc_te?: string;
  amount: number;
  category: string;
  icon?: string;
  capacity: number;
  booked_count: number;
  status: string; // "AVAILABLE" | "HIDDEN" | "FEW_SLOTS_LEFT" | "FULLY_BOOKED"
  available_slots: number;
}

interface MasterSeva {
  id: string;
  title: string;
  title_te?: string;
  short_desc?: string;
  short_desc_te?: string;
  amount: number;
  category: string;
}

export default function AdminTodayProgrammePage() {
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1); // Default Day 1
  const [schedules, setSchedules] = useState<any[]>([]);
  const [masterSevas, setMasterSevas] = useState<MasterSeva[]>([]);
  const [daySevasMap, setDaySevasMap] = useState<Record<number, AssignedSeva[]>>({});
  
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Add Seva Form Mode: "select" existing master seva vs "create" new custom seva
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [addMode, setAddMode] = useState<"select" | "create">("select");
  const [selectedMasterSevaId, setSelectedMasterSevaId] = useState<string>("");
  const [newSevaCapacity, setNewSevaCapacity] = useState<number>(500);

  // Create Custom Seva fields (Full card attributes)
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customTitleTe, setCustomTitleTe] = useState<string>("");
  const [customShortDesc, setCustomShortDesc] = useState<string>("");
  const [customShortDescTe, setCustomShortDescTe] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<number>(500);
  const [customCategory, setCustomCategory] = useState<string>("homam");

  const [addingSeva, setAddingSeva] = useState<boolean>(false);

  // Edit Seva Inline (All card attributes: Title En/Te, Desc En/Te, Price, Category, Slots)
  const [editingAvailId, setEditingAvailId] = useState<string | null>(null);
  const [editSevaId, setEditSevaId] = useState<string>("");
  const [editCapValue, setEditCapValue] = useState<number>(500);
  const [editTitleVal, setEditTitleVal] = useState<string>("");
  const [editTitleTeVal, setEditTitleTeVal] = useState<string>("");
  const [editShortDescVal, setEditShortDescVal] = useState<string>("");
  const [editShortDescTeVal, setEditShortDescTeVal] = useState<string>("");
  const [editAmountVal, setEditAmountVal] = useState<number>(500);
  const [editCategoryVal, setEditCategoryVal] = useState<string>("homam");

  const showNotification = (text: string, type: "ok" | "err" = "ok") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch schedules, day sevas, and master sevas
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch 28-day schedule metadata
      const schedRes = await fetch("/api/admin/schedule");
      const schedJson = await schedRes.json();
      let schedList: any[] = [];
      if (schedJson.success && Array.isArray(schedJson.data) && schedJson.data.length > 0) {
        schedList = schedJson.data;
      } else {
        schedList = scheduleList.map((s) => ({
          day_number: s.dayNumber,
          date: s.date,
          date_display: s.date,
          nakshatra: s.nakshatra,
          title: s.title,
          morning_programme: s.programme || "Rudra Parayanam & Abhishekam",
          evening_programme: s.eveningProgramme || "Veda Swasti & Nakshatra Harathi",
          special_programme: s.specialProgramme || s.pradhanaHomam || "",
          description: s.specialSeva || "",
          status: "SCHEDULED",
        }));
      }
      setSchedules(schedList);

      // 2. Fetch day-wise sevas allocations from DB
      const sevasRes = await fetch("/api/admin/schedule/sevas");
      const sevasJson = await sevasRes.json();
      if (sevasJson.success && Array.isArray(sevasJson.data)) {
        const map: Record<number, AssignedSeva[]> = {};
        sevasJson.data.forEach((row: any) => {
          map[row.day_number] = row.assigned_sevas || [];
        });
        setDaySevasMap(map);
      }

      // 3. Fetch master sevas catalog for select list
      const masterRes = await fetch("/api/admin/sevas");
      const masterJson = await masterRes.json();
      if (masterJson.success && Array.isArray(masterJson.data)) {
        setMasterSevas(masterJson.data);
        if (masterJson.data.length > 0) {
          setSelectedMasterSevaId(masterJson.data[0].id);
        }
      }
    } catch (err: any) {
      console.error("Failed to load today page data:", err);
      showNotification("Error loading data: " + err.message, "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Active day schedule object
  const currentDay = schedules.find((s) => s.day_number === activeDayNumber) || schedules[0] || {
    day_number: 1,
    date: "2026-11-25",
    date_display: "25 November 2026",
    nakshatra: "Rohini Nakshatram",
    title: "Opening Day",
    morning_programme: "Kalasa Sthapana & Sakala Devata Avahana",
    evening_programme: "Veda Swasti & Rohini Nakshatra Harathi",
    special_programme: "Opening Day Kalasa Sthapana",
    description: "Opening Day Rituals",
    status: "SCHEDULED",
  };

  // Sevas assigned to active day
  const currentDaySevas = daySevasMap[activeDayNumber] || [];

  // Reset sub-states when active day changes
  useEffect(() => {
    setShowAddForm(false);
    setEditingAvailId(null);
  }, [activeDayNumber]);

  // 1. TOGGLE SHOW / HIDE SEVA FROM USER WEBSITE
  const handleToggleSevaVisibility = async (availId: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === "HIDDEN" ? "AVAILABLE" : "HIDDEN";
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(
          `"${title}" is now ${newStatus === "HIDDEN" ? "HIDDEN from website" : "VISIBLE on website"}.`
        );
        fetchAllData();
      } else {
        showNotification("Failed to toggle: " + (json.error || "Unknown error"), "err");
      }
    } catch (err: any) {
      showNotification("Error toggling: " + err.message, "err");
    }
  };

  // 2. EDIT SEVA DETAILS (FULL CARD ATTRIBUTES: TITLE EN/TE, DESC EN/TE, PRICE, CATEGORY, SLOTS)
  const handleSaveSevaEdits = async (availId: string, sevaId: string) => {
    try {
      // Update capacity & status on availability
      const capRes = await fetch("/api/admin/schedule/sevas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId, capacity: editCapValue }),
      });
      const capJson = await capRes.json();

      // Update all master seva fields
      await fetch(`/api/admin/sevas/${sevaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitleVal,
          title_te: editTitleTeVal,
          short_desc: editShortDescVal,
          short_desc_te: editShortDescTeVal,
          amount: editAmountVal,
          category: editCategoryVal,
        }),
      });

      if (capJson.success) {
        showNotification("Seva card details updated successfully!");
        setEditingAvailId(null);
        fetchAllData();
      } else {
        showNotification("Failed to update: " + (capJson.error || "Unknown error"), "err");
      }
    } catch (err: any) {
      showNotification("Error updating seva: " + err.message, "err");
    }
  };

  // 3. DELETE SEVA FROM ACTIVE DAY
  const handleRemoveSeva = async (availId: string, title: string) => {
    if (!confirm(`Remove "${title}" from Day ${currentDay.day_number}?`)) return;
    try {
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_id: availId }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`"${title}" removed from Day ${currentDay.day_number}.`);
        fetchAllData();
      } else {
        showNotification("Failed to remove: " + (json.error || "Unknown error"), "err");
      }
    } catch (err: any) {
      showNotification("Error removing seva: " + err.message, "err");
    }
  };

  // 4. ADD SEVA / PROGRAMME TO ACTIVE DAY
  const handleAddSevaToDay = async () => {
    if (!currentDay.date) return;
    setAddingSeva(true);
    try {
      let targetSevaId = selectedMasterSevaId;

      // If creating a brand new custom seva with full card fields
      if (addMode === "create") {
        if (!customTitle || !customAmount) {
          alert("Please enter a Title and Contribution Amount (₹) for the new Seva.");
          setAddingSeva(false);
          return;
        }
        const createRes = await fetch("/api/admin/sevas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: customTitle,
            title_te: customTitleTe,
            short_desc: customShortDesc,
            short_desc_te: customShortDescTe,
            amount: customAmount,
            category: customCategory,
            active: true,
          }),
        });
        const createJson = await createRes.json();
        if (!createJson.success || !createJson.data) {
          throw new Error(createJson.error || "Failed to create new master seva.");
        }
        targetSevaId = createJson.data.id;
      }

      const dateKey = typeof currentDay.date === "string" ? currentDay.date.split("T")[0] : (currentDay.date as any).toISOString().split("T")[0];
      const res = await fetch("/api/admin/schedule/sevas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateKey,
          day_number: currentDay.day_number,
          seva_id: targetSevaId,
          capacity: newSevaCapacity,
          status: "AVAILABLE",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Seva successfully added to Day ${currentDay.day_number}!`);
        setShowAddForm(false);
        setCustomTitle("");
        setCustomTitleTe("");
        setCustomShortDesc("");
        setCustomShortDescTe("");
        setCustomAmount(500);
        fetchAllData();
      } else {
        showNotification("Failed to add seva: " + (json.error || "Unknown error"), "err");
      }
    } catch (err: any) {
      showNotification("Error adding seva: " + err.message, "err");
    } finally {
      setAddingSeva(false);
    }
  };

  // 5. AUTO-SEED DEFAULT SEVAS FOR ALL DAYS
  const handleAutoSeed = async () => {
    if (!confirm(`Populate default sevas for all 28 festival days?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/schedule/sevas/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification("Default sevas successfully populated for all 28 days!");
        fetchAllData();
      } else {
        showNotification("Auto-seed failed: " + (json.error || "Unknown error"), "err");
      }
    } catch (err: any) {
      showNotification("Error during auto-seed: " + err.message, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
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
            Select any day to manage its rituals, live sequence, and daily Seva booking availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* DAY SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gold font-cinzel font-bold shrink-0">Select Day:</span>
            <select
              value={activeDayNumber}
              onChange={(e) => setActiveDayNumber(Number(e.target.value))}
              className="px-3 py-2 text-xs rounded-lg bg-burgundy-dark border border-gold/50 text-gold-lighter font-cinzel outline-none focus:border-gold shadow-md font-bold"
            >
              {(schedules.length > 0 ? schedules : scheduleList).map((d: any) => {
                const dayNum = d.day_number || d.dayNumber;
                return (
                  <option key={dayNum} value={dayNum}>
                    Day {String(dayNum).padStart(2, "0")} — {d.nakshatra} ({d.date})
                  </option>
                );
              })}
            </select>
          </div>

          <Button
            onClick={fetchAllData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-xs font-bold border-gold/40 text-gold hover:bg-gold/10 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in duration-200 ${
            toastMsg.type === "ok"
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/80 border-red-500/50 text-red-200"
          }`}
        >
          {toastMsg.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="ml-auto opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top 3 Live Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Current Day & Nakshatra</span>
          <h3 className="text-xl font-black text-ivory">
            Day {currentDay.day_number}: {currentDay.nakshatra}
          </h3>
          <p className="text-xs text-gold/80">{currentDay.date_display || currentDay.date}</p>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Pradhana Deity & Homam</span>
          <h3 className="text-lg font-bold text-ivory truncate">
            {currentDay.special_programme || currentDay.title || "Special Homam"}
          </h3>
          <p className="text-xs text-gold/80">{currentDay.description || "Sri Nakshatreswara Parameswara"}</p>
        </Card>

        <Card className="p-5 bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold/30 space-y-1">
          <span className="text-xs text-gold-light font-cinzel uppercase">Yagnashala Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-300">
              {currentDay.status === "LIVE"
                ? "Live Rituals Active"
                : currentDay.status === "COMPLETED"
                ? "Completed Today"
                : "Rituals In Progress"}
            </span>
          </div>
          <p className="text-xs text-ivory/60">Morning & Evening batches active</p>
        </Card>
      </div>

      {/* SEVAS & PROGRAMMES FOR DAY X (REAL-TIME DYNAMIC MANAGEMENT) */}
      <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/20 pb-3">
          <div>
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <Ticket className="w-5 h-5 text-gold" />
              Day {currentDay.day_number} ({currentDay.nakshatra}) Sevas & Programmes Desk
            </h3>
            <p className="text-xs text-ivory/60 mt-0.5">
              Add, edit full card details (Title En/Te, Description En/Te, Price, Category, Capacity), or toggle visibility (show/hide).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="gold"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Seva / Programme to Day {currentDay.day_number}
            </Button>
          </div>
        </div>

        {/* Add Seva / Programme Form */}
        {showAddForm && (
          <div className="p-4 rounded-xl bg-burgundy/90 border border-gold/40 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gold/20 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider font-cinzel text-gold flex items-center gap-2">
                <Plus className="w-4 h-4 text-gold" />
                Add New Seva / Programme to Day {currentDay.day_number} ({currentDay.nakshatra})
              </h4>
              <button onClick={() => setShowAddForm(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switch Mode: Select from Master Catalog vs Create New Seva */}
            <div className="flex items-center gap-3 border-b border-gold/15 pb-3">
              <button
                type="button"
                onClick={() => setAddMode("select")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-cinzel transition-all whitespace-nowrap shrink-0 ${
                  addMode === "select"
                    ? "bg-gold text-burgundy-deep shadow-sm"
                    : "bg-burgundy-dark text-ivory/70 border border-gold/30 hover:text-gold"
                }`}
              >
                Choose from Catalog
              </button>
              <button
                type="button"
                onClick={() => setAddMode("create")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-cinzel transition-all whitespace-nowrap shrink-0 ${
                  addMode === "create"
                    ? "bg-gold text-burgundy-deep shadow-sm"
                    : "bg-burgundy-dark text-ivory/70 border border-gold/30 hover:text-gold"
                }`}
              >
                + Create Custom Seva (Full Card Details)
              </button>
            </div>

            {addMode === "select" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-cinzel text-ivory/80">Select Seva from Catalog</label>
                  <select
                    value={selectedMasterSevaId}
                    onChange={(e) => setSelectedMasterSevaId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg admin-input font-cinzel text-black font-bold outline-none focus:border-gold"
                  >
                    {masterSevas.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — ₹{s.amount?.toLocaleString("en-IN")} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-cinzel text-ivory/80">Ticket Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={newSevaCapacity}
                    onChange={(e) => setNewSevaCapacity(parseInt(e.target.value, 10) || 100)}
                    className="w-full px-3 py-2 text-xs rounded-lg admin-input font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Title En & Te */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Seva Title (English) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sampoorna Nakshatra Shanthi"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-input font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Seva Title (Telugu)</label>
                    <input
                      type="text"
                      placeholder="ఉదా. సంపూర్ణ నక్షత్ర శాంతి"
                      value={customTitleTe}
                      onChange={(e) => setCustomTitleTe(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-input font-telugu font-bold"
                    />
                  </div>
                </div>

                {/* Descriptions En & Te */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Short Description (English)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Complete Janma Nakshatra Shanthi performed with Sankalpam..."
                      value={customShortDesc}
                      onChange={(e) => setCustomShortDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-textarea font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Short Description (Telugu)</label>
                    <textarea
                      rows={2}
                      placeholder="ఉదా. భక్తుని పేరిట సంకల్పంతో నిర్వహించే సంపూర్ణ జన్మ నక్షత్ర శాంతి..."
                      value={customShortDescTe}
                      onChange={(e) => setCustomShortDescTe(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-textarea font-telugu"
                    />
                  </div>
                </div>

                {/* Amount, Category, Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Contribution Amount (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="10116"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-input font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Category Tag</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-input font-bold"
                    >
                      <option value="homam">Homam</option>
                      <option value="abhishekam">Abhishekam</option>
                      <option value="kalyanam">Kalyanam</option>
                      <option value="pooja">Pooja / Archana</option>
                      <option value="special">Special Seva</option>
                      <option value="annadanam">Annadanam</option>
                      <option value="donation">Donation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-cinzel text-ivory/80">Ticket Capacity / Slots</label>
                    <input
                      type="number"
                      min="1"
                      value={newSevaCapacity}
                      onChange={(e) => setNewSevaCapacity(parseInt(e.target.value, 10) || 100)}
                      className="w-full px-3 py-2 text-xs rounded-lg admin-input font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gold/10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-ivory/70 hover:text-ivory"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="gold"
                onClick={handleAddSevaToDay}
                disabled={addingSeva}
                leftIcon={addingSeva ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                className="text-xs font-bold whitespace-nowrap"
              >
                Save Seva to Day {currentDay.day_number}
              </Button>
            </div>
          </div>
        )}

        {/* Current Day Sevas Cards List */}
        {loading ? (
          <div className="py-8 text-center text-xs text-gold/70 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold" />
            <span>Loading Day {currentDay.day_number} Sevas...</span>
          </div>
        ) : currentDaySevas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDaySevas.map((seva) => {
              const isHidden = seva.status === "HIDDEN";
              const isEditing = editingAvailId === seva.availability_id;

              return (
                <div
                  key={seva.availability_id || seva.seva_id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isHidden
                      ? "bg-zinc-950/70 border-zinc-800 opacity-60"
                      : "bg-burgundy/60 border-gold/20 hover:border-gold/40"
                  }`}
                >
                  {/* Seva Header Info / Full Edit Form */}
                  {isEditing ? (
                    <div className="space-y-3 p-3.5 rounded-lg bg-burgundy-dark border border-gold/40">
                      <h4 className="text-xs font-bold uppercase font-cinzel text-gold border-b border-gold/20 pb-1.5">
                        Edit Full Seva Card Details
                      </h4>

                      {/* Title En & Te */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Title (English)</label>
                          <input
                            type="text"
                            value={editTitleVal}
                            onChange={(e) => setEditTitleVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded admin-input font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Title (Telugu)</label>
                          <input
                            type="text"
                            value={editTitleTeVal}
                            onChange={(e) => setEditTitleTeVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded admin-input font-telugu font-bold"
                          />
                        </div>
                      </div>

                      {/* Description En & Te */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Short Desc (English)</label>
                          <textarea
                            rows={2}
                            value={editShortDescVal}
                            onChange={(e) => setEditShortDescVal(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs rounded admin-textarea"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Short Desc (Telugu)</label>
                          <textarea
                            rows={2}
                            value={editShortDescTeVal}
                            onChange={(e) => setEditShortDescTeVal(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs rounded admin-textarea font-telugu"
                          />
                        </div>
                      </div>

                      {/* Amount, Category, Capacity */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Contribution (₹)</label>
                          <input
                            type="number"
                            value={editAmountVal}
                            onChange={(e) => setEditAmountVal(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 text-xs rounded admin-input font-mono font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Category Tag</label>
                          <select
                            value={editCategoryVal}
                            onChange={(e) => setEditCategoryVal(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded admin-input font-bold"
                          >
                            <option value="homam">Homam</option>
                            <option value="abhishekam">Abhishekam</option>
                            <option value="kalyanam">Kalyanam</option>
                            <option value="pooja">Pooja / Archana</option>
                            <option value="special">Special Seva</option>
                            <option value="annadanam">Annadanam</option>
                            <option value="donation">Donation</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-cinzel text-gold">Ticket Slots</label>
                          <input
                            type="number"
                            min="1"
                            value={editCapValue}
                            onChange={(e) => setEditCapValue(parseInt(e.target.value, 10) || 1)}
                            className="w-full px-2 py-1.5 text-xs rounded admin-input font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingAvailId(null)}
                          className="text-xs text-ivory/70 h-7 px-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="gold"
                          onClick={() => handleSaveSevaEdits(seva.availability_id, seva.seva_id)}
                          className="text-xs font-bold h-7 px-3"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode: Rich Seva Card (Matching Website Card Structure) */
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2 border-b border-gold/15 pb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-cinzel font-bold tracking-widest px-2 py-0.5 rounded bg-gold/20 text-gold-lighter border border-gold/30">
                              {seva.category === "homam" ? "Nakshatra Seva" : seva.category}
                            </span>
                            {seva.slug && (
                              <span className="text-[10px] font-mono text-ivory/40">id: {seva.seva_id}</span>
                            )}
                          </div>
                          <h4 className="text-sm font-black font-cinzel text-gold-lighter">{seva.title}</h4>
                          {seva.title_te && (
                            <p className="text-xs text-gold/90 font-telugu">{seva.title_te}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-cinzel text-gold/70 block uppercase tracking-wider">Contribution</span>
                          <span className="text-base font-black font-cinzel text-gold-light">
                            ₹{seva.amount?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Card Description */}
                      {(seva.short_desc || seva.short_desc_te) && (
                        <div className="space-y-0.5 text-xs text-ivory/80 font-sans">
                          {seva.short_desc && <p className="leading-relaxed">{seva.short_desc}</p>}
                          {seva.short_desc_te && (
                            <p className="text-[11px] text-gold-light/75 font-telugu leading-relaxed">{seva.short_desc_te}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar: Show/Hide Toggle, Capacity Edit, Delete */}
                  {!isEditing && (
                    <div className="pt-2 border-t border-gold/15 flex items-center justify-between text-xs">
                      {/* SHOW / HIDE TOGGLE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleToggleSevaVisibility(seva.availability_id, seva.status, seva.title)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-md ${
                          isHidden
                            ? "bg-red-900/90 text-red-100 border-red-400 hover:bg-red-800"
                            : "bg-emerald-900/90 text-emerald-100 border-emerald-400 hover:bg-emerald-800"
                        }`}
                        title={isHidden ? "Click to SHOW on website" : "Click to HIDE from website"}
                      >
                        {isHidden ? (
                          <>
                            <EyeOff className="w-4 h-4 text-red-300 shrink-0" />
                            <span className="whitespace-nowrap font-bold">HIDDEN FROM USERS</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 text-emerald-300 shrink-0" />
                            <span className="whitespace-nowrap font-bold">VISIBLE TO USERS</span>
                          </>
                        )}
                      </button>

                      {/* EDIT CARD DETAILS & DELETE */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs text-ivory/80 flex items-center gap-1 whitespace-nowrap">
                          <span className="text-[10px] text-ivory/50">Slots:</span>
                          <strong className="text-gold">{seva.capacity}</strong>
                        </span>

                        <button
                          onClick={() => {
                            setEditingAvailId(seva.availability_id);
                            setEditSevaId(seva.seva_id);
                            setEditCapValue(seva.capacity);
                            setEditTitleVal(seva.title || "");
                            setEditTitleTeVal(seva.title_te || "");
                            setEditShortDescVal(seva.short_desc || "");
                            setEditShortDescTeVal(seva.short_desc_te || "");
                            setEditAmountVal(seva.amount || 0);
                            setEditCategoryVal(seva.category || "homam");
                          }}
                          className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors flex items-center gap-1 text-[11px] font-bold whitespace-nowrap shrink-0"
                          title="Edit Seva Title, Description, Price & Slots"
                        >
                          <Edit2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">Edit Card</span>
                        </button>

                        <button
                          onClick={() => handleRemoveSeva(seva.availability_id, seva.title)}
                          className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Remove Seva from Day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-gold/30 rounded-xl space-y-3 bg-burgundy/30">
            <Ticket className="w-8 h-8 text-gold/50 mx-auto" />
            <p className="text-xs text-ivory/70 font-sans">
              No sevas assigned specifically for Day {currentDay.day_number} ({currentDay.nakshatra}) yet.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                size="sm"
                variant="gold"
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs font-bold whitespace-nowrap"
              >
                Add Seva to Day {currentDay.day_number}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}