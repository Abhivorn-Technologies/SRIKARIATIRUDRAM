'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Coins, Download, Search, FileText, CheckCircle2, RefreshCw, PlusCircle, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    donor_name: '',
    phone: '',
    email: '',
    pan: '',
    amount: 10016,
    purpose: 'General Mahayagnam Dravya Fund',
    payment_mode: 'UPI',
    is_80g_eligible: true,
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/donations');
      const json = await res.json();
      if (json.success) {
        setDonations(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch donation records');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddOpen(false);
        setFormData({
          donor_name: '',
          phone: '',
          email: '',
          pan: '',
          amount: 10016,
          purpose: 'General Mahayagnam Dravya Fund',
          payment_mode: 'UPI',
          is_80g_eligible: true,
        });
        fetchDonations();
      } else {
        alert(json.error || 'Failed to record donation');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation record?')) return;
    try {
      const res = await fetch(`/api/admin/donations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchDonations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredDonations = donations.filter((d) =>
    (d.donor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.receipt_number || d.donation_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.purpose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.pan || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage) || 1;
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRaised = donations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  const avgContribution = donations.length > 0 ? Math.round(totalRaised / donations.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Donations & 80G Tax Exemption Desk
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Database-driven trust donations, corporate contributions, PAN card records, and 80G tax certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDonations}
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
            Record New Donation
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">Total Donations Corpus</span>
          <h3 className="text-2xl font-bold font-cinzel text-ivory mt-1">₹{totalRaised.toLocaleString('en-IN')}</h3>
        </Card>
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">80G Receipts Issued</span>
          <h3 className="text-2xl font-bold font-cinzel text-gold mt-1">{donations.length} Donors</h3>
        </Card>
        <Card className="p-5 bg-[#240006]/90 border-gold/20">
          <span className="text-xs text-gold/70 font-cinzel uppercase">Average Contribution</span>
          <h3 className="text-2xl font-bold font-cinzel text-emerald-400 mt-1">₹{avgContribution.toLocaleString('en-IN')}</h3>
        </Card>
      </div>

      {/* Search */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Donor name, 80G receipt number, PAN, or purpose..."
            className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
          />
          <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </Card>

      {/* Table */}
      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Donor Name & PAN</th>
                <th className="p-3.5">Purpose / Seva Fund</th>
                <th className="p-3.5">Date & Mode</th>
                <th className="p-3.5 text-right">Donation Amount</th>
                <th className="p-3.5 text-center">80G Tax Receipt</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {paginatedDonations.length > 0 ? (
                paginatedDonations.map((d) => (
                  <tr key={d.donation_id || d.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-ivory">{d.donor_name}</div>
                      <div className="text-[10px] text-gold/70">PAN: {d.pan || 'N/A'} • {d.phone || d.mobile || 'N/A'}</div>
                    </td>
                    <td className="p-3.5 text-ivory/80 font-medium">{d.purpose || 'General Fund'}</td>
                    <td className="p-3.5">
                      <span className="text-ivory/80 block">{d.date ? String(d.date).slice(0, 10) : '2026-11-25'}</span>
                      <span className="text-[10px] text-ivory/50">{d.payment_mode || 'UPI'}</span>
                    </td>
                    <td className="p-3.5 text-right font-black text-gold-light text-sm font-mono">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <FileText className="w-3 h-3" /> {d.receipt_number || d.receiptNo || '80G-SRK-' + String(d.donation_id || d.id).slice(-4)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(d.donation_id || d.id)}
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ivory/50 italic">
                    {loading ? 'Loading donation records from database...' : 'No donation records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDonations.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          className="rounded-t-none border-t border-gold/15"
        />
      </Card>

      {/* Add New Donation Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">Record New Trust Donation</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Donor Full Name *</label>
                  <Input
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    placeholder="e.g. Smt. Anasuya Devi"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Contact Mobile</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9848055667"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">PAN Card No. (For 80G)</label>
                  <Input
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Donation Amount (₹) *</label>
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
                <label className="text-ivory/70 block mb-1">Purpose / Cause Fund</label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Ghee & Dravya Samagri for 11 Kundas"
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Payment Mode</label>
                  <select
                    value={formData.payment_mode}
                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Online NetBanking">Online NetBanking</option>
                    <option value="NEFT / Bank Transfer">NEFT / RTGS</option>
                    <option value="Cheque Deposit">Cheque Deposit</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Email (Optional)</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="donor@example.com"
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {saving ? 'Recording...' : 'Record & Issue 80G Receipt'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
