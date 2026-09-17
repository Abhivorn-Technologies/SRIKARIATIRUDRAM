'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Users, Search, Phone, Mail, MapPin, RefreshCw, AlertCircle, Eye, X } from 'lucide-react';

export default function AdminDevoteesPage() {
  const [devotees, setDevotees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevotee, setSelectedDevotee] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchDevotees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/devotees?search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setDevotees(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch devotees');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotees();
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(devotees.length / itemsPerPage) || 1;
  const paginatedDevotees = devotees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDevotee = async (devotee: any) => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`/api/admin/devotees/${devotee.phone_number}`);
      const json = await res.json();
      if (json.success) {
        setSelectedDevotee(json.data);
      } else {
        setSelectedDevotee({ devotee, bookings: [], donations: [] });
      }
    } catch (e) {
      setSelectedDevotee({ devotee, bookings: [], donations: [] });
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Devotee CRM & Directory
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Unified profiles of registered devotees, gotrams, nakshatrams, and lifetime contribution history
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchDevotees}
          disabled={loading}
          className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
        </Button>
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
            placeholder="Search by devotee name, phone, gotram, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-9"
          />
        </div>
        <div className="text-xs text-ivory/70">
          Total Devotees in CRM: <span className="text-gold font-bold">{devotees.length}</span>
        </div>
      </Card>

      {/* Devotees Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Devotee Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Gotram</th>
                <th className="py-3 px-4">Nakshatram / Rasi</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Total Bookings</th>
                <th className="py-3 px-4">Total Contributed</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {paginatedDevotees.length > 0 ? (
                paginatedDevotees.map((d) => (
                  <tr key={d.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-ivory">
                      {d.full_name}
                      {d.email && <div className="text-[10px] text-ivory/50">{d.email}</div>}
                    </td>
                    <td className="py-3 px-4 text-ivory/80 font-mono">
                      {d.phone_number}
                    </td>
                    <td className="py-3 px-4 text-ivory/90 font-medium">
                      {d.gotram || '-'}
                    </td>
                    <td className="py-3 px-4 text-gold">
                      {d.nakshatram || '-'} {d.rasi ? `(${d.rasi})` : ''}
                    </td>
                    <td className="py-3 px-4 text-ivory/70">
                      {d.city || 'Hyderabad'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] border-gold/40 text-gold bg-gold/10 font-bold">
                        {d.total_bookings} Bookings
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      ₹{Number(d.total_donated || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDevotee(d)}
                        className="h-7 px-2 text-gold hover:bg-gold/10 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View History
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ivory/50 italic">
                    {loading ? 'Loading devotees from database...' : 'No devotee records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={devotees.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          className="rounded-t-none border-t border-gold/15"
        />
      </Card>

      {/* Devotee History Drawer/Modal */}
      {selectedDevotee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">
                  {selectedDevotee.devotee?.full_name}
                </h3>
                <p className="text-xs text-ivory/60">
                  {selectedDevotee.devotee?.phone_number} • Gotram: {selectedDevotee.devotee?.gotram || '-'} • Nakshatra: {selectedDevotee.devotee?.nakshatram || '-'}
                </p>
              </div>
              <button onClick={() => setSelectedDevotee(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <h4 className="font-cinzel text-sm font-bold text-gold">Registered Sevas ({selectedDevotee.bookings?.length || 0})</h4>
              <div className="space-y-2">
                {selectedDevotee.bookings?.length > 0 ? (
                  selectedDevotee.bookings.map((b: any) => (
                    <div key={b.id} className="p-3 rounded-lg bg-[#1A0004] border border-gold/15 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-ivory">{b.seva_name}</div>
                        <div className="text-[11px] text-ivory/60">Date: {b.selected_date} • Booking ID: {b.booking_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-gold">₹{Number(b.amount).toLocaleString('en-IN')}</div>
                        <span className="text-[10px] text-emerald-400 font-bold">{b.payment_status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ivory/50 italic">No bookings found for this devotee.</p>
                )}
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-gold/20">
              <Button size="sm" variant="outline" onClick={() => setSelectedDevotee(null)} className="border-gold/30 text-gold text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
