'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Download, Search, CheckCircle2, Clock, AlertCircle, ArrowDownRight, IndianRupee } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const transactions = [
    {
      txnId: 'TXN_2026_9941',
      bookingId: 'SRK-2026-1082',
      devotee: 'K. Venkata Raman',
      gateway: 'Razorpay UPI',
      gatewayRef: 'pay_P19xKwQ91823',
      amount: 5116,
      date: '10 Sep 2026, 14:22',
      status: 'SUCCESS',
    },
    {
      txnId: 'TXN_2026_9940',
      bookingId: 'SRK-2026-1081',
      devotee: 'Smt. Lakshmi Murthy',
      gateway: 'Direct ICICI NetBanking',
      gatewayRef: 'NET_9921827361',
      amount: 12116,
      date: '10 Sep 2026, 13:45',
      status: 'SUCCESS',
    },
    {
      txnId: 'TXN_2026_9939',
      bookingId: 'SRK-2026-1080',
      devotee: 'R. Anjaneyulu',
      gateway: 'Temple Cash Counter',
      gatewayRef: 'CTR_REC_401',
      amount: 12116,
      date: '10 Sep 2026, 12:10',
      status: 'SETTLED',
    },
    {
      txnId: 'TXN_2026_9938',
      bookingId: 'SRK-2026-1079',
      devotee: 'G. Viswanatha Sharma',
      gateway: 'Razorpay QR',
      gatewayRef: 'pay_P18vJkO81720',
      amount: 10116,
      date: '10 Sep 2026, 11:30',
      status: 'PENDING_VERIFICATION',
    },
    {
      txnId: 'TXN_2026_9937',
      bookingId: 'SRK-2026-1078',
      devotee: 'Dr. Srinivas',
      gateway: 'UPI Autopay',
      gatewayRef: 'upi_0029381726',
      amount: 25000,
      date: '09 Sep 2026, 19:15',
      status: 'SUCCESS',
    },
  ];

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.devotee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && t.status === statusFilter;
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
            Monitor real-time UPI collections, bank settlements, gateway reference IDs, and transaction reconciliations.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs border-gold/40 hover:border-gold">
          <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
          Export Settlement CSV
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Gross Collections</span>
          <h3 className="text-xl font-black text-ivory mt-1">₹18,45,600</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Successful Txns</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">1,412</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Pending Verifications</span>
          <h3 className="text-xl font-black text-amber-400 mt-1">8</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Settlement Ratio</span>
          <h3 className="text-xl font-black text-gold mt-1">99.4%</h3>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID, Booking Ref, Devotee name, or Gateway Ref..."
              className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
            />
            <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
          >
            <option value="all">All Payment Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="SETTLED">Settled Cash / Counter</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
          </select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Transaction ID & Ref</th>
                <th className="p-3.5">Booking & Devotee</th>
                <th className="p-3.5">Gateway / Channel</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredTxns.map((t) => (
                <tr key={t.txnId} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-gold-light">{t.txnId}</span>
                    <span className="text-[10px] text-ivory/50 block font-mono">{t.gatewayRef}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-ivory">{t.devotee}</div>
                    <span className="text-[10px] text-gold/70">{t.bookingId}</span>
                  </td>
                  <td className="p-3.5 text-ivory/80">{t.gateway}</td>
                  <td className="p-3.5 text-ivory/70">{t.date}</td>
                  <td className="p-3.5 text-right font-black text-gold-light text-sm">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    {t.status === 'SUCCESS' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Captured
                      </span>
                    )}
                    {t.status === 'SETTLED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                        <CheckCircle2 className="w-3 h-3" /> Counter Settled
                      </span>
                    )}
                    {t.status === 'PENDING_VERIFICATION' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Clock className="w-3 h-3" /> Verifying
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
