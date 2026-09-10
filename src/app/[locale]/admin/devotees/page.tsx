'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Users, Search, Download, UserCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminDevoteesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleDevotees = [
    {
      id: 'DEV-001',
      name: 'K. Venkata Raman',
      familyMembers: 4,
      phone: '+91 98490 12345',
      email: 'raman.kv@gmail.com',
      gotram: 'Kashyapa',
      nakshatra: 'Rohini',
      city: 'Hyderabad',
      totalBookings: 3,
      totalContributed: 42348,
    },
    {
      id: 'DEV-002',
      name: 'Smt. Lakshmi & S. Murthy',
      familyMembers: 3,
      phone: '+91 94401 67890',
      email: 'smurthy.lakshmi@yahoo.com',
      gotram: 'Bharadwaja',
      nakshatra: 'Mrigasira',
      city: 'Vijayawada',
      totalBookings: 2,
      totalContributed: 24232,
    },
    {
      id: 'DEV-003',
      name: 'R. Anjaneyulu',
      familyMembers: 5,
      phone: '+91 98850 44321',
      email: 'anjaneyulu.r@outlook.com',
      gotram: 'Gouthama',
      nakshatra: 'Ardra',
      city: 'Warangal',
      totalBookings: 1,
      totalContributed: 12116,
    },
    {
      id: 'DEV-004',
      name: 'G. Viswanatha Sharma',
      familyMembers: 2,
      phone: '+91 99480 88765',
      email: 'vsharma.purohit@gmail.com',
      gotram: 'Vasishta',
      nakshatra: 'Pushya',
      city: 'Bengaluru',
      totalBookings: 2,
      totalContributed: 20232,
    },
    {
      id: 'DEV-005',
      name: 'Dr. Srinivas & Geetha',
      familyMembers: 4,
      phone: '+91 97000 11223',
      email: 'srinivas.dr@apollo.org',
      gotram: 'Harithasa',
      nakshatra: 'Rohini',
      city: 'Secunderabad',
      totalBookings: 4,
      totalContributed: 65116,
    },
  ];

  const filteredDevotees = sampleDevotees.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.gotram.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone.includes(searchQuery) ||
    d.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              DEVOTEE DIRECTORY & GOTRAM DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-gold" />
            Devotee Profiles & Registry
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Complete database of participating devotees, registered Gotrams, family trees, and lifetime contributions.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs border-gold/40 hover:border-gold">
          <Download className="w-3.5 h-3.5 mr-1.5 text-gold" />
          Export Devotee Master (CSV)
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Registered Devotees</span>
          <h3 className="text-xl font-black text-ivory mt-1">1,420</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Unique Gotrams</span>
          <h3 className="text-xl font-black text-gold mt-1">48</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Family Members</span>
          <h3 className="text-xl font-black text-ivory mt-1">4,860</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Cities Represented</span>
          <h3 className="text-xl font-black text-gold mt-1">32</h3>
        </Card>
      </div>

      {/* Search Bar */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Devotee name, Gotram, phone number, or city..."
            className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
          />
          <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </Card>

      {/* Devotee Table */}
      <Card variant="gold-border" className="p-0 bg-burgundy-deep/90 border-gold/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-burgundy/80 text-gold-light uppercase text-[10px] font-cinzel tracking-wider border-b border-gold/20">
              <tr>
                <th className="p-3.5">Devotee & ID</th>
                <th className="p-3.5">Gotram / Nakshatra</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Sevas Booked</th>
                <th className="p-3.5 text-right">Total Offerings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredDevotees.map((devotee) => (
                <tr key={devotee.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-ivory">{devotee.name}</div>
                    <div className="text-[10px] text-gold/70">{devotee.id} • {devotee.familyMembers} Family Members</div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-gold-light">{devotee.gotram}</span>
                    <span className="text-ivory/60 text-[11px] block">{devotee.nakshatra}</span>
                  </td>
                  <td className="p-3.5 text-ivory/80 space-y-0.5">
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gold/60" /> {devotee.phone}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-ivory/60"><Mail className="w-3 h-3 text-gold/60" /> {devotee.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 text-ivory/80">
                      <MapPin className="w-3 h-3 text-gold/60" /> {devotee.city}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-ivory">{devotee.totalBookings} Sevas</td>
                  <td className="p-3.5 text-right font-black text-gold-light">
                    ₹{devotee.totalContributed.toLocaleString('en-IN')}
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
