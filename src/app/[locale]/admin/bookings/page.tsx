'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ClipboardList,
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
  AlertCircle
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [participationFilter, setParticipationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals & Selected Booking
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    seva_id: 'ati-rudram-donation',
    selected_date: '2026-11-25',
    full_name: '',
    phone_number: '',
    email: '',
    gotram: '',
    janma_nakshatra: 'Rohini',
    sankalpam_names: '',
    address: '',
    city: '',
    attending_personally: 'yes'
  });

  const fetchBookings = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      params.set('type', '28_DAY');
      if (searchQuery) params.set('search', searchQuery);
      if (paymentFilter) params.set('payment_status', paymentFilter);
      if (attendanceFilter) params.set('attendance', attendanceFilter);
      if (participationFilter) params.set('devotee_participation', participationFilter);
      if (dateFilter) params.set('date', dateFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data || []);
        setPagination(json.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
      } else {
        setError(json.error || 'Failed to load bookings');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [searchQuery, paymentFilter, attendanceFilter, participationFilter, dateFilter]);

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
        setBookings(prev => prev.map(b => (b.booking_id === bookingId || b.id === bookingId) ? { ...b, attendance: nextStatus } : b));
      }
    } catch (e) {
      console.error('Error toggling attendance:', e);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      const json = await res.json();
      if (json.success) {
        setIsAddModalOpen(false);
        fetchBookings(1);
      } else {
        alert(json.error || 'Failed to create booking');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchBookings(pagination.page);
      } else {
        alert(json.error || 'Failed to delete booking');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              28-Day Festival Seva Bookings
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Dedicated ledger of registered devotee tickets, Nakshatra Hawans, gotrams, and sankalpams for the 28-day festival
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBookings(pagination.page)}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/admin/sankalpam">
            <Button variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10 text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Sankalpam
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gold text-maroon font-bold hover:bg-gold-light text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            New Offline Booking
          </Button>
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
              placeholder="Search by devotee, phone, gotram, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs bg-[#1A0004] border-gold/30 text-ivory h-9"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">All Payment Status</option>
            <option value="SUCCESS">Confirmed / Paid</option>
            <option value="PENDING">Pending Verification</option>
          </select>

          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">All Attendance</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="PENDING">Pending</option>
          </select>

          <select
            value={participationFilter}
            onChange={(e) => setParticipationFilter(e.target.value)}
            className="text-xs bg-[#1A0004] border border-gold/30 text-ivory rounded-lg px-3 h-9 focus:outline-none focus:border-gold"
          >
            <option value="">All Devotee Participation</option>
            <option value="attending">Attending in Person</option>
            <option value="not-attending">Not Attending (Courier)</option>
          </select>
        </div>

        <div className="text-xs text-ivory/60">
          Showing <span className="text-gold font-bold">{bookings.length}</span> of <span className="text-gold font-bold">{pagination.total}</span> bookings
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-[#240006]/90 border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory">
            <thead>
              <tr className="border-b border-gold/20 bg-[#1A0004] text-gold font-cinzel uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Devotee Name & Phone</th>
                <th className="py-3 px-4">Gotram / Nakshatram</th>
                <th className="py-3 px-4">Seva Offering</th>
                <th className="py-3 px-4">Programme Date</th>
                <th className="py-3 px-4">Devotee Participation</th>
                <th className="py-3 px-4">Dakshina</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gold/5 transition-colors">
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
                      <div className="font-medium text-ivory truncate">{b.seva_name}</div>
                      {b.sankalpam_names && (
                        <div className="text-[10px] text-ivory/50 truncate">Sankalpam: {b.sankalpam_names}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-ivory/80">
                      <div>{b.selected_date}</div>
                      <div className="text-[10px] text-gold/70">Day {b.day_number || 1}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        (b.attending_personally === 'yes' || b.attending_personally === 'attending' || b.devotee_participation === 'attending')
                          ? 'bg-[#5A0714] text-[#F2C14E] border border-[#F2C14E]/40'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                      }`}>
                        <span>{(b.attending_personally === 'yes' || b.attending_personally === 'attending' || b.devotee_participation === 'attending') ? '🪔' : '📦'}</span>
                        <span>
                          {(b.attending_personally === 'yes' || b.attending_personally === 'attending' || b.devotee_participation === 'attending')
                            ? 'ATTENDING IN PERSON'
                            : 'NOT ATTENDING IN PERSON'}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      ₹{Number(b.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          b.payment_status === 'SUCCESS'
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                            : 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                        }`}
                      >
                        {b.payment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleAttendanceToggle(b.id, b.attendance)}
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
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBooking(b)}
                          className="h-7 w-7 p-0 text-gold hover:bg-gold/10"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBooking(b.id)}
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-ivory/50 italic">
                    {loading ? 'Loading bookings from database...' : 'No bookings found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => fetchBookings(page, pagination.limit)}
          onItemsPerPageChange={(limit) => fetchBookings(1, limit)}
          className="rounded-t-none border-t border-gold/15"
        />
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-gold">Booking Summary</h3>
                <p className="text-xs font-mono text-ivory/60">{selectedBooking.booking_id}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-ivory">
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Devotee Name:</span>
                <span className="font-semibold text-ivory">{selectedBooking.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Phone:</span>
                <span className="text-ivory">{selectedBooking.phone_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Gotram / Nakshatram:</span>
                <span className="text-gold">{selectedBooking.gotram || '-'} / {selectedBooking.janma_nakshatra || selectedBooking.nakshatra}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Seva Offering:</span>
                <span className="font-semibold text-ivory">{selectedBooking.seva_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Programme Date:</span>
                <span className="text-ivory">{selectedBooking.selected_date} (Day {selectedBooking.day_number})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Dakshina Amount:</span>
                <span className="font-mono font-bold text-gold text-sm">₹{Number(selectedBooking.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Sankalpam Devotees:</span>
                <span className="text-ivory/90 text-right">{selectedBooking.sankalpam_names || selectedBooking.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gold/10">
                <span className="text-ivory/60">Devotee Participation:</span>
                <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded ${
                  (selectedBooking.attending_personally === 'yes' || selectedBooking.attending_personally === 'attending' || selectedBooking.devotee_participation === 'attending')
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                    : 'text-zinc-400 bg-zinc-900 border border-zinc-700'
                }`}>
                  {(selectedBooking.attending_personally === 'yes' || selectedBooking.attending_personally === 'attending' || selectedBooking.devotee_participation === 'attending')
                    ? 'ATTENDING IN PERSON'
                    : 'NOT ATTENDING IN PERSON'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ivory/60">Attendance Status:</span>
                <span className="font-bold text-gold">{selectedBooking.attendance}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button size="sm" variant="outline" onClick={() => setSelectedBooking(null)} className="border-gold/30 text-gold text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Offline Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateBooking} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">Create Offline Seva Registration</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Seva Offering *</label>
                  <select
                    value={newBooking.seva_id}
                    onChange={(e) => setNewBooking({ ...newBooking, seva_id: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                    required
                  >
                    <option value="ati-rudram-donation">Ati Rudram Donation (₹216)</option>
                    <option value="ekadasa-rudra-abhishekam">Ekadasa Rudra Abhishekam (₹5,116)</option>
                    <option value="maha-rudra-japam-and-homam">Maha Rudra Japam & Homam (₹11,116)</option>
                    <option value="rudra-kramarchana">Rudra Kramarchana (₹1,116)</option>
                    <option value="nakshatra-hawan-seva">Nakshatra Hawan Seva (₹216)</option>
                    <option value="sampoorna-nakshatra-shanthi">Sampoorna Nakshatra Shanthi (₹10,116)</option>
                    <option value="sampoorna-visesha-nakshatra-seva">Sampoorna Visesha Nakshatra Seva (₹12,116)</option>
                    <option value="sri-subramanyeswara-swamy-kalyanam">Subramanyeswara Kalyanam (₹5,116)</option>
                    <option value="annadanam-seva">Annadanam Seva (₹5,116)</option>
                  </select>
                </div>

                <div>
                  <label className="text-ivory/70 block mb-1">Programme Date *</label>
                  <input
                    type="date"
                    value={newBooking.selected_date}
                    onChange={(e) => setNewBooking({ ...newBooking, selected_date: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Devotee Full Name *</label>
                  <Input
                    placeholder="Sri K. Venkata..."
                    value={newBooking.full_name}
                    onChange={(e) => setNewBooking({ ...newBooking, full_name: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Contact Phone *</label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={newBooking.phone_number}
                    onChange={(e) => setNewBooking({ ...newBooking, phone_number: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Gotram</label>
                  <Input
                    placeholder="e.g. Kasyapa"
                    value={newBooking.gotram}
                    onChange={(e) => setNewBooking({ ...newBooking, gotram: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Janma Nakshatram</label>
                  <Input
                    placeholder="e.g. Rohini"
                    value={newBooking.janma_nakshatra}
                    onChange={(e) => setNewBooking({ ...newBooking, janma_nakshatra: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Devotee Participation *</label>
                  <select
                    value={newBooking.attending_personally}
                    onChange={(e) => setNewBooking({ ...newBooking, attending_personally: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="yes">ATTENDING IN PERSON</option>
                    <option value="no">NOT ATTENDING IN PERSON</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Sankalpam Family Names</label>
                  <Input
                    placeholder="Names for priest sankalpam chanting"
                    value={newBooking.sankalpam_names}
                    onChange={(e) => setNewBooking({ ...newBooking, sankalpam_names: e.target.value })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {actionLoading ? 'Creating...' : 'Confirm & Save Booking'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
