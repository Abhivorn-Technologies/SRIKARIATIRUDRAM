'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Download, Search, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    grossCollections: 0,
    successfulTxnsCount: 0,
    pendingTxnsCount: 0,
    totalTxnsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/payments', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data || []);
        if (json.stats) setStats(json.stats);
      } else {
        setError(json.error || 'Failed to load payment transactions');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredTxns = transactions.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (t.reference_id || '').toLowerCase().includes(query) ||
      (t.transaction_id || '').toLowerCase().includes(query) ||
      (t.devotee || '').toLowerCase().includes(query) ||
      (t.mobile || '').toLowerCase().includes(query) ||
      (t.purpose || '').toLowerCase().includes(query);

    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && t.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              FINANCIAL LEDGER & RECONCILIATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-gold" />
            Payment Transactions & Settlement
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Monitor real-time Razorpay UPI collections, bank settlements, gateway reference IDs across Sevas, Annadanam & Donations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayments}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="text-xs border-gold/40 hover:border-gold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
            Export Settlement PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Gross Collections</span>
          <h3 className="text-xl font-black text-ivory mt-1">₹{stats.grossCollections.toLocaleString('en-IN')}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Successful Txns</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{stats.successfulTxnsCount}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Pending Verifications</span>
          <h3 className="text-xl font-black text-amber-400 mt-1">{stats.pendingTxnsCount}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Ledger Records</span>
          <h3 className="text-xl font-black text-gold mt-1">{stats.totalTxnsCount}</h3>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID, Ref ID, Devotee name, Mobile or Purpose..."
              className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
            />
            <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
          >
            <option value="all">All Modules</option>
            <option value="BOOKING">Seva Bookings</option>
            <option value="ANNADANAM">Annadanam</option>
            <option value="DONATION">General Donations</option>
          </select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Category & Ref ID</th>
                <th className="p-3.5">Devotee & Contact</th>
                <th className="p-3.5">Purpose / Offering</th>
                <th className="p-3.5">Gateway / Channel</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredTxns.length > 0 ? (
                filteredTxns.map((t, idx) => (
                  <tr key={t.reference_id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-gold/20 text-gold-light border border-gold/30 uppercase font-cinzel mb-1">
                        {t.category}
                      </span>
                      <div className="font-mono font-bold text-ivory">{t.reference_id}</div>
                      {t.transaction_id && (
                        <div className="text-[10px] text-ivory/50 font-mono">Txn: {t.transaction_id}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-ivory">{t.devotee || 'Anonymous Devotee'}</div>
                      <span className="text-[10px] text-gold/70">{t.mobile || '-'}</span>
                    </td>
                    <td className="p-3.5 text-ivory/90 font-medium max-w-[200px] truncate">
                      {t.purpose}
                    </td>
                    <td className="p-3.5 text-ivory/80">{t.gateway || 'Razorpay Gateway'}</td>
                    <td className="p-3.5 text-ivory/70 whitespace-nowrap">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="p-3.5 text-right font-black text-gold-light text-sm font-mono">
                      ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          t.payment_status === 'SUCCESS' || t.payment_status === 'CONFIRMED'
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                            : 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                        }`}
                      >
                        {t.payment_status || 'SUCCESS'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ivory/50 italic">
                    {loading ? 'Loading payment transactions from database...' : 'No payment transactions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
