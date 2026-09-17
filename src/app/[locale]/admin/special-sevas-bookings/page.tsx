'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Flame,
  PlusCircle,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Printer,
  IndianRupee,
  Phone,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Sparkles,
  Filter
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminSpecialSevasBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sevaFilter, setSevaFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchSpecialBookings = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      params.set('type', 'SPECIAL');
      if (searchQuery) params.set('search', searchQuery);
      if (sevaFilter) params.set('seva_id', sevaFilter);
      if (paymentFilter) params.set('payment_status', paymentFilter);
      if (attendanceFilter) params.set('attendance', attendanceFilter);
      if (dateFilter) params.set('date', dateFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data || []);
        setPagination(json.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
      } else {
        setError(json.error || 'Failed to load Special Seva bookings');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching Special Seva bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialBookings(1);
  }, [searchQuery, sevaFilter, paymentFilter, attendanceFilter, dateFilter]);

  const handleAttendanceToggle = async (bookingId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PRESENT' ? 'ABSENT' : (currentStatus === 'ABSENT' ? 'PENDING' : 'PRESENT');
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: nextStatus })
      });
      const json = await res.json();
      if (json.success) {
        setBookings(prev => prev.map(b => (b.id === bookingId || b.booking_id === bookingId) ? { ...b, attendance: nextStatus } : b));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update attendance');
    }
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return alert('No records to export');
    const headers = ['Booking ID', 'Devotee Name', 'Phone', 'Gotram', 'Nakshatra', 'Seva Name', 'Date', 'Amount', 'Payment Status', 'Attendance', 'Sankalpam Names'];
    const rows = bookings.map(b => [
      b.booking_id,
      `"${b.full_name || ''}"`,
      `"${b.phone_number || ''}"`,
      `"${b.gotram || ''}"`,
      `"${b.janma_nakshatra || b.nakshatra || ''}"`,
      `"${b.seva_name || ''}"`,
      b.selected_date,
      b.amount,
      b.payment_status,
      b.attendance,
      `"${b.sankalpam_names || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Special_Seva_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-amber-400" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Special Sevas Devotee Bookings
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Dedicated ledger for Chandi Homam, Aslesha Bali, Kumkumarchana, Sarpa Sukta, Kalyanam, and Special Rituals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSpecialBookings(pagination.page)}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV Sheet
          </Button>

          <Link href="/admin/sankalpam">
            <Button variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10 text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Sankalpam List
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filter Bar */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
            <Input
              placeholder="Search by devotee name, phone, gotram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-9"
            />
          </div>

          <select
            value={sevaFilter}
            onChange={(e) => setSevaFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">-- All Special Sevas --</option>
            <option value="chandi-homam">Chandi Homam</option>
            <option value="aslesha-bali">Aslesha Bali Pooja</option>
            <option value="kumkumarchana">Kumkumarchana Seva</option>
            <option value="sarpa-sukta-homam">Sarpa Sukta Homam</option>
            <option value="subramanyeswara-kalyanam">Subramanyeswara Swamy Kalyanam</option>
            <option value="ekadasa-rudra-abhishekam">Ekadasa Rudra Abhishekam</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">All Payment Statuses</option>
            <option value="SUCCESS">SUCCESS / CONFIRMED</option>
            <option value="PENDING">PENDING</option>
          </select>

          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">All Attendance</option>
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        <div className="text-xs text-gold font-mono">
          Total Special Bookings: <strong>{pagination.total}</strong>
        </div>
      </Card>

      {/* Special Sevas Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Devotee Name & Phone</th>
                <th className="py-3 px-4">Gotram / Nakshatram</th>
                <th className="py-3 px-4">Special Seva Offering</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Dakshina</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id || b.booking_id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      {b.booking_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ivory">{b.full_name}</div>
                      <div className="text-[11px] text-ivory/50 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gold/60" /> {b.phone_number}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-ivory/90 font-medium">{b.gotram || 'Not specified'}</div>
                      <div className="text-[11px] text-gold/80">{b.janma_nakshatra || b.nakshatra}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-bold text-amber-300 truncate flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{b.seva_name}</span>
                      </div>
                      {b.sankalpam_names && (
                        <div className="text-[10px] text-ivory/50 truncate mt-0.5">Sankalpam: {b.sankalpam_names}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-ivory/80">
                      <div>{b.selected_date}</div>
                      <div className="text-[10px] text-gold/70">Day {b.day_number || 1}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      ₹{Number(b.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          b.payment_status === 'SUCCESS' || b.payment_status === 'CONFIRMED'
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                            : 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                        }`}
                      >
                        {b.payment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleAttendanceToggle(b.id || b.booking_id, b.attendance)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                          b.attendance === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : b.attendance === 'ABSENT'
                            ? 'bg-rose-700 text-white'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {b.attendance}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(b)}
                        className="h-7 px-2 text-gold hover:bg-gold/10 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-ivory/60 text-xs space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p>No Special Seva bookings found matching your search filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => fetchSpecialBookings(page, pagination.limit)}
          onItemsPerPageChange={(limit) => fetchSpecialBookings(1, limit)}
          className="rounded-t-none border-t border-gold/15"
        />
      </Card>

      {/* View Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs text-ivory">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <Badge variant="gold" className="text-[10px] uppercase font-cinzel mb-1">
                  Special Seva Booking Record
                </Badge>
                <h3 className="font-cinzel text-lg font-bold text-gold">
                  {selectedBooking.booking_id}
                </h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#1A0004] border border-gold/20 rounded-xl space-y-1.5">
                <div className="text-amber-300 font-bold text-sm flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {selectedBooking.seva_name}
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Scheduled Date:</span>
                  <span className="font-mono font-bold text-gold">{selectedBooking.selected_date}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Dakshina Amount:</span>
                  <span className="font-mono font-bold text-gold">₹{selectedBooking.amount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#1A0004] border border-gold/20 rounded-xl">
                <div>
                  <span className="text-ivory/60 block text-[10px]">Devotee Name:</span>
                  <span className="font-bold text-ivory">{selectedBooking.full_name}</span>
                </div>
                <div>
                  <span className="text-ivory/60 block text-[10px]">Phone Number:</span>
                  <span className="font-mono font-bold text-ivory">{selectedBooking.phone_number}</span>
                </div>
                <div>
                  <span className="text-ivory/60 block text-[10px]">Gotram:</span>
                  <span className="font-medium text-gold">{selectedBooking.gotram || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-ivory/60 block text-[10px]">Nakshatram:</span>
                  <span className="font-medium text-gold">{selectedBooking.janma_nakshatra || selectedBooking.nakshatra || 'N/A'}</span>
                </div>
              </div>

              {selectedBooking.sankalpam_names && (
                <div className="p-3 bg-[#1A0004] border border-gold/20 rounded-xl space-y-1">
                  <span className="text-ivory/60 block text-[10px]">Family Names for Sankalpam:</span>
                  <p className="text-ivory font-medium leading-relaxed">{selectedBooking.sankalpam_names}</p>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button onClick={() => setSelectedBooking(null)} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                Close Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
