'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Printer,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Sparkles,
  User,
  CheckCircle2,
  FileText,
  Building,
  Award
} from 'lucide-react';

export default function AdminSankalpamPage() {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // 28 Days dates lookup starting Nov 25, 2026
  const getDayDateString = (dayNum: number) => {
    const startDate = new Date(2026, 10, 25); // Nov 25, 2026
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + (dayNum - 1));
    return curDate.toISOString().split('T')[0];
  };

  const fetchSankalpamReport = async (dayNum: number, dateStr?: string) => {
    try {
      setLoading(true);
      const targetDate = dateStr || getDayDateString(dayNum);
      const res = await fetch(`/api/admin/reports/sankalpam?date=${targetDate}&day=${dayNum}`);
      const json = await res.json();
      if (json.success) {
        setReportData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch Sankalpam report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dateStr = getDayDateString(activeDay);
    setSelectedDate(dateStr);
    fetchSankalpamReport(activeDay, dateStr);
  }, [activeDay]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.records) return;

    const headers = ['S.No', 'Booking ID', 'Devotee Name', 'Sankalpam Names', 'Gotram', 'Nakshatram', 'Seva Name', 'Attendance', 'Amount (INR)'];
    const rows = reportData.records.map((r: any, idx: number) => [
      idx + 1,
      r.booking_id,
      `"${(r.devotee_name || '').replace(/"/g, '""')}"`,
      `"${(r.sankalpam_names || r.devotee_name || '').replace(/"/g, '""')}"`,
      `"${(r.gotram || '').replace(/"/g, '""')}"`,
      `"${(r.nakshatram || '').replace(/"/g, '""')}"`,
      `"${(r.seva || '').replace(/"/g, '""')}"`,
      r.attending_personally ? 'Attending in Person' : 'Courier Prasadam',
      r.amount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vedic_Sankalpam_Day_${activeDay}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter records
  const records = reportData?.records || [];
  const filteredRecords = records.filter((r: any) => {
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (r.devotee_name || '').toLowerCase().includes(queryLower) ||
      (r.sankalpam_names || '').toLowerCase().includes(queryLower) ||
      (r.gotram || '').toLowerCase().includes(queryLower) ||
      (r.booking_id || '').toLowerCase().includes(queryLower) ||
      (r.seva || '').toLowerCase().includes(queryLower);

    const matchesCategory =
      filterCategory === 'all' ||
      (r.seva || '').toLowerCase().includes(filterCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Printable CSS Injection */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, nav, sidebar, .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .print-card {
            background: #ffffff !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .print-table {
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #000000 !important;
            color: #000000 !important;
            padding: 6px 8px !important;
          }
          .print-badge {
            border: 1px solid #000000 !important;
            color: #000000 !important;
            background: none !important;
          }
        }
      `}</style>

      {/* TOP CONTROL BAR (HIDDEN IN PRINT) */}
      <div className="no-print space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-6 h-6 text-gold" />
              <h1 className="font-cinzel text-2xl font-bold text-ivory">
                Vedic Priest Sankalpam Register (అర్చక సంకల్ప పత్రిక)
              </h1>
            </div>
            <p className="text-xs text-ivory/70">
              Printable daily sankalpam list for Yajnashala Vedic Pundits, grouped by Day 1–28 with Gotram, Nakshatram, and family names.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSankalpamReport(activeDay, selectedDate)}
              disabled={loading}
              className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>

            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light shadow-md"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Sankalpam Register
            </Button>
          </div>
        </div>

        {/* 28-DAY SELECTOR STRIP */}
        <div className="p-4 rounded-xl bg-[#230206] border border-gold/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              Select Mahayagnam Day (Day 1 - 28):
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-ivory/60">Custom Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  fetchSankalpamReport(activeDay, e.target.value);
                }}
                className="bg-[#150002] border border-gold/30 text-gold text-xs rounded p-1"
              />
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeDay === d
                    ? 'bg-gold text-maroon shadow-md scale-105 font-black'
                    : 'bg-[#150002] text-ivory/70 border border-gold/20 hover:text-gold hover:bg-gold/10'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#230206] border border-gold/20">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gold/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search devotee, gotram, nakshatram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#150002] border-gold/30 text-ivory pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gold/70 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#150002] border border-gold/30 text-ivory text-xs rounded-lg p-2 w-full sm:w-48"
            >
              <option value="all">All Seva Categories</option>
              <option value="homam">Homam</option>
              <option value="abhishekam">Abhishekam</option>
              <option value="kalyanam">Kalyanam</option>
              <option value="hawan">Nakshatra Hawan</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN SANKALPAM DOCUMENT PRINT AREA */}
      <div className="print-container">
        <Card className="print-card p-6 sm:p-8 bg-[#230206] border-gold/30 space-y-6 shadow-2xl">
          {/* SACRED DOCUMENT HEADER */}
          <div className="text-center space-y-2 border-b-2 border-gold/40 pb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🕉️</span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-gold tracking-wide">
                శ్రీకరి అతి రుద్ర మహాయజ్ఞం 2026
              </h2>
              <span className="text-2xl">🕉️</span>
            </div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-ivory uppercase tracking-wider">
              యజ్ఞవేదిక అర్చక స్వాముల సంకల్ప పత్రిక — DAY {activeDay}
            </h3>
            <p className="text-xs text-gold-light/90 font-mono">
              Date: {selectedDate} {reportData?.schedule?.nakshatra ? `| Nakshatram: ${reportData.schedule.nakshatra}` : ''}
            </p>
            <div className="inline-flex items-center gap-3 pt-1 text-[11px] text-ivory/80">
              <span className="print-badge px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-semibold">
                Total Registered Sankalpams: {filteredRecords.length}
              </span>
              <span>•</span>
              <span>Srikari Sri Kshetram, Yajna Vedika</span>
            </div>
          </div>

          {/* TABLE OF SANKALPAMS */}
          {loading ? (
            <div className="text-center py-12 text-gold animate-pulse text-sm">
              Loading Yajnashala Sankalpam Register...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-ivory/60 text-xs">
              No confirmed sankalpam registrations found for Day {activeDay} ({selectedDate}).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="print-table w-full text-left text-xs border-collapse border border-gold/30">
                <thead>
                  <tr className="bg-[#150002] text-gold font-cinzel font-bold border-b border-gold/40">
                    <th className="p-3 text-center border-r border-gold/20 w-12">S.No</th>
                    <th className="p-3 border-r border-gold/20 w-28">Booking ID</th>
                    <th className="p-3 border-r border-gold/20 font-bold">Devotee & Sankalpam Names</th>
                    <th className="p-3 border-r border-gold/20 w-36">Gotram (గోత్రం)</th>
                    <th className="p-3 border-r border-gold/20 w-32">Nakshatra / Rasi</th>
                    <th className="p-3 border-r border-gold/20">Seva Offering</th>
                    <th className="p-3 border-r border-gold/20 text-center w-28">Attendance</th>
                    <th className="p-3 text-center w-20 no-print">Done</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/15 text-ivory">
                  {filteredRecords.map((r: any, idx: number) => {
                    const isDone = checkedItems[r.booking_id];
                    return (
                      <tr
                        key={r.booking_id || idx}
                        className={`hover:bg-gold/5 transition-colors ${
                          isDone ? 'bg-emerald-950/30' : idx % 2 === 0 ? 'bg-transparent' : 'bg-[#1D0104]/50'
                        }`}
                      >
                        <td className="p-3 text-center font-mono font-bold text-gold/80 border-r border-gold/20">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-ivory/70 border-r border-gold/20">
                          {r.booking_id}
                        </td>
                        <td className="p-3 border-r border-gold/20">
                          <div className="font-bold text-ivory text-sm">{r.sankalpam_names || r.devotee_name}</div>
                          {r.devotee_name !== r.sankalpam_names && (
                            <div className="text-[10px] text-gold/70">Primary: {r.devotee_name}</div>
                          )}
                        </td>
                        <td className="p-3 font-medium text-gold-light border-r border-gold/20">
                          {r.gotram || 'Not Specified'}
                        </td>
                        <td className="p-3 text-ivory/90 border-r border-gold/20">
                          <div className="font-semibold">{r.nakshatram || 'Star'}</div>
                          {r.rasi && <div className="text-[10px] text-ivory/50">{r.rasi}</div>}
                        </td>
                        <td className="p-3 font-semibold text-ivory border-r border-gold/20">
                          {r.seva}
                        </td>
                        <td className="p-3 text-center border-r border-gold/20">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.attending_personally
                                ? 'bg-amber-950/80 text-gold border border-gold/40'
                                : 'bg-purple-950/80 text-purple-200 border border-purple-500/40'
                            }`}
                          >
                            {r.attending_personally ? '🪔 Attending' : '📦 Courier'}
                          </span>
                        </td>
                        <td className="p-3 text-center no-print">
                          <button
                            type="button"
                            onClick={() => toggleCheck(r.booking_id)}
                            className={`p-1 rounded transition-colors ${
                              isDone ? 'text-emerald-400 bg-emerald-950/80' : 'text-ivory/30 hover:text-gold'
                            }`}
                            title="Mark Priest Chanting Completed"
                          >
                            <CheckCircle2 className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* FOOTER SIGNATURE & SEAL BLOCK (FOR PRINT) */}
          <div className="pt-6 border-t border-gold/30 grid grid-cols-2 text-center text-xs text-ivory/70 gap-8">
            <div className="space-y-12">
              <p>యజ్ఞవేదిక ప్రధాన వేద పండితుల సంతకం (Chief Priest Signature):</p>
              <div className="border-b border-dashed border-gold/40 w-48 mx-auto" />
            </div>
            <div className="space-y-12">
              <p>శ్రీకరి క్షేత్ర నిర్వహణ సమితి ప్రామాణీకరణ (Temple Committee Seal):</p>
              <div className="border-b border-dashed border-gold/40 w-48 mx-auto" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
