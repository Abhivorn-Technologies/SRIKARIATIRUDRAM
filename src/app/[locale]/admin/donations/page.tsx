'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Coins, Download, Search, FileText, CheckCircle2, IndianRupee } from 'lucide-react';

export default function AdminDonationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const donations = [
    {
      id: 'DON-2026-081',
      donorName: 'Smt. Anasuya Devi & K. Rao',
      phone: '+91 98480 55667',
      pan: 'ABCDE1234F',
      amount: 50000,
      purpose: 'Ghee & Dravya Samagri for 11 Kundas',
      date: '10 Sep 2026',
      receiptNo: '80G-SRK-081',
      paymentMode: 'NEFT / Bank Transfer',
      status: '80G Issued',
    },
    {
      id: 'DON-2026-080',
      donorName: 'B. Raghunath & Brothers',
      phone: '+91 94411 22334',
      pan: 'BCDEF2345G',
      amount: 100000,
      purpose: 'Maha Annadanam Full Day Corpus',
      date: '09 Sep 2026',
      receiptNo: '80G-SRK-080',
      paymentMode: 'Online NetBanking',
      status: '80G Issued',
    },
    {
      id: 'DON-2026-079',
      donorName: 'Sri Sai Ram Infra Ltd',
      phone: '+91 98855 66778',
      pan: 'CDEFG3456H',
      amount: 250000,
      purpose: 'Yagnashala Stage & Pandal Sponsorship',
      date: '08 Sep 2026',
      receiptNo: '80G-SRK-079',
      paymentMode: 'Cheque Deposit',
      status: '80G Issued',
    },
    {
      id: 'DON-2026-078',
      donorName: 'Dr. M. Srinivasa Rao',
      phone: '+91 97011 88990',
      pan: 'DEFGH4567J',
      amount: 25000,
      purpose: 'General Mahayagnam Fund',
      date: '08 Sep 2026',
      receiptNo: '80G-SRK-078',
      paymentMode: 'UPI',
      status: '80G Issued',
    },
  ];

  const filteredDonations = donations.filter((d) =>
    d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              GENERAL CONTRIBUTIONS & 80G
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-gold" />
            Donations & 80G Tax Exemption Desk
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Track all direct trust donations, corporate contributions, PAN card records, and generate 80G certificates.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs border-gold/40 hover:border-gold">
          <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
          Export 80G Donor Report
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-burgundy/70 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel">Total Donations Corpus</span>
          <h3 className="text-2xl font-black text-ivory mt-1">₹4,25,000</h3>
        </Card>
        <Card className="p-5 bg-burgundy/70 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel">80G Receipts Generated</span>
          <h3 className="text-2xl font-black text-gold mt-1">38 Donors</h3>
        </Card>
        <Card className="p-5 bg-burgundy/70 border-gold/20">
          <span className="text-xs text-gold-light font-cinzel">Average Contribution</span>
          <h3 className="text-2xl font-black text-ivory mt-1">₹28,500</h3>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-ivory">{d.donorName}</div>
                    <div className="text-[10px] text-gold/70">PAN: {d.pan} • {d.phone}</div>
                  </td>
                  <td className="p-3.5 text-ivory/80 font-medium">{d.purpose}</td>
                  <td className="p-3.5">
                    <span className="text-ivory/80 block">{d.date}</span>
                    <span className="text-[10px] text-ivory/50">{d.paymentMode}</span>
                  </td>
                  <td className="p-3.5 text-right font-black text-gold-light text-sm">
                    ₹{d.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <FileText className="w-3 h-3" /> {d.receiptNo}
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
