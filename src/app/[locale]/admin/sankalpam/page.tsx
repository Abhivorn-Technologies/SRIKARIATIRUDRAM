'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Scroll, Printer, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminSankalpamPage() {
  const [selectedDate, setSelectedDate] = useState('2026-11-26');
  const [sankalpamData, setSankalpamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSankalpam = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/sankalpam?date=${date}`);
      const json = await res.json();
      if (json.success) {
        setSankalpamData(json.data);
      } else {
        setError(json.error || 'Failed to fetch Sankalpam list');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSankalpam(selectedDate);
  }, [selectedDate]);

  const handlePrint = () => {
    window.print();
  };

  const records = sankalpamData?.records || [];

  return (
    <div className="space-y-6">
      {/* Non-print Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scroll className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Sankalpam & Purohit Daily Desk
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Generate and print official Vedic Priest Sankalpam chanting sheets for Homam rituals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSankalpam(selectedDate)}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Daily Sheet (PDF)
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3 print:hidden">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Date Selector Filter */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gold" />
          <label className="text-xs font-semibold text-ivory/80">Select Yajna Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="text-xs text-gold font-cinzel">
          {sankalpamData?.schedule?.title || `Day ${sankalpamData?.schedule?.day_number || 1}`}
        </div>
      </Card>

      {/* Printable Sankalpam Sheet */}
      <div className="p-6 sm:p-8 bg-white text-black rounded-2xl shadow-xl space-y-6 print:p-0 print:shadow-none">
        {/* Printable Header */}
        <div className="text-center border-b-2 border-red-900 pb-4">
          <p className="text-xs font-serif uppercase tracking-widest text-red-900 font-bold">
            Om Namah Shivaya • Sri Matre Namah
          </p>
          <h2 className="text-2xl font-serif font-black text-red-950 mt-1 uppercase tracking-wider">
            SRIKARI ATI RUDRA MAHAYAGNAM 2026
          </h2>
          <h3 className="text-base font-serif font-bold text-amber-900 mt-0.5">
            DAILY PUROHIT SANKALPAM ROSTER
          </h3>
          <div className="mt-2 text-xs font-sans text-gray-700 flex justify-center gap-4">
            <span><strong>Date:</strong> {sankalpamData?.schedule?.date_display || selectedDate}</span>
            <span><strong>Nakshatra:</strong> {sankalpamData?.schedule?.nakshatra || 'Rohini'}</span>
            <span><strong>Day:</strong> {sankalpamData?.schedule?.day_number || 1} of 28</span>
            <span><strong>Total Sankalpams:</strong> {records.length}</span>
          </div>
        </div>

        {/* Sankalpam Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-amber-100/80 border-y-2 border-amber-900 text-amber-950 font-serif font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3 border border-amber-300 text-center w-12">S.No</th>
                <th className="py-2.5 px-3 border border-amber-300">Booking ID</th>
                <th className="py-2.5 px-3 border border-amber-300">Devotee Name</th>
                <th className="py-2.5 px-3 border border-amber-300">Gotram</th>
                <th className="py-2.5 px-3 border border-amber-300">Nakshatram</th>
                <th className="py-2.5 px-3 border border-amber-300">Sankalpam Chanting Names</th>
                <th className="py-2.5 px-3 border border-amber-300">Seva Offering</th>
                <th className="py-2.5 px-3 border border-amber-300 text-center">Participation</th>
                <th className="py-2.5 px-3 border border-amber-300 text-center w-20">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-sans">
              {records.length > 0 ? (
                records.map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/50">
                    <td className="py-2.5 px-3 border border-gray-200 text-center font-bold text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 font-mono text-gray-800 text-[11px]">
                      {r.booking_id}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 font-bold text-gray-900">
                      {r.devotee_name}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-red-900 font-semibold">
                      {r.gotram}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-800 font-medium">
                      {r.nakshatram}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-900 font-serif text-[11px] leading-snug">
                      {r.sankalpam_names}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-800 font-semibold text-[11px]">
                      {r.seva}
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-center text-[10px] font-bold">
                      <span className={(r.attending_personally === 'yes' || r.attending_personally === 'attending') ? 'text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded' : 'text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded'}>
                        {(r.attending_personally === 'yes' || r.attending_personally === 'attending') ? 'IN PERSON' : 'COURIER'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-center font-bold text-[10px]">
                      <span className={r.attendance === 'PRESENT' ? 'text-emerald-700' : 'text-gray-500'}>
                        {r.attendance}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500 italic">
                    {loading ? 'Fetching live Sankalpam registrations...' : 'No confirmed Sankalpam registrations found for this date.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Priest Sign-off Footer */}
        <div className="pt-8 border-t border-gray-300 flex justify-between text-xs text-gray-600 font-serif">
          <div>
            <p>Verified by Yajnashala Desk:</p>
            <div className="mt-8 border-t border-dashed border-gray-400 w-48 text-center pt-1">
              Pradhana Archaka / Priest Signature
            </div>
          </div>
          <div className="text-right">
            <p>Srikari Temple Management Committee</p>
            <div className="mt-8 border-t border-dashed border-gray-400 w-48 text-center pt-1 ml-auto">
              Authorized Committee Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
