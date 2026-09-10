'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { RefreshCcw, Search, CheckCircle2, AlertCircle, IndianRupee } from 'lucide-react';

export default function AdminRefundsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const refunds = [
    {
      refundId: 'RFD_2026_012',
      originalTxn: 'TXN_2026_8812',
      bookingId: 'SRK-2026-0941',
      devotee: 'N. Raghava Reddy',
      amount: 5116,
      reason: 'Duplicate payment via UPI app glitch',
      initiatedDate: '09 Sep 2026',
      status: 'PROCESSED',
      refundRef: 'rfd_Q192837465',
    },
    {
      refundId: 'RFD_2026_011',
      originalTxn: 'TXN_2026_8750',
      bookingId: 'SRK-2026-0890',
      devotee: 'Smt. Kalyani Devi',
      amount: 1116,
      reason: 'Devotee requested slot date transfer adjustment',
      initiatedDate: '07 Sep 2026',
      status: 'PROCESSED',
      refundRef: 'rfd_Q183746519',
    },
  ];

  const filteredRefunds = refunds.filter((r) =>
    r.refundId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.devotee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              PAYMENT REVERSALS & CANCELLATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <RefreshCcw className="w-6 h-6 text-gold" />
            Refunds & Dispute Management
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage duplicate transaction reversals, devotee cancellation requests, and audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Refunds Processed</span>
          <h3 className="text-xl font-black text-ivory mt-1">₹6,232</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Refund Requests</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">2 Total</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Pending Disputes</span>
          <h3 className="text-xl font-black text-gold mt-1">0 Open</h3>
        </Card>
      </div>

      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Refund ID, Original Txn, Devotee name, or Booking..."
            className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
          />
          <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </Card>

      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Refund ID & Ref</th>
                <th className="p-3.5">Devotee & Booking</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredRefunds.map((r) => (
                <tr key={r.refundId} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-gold-light">{r.refundId}</span>
                    <span className="text-[10px] text-ivory/50 block font-mono">{r.refundRef}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-ivory">{r.devotee}</div>
                    <span className="text-[10px] text-gold/70">{r.bookingId}</span>
                  </td>
                  <td className="p-3.5 text-ivory/80">{r.reason}</td>
                  <td className="p-3.5 text-ivory/70">{r.initiatedDate}</td>
                  <td className="p-3.5 text-right font-black text-gold-light text-sm">
                    ₹{r.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Processed to Source
                    </span>
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
