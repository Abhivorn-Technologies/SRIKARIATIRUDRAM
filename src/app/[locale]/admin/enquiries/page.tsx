'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, Clock, Search, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const enquiries = [
    {
      id: 'ENQ-104',
      name: 'V. Sreedhar & Family',
      phone: '+91 94401 55667',
      email: 'vsreedhar@gmail.com',
      date: '10 Sep 2026, 15:30',
      subject: 'Bulk Seva booking for 20 family members from USA',
      message: 'Namaskaram, we would like to book a complete day Sankalpam pass on Day 14 (Uttara Phalguni). Please guide on foreign remittance procedure.',
      status: 'NEW',
    },
    {
      id: 'ENQ-103',
      name: 'Smt. Saraswathi Sharma',
      phone: '+91 98850 11223',
      email: 'saraswathi.sharma@yahoo.com',
      date: '09 Sep 2026, 11:20',
      subject: 'Accommodation & senior citizen wheelchair assistance',
      message: 'Kindly let us know if wheelchair access is provided at Gate 2 for elderly parents participating in Ekadasa Rudra Abhishekam.',
      status: 'RESPONDED',
    },
    {
      id: 'ENQ-102',
      name: 'Sri Sai Youth Association',
      phone: '+91 97000 44556',
      email: 'youth.dilsukhnagar@gmail.com',
      date: '08 Sep 2026, 17:45',
      subject: 'Volunteer registration for Maha Annadanam service',
      message: 'A group of 15 volunteers from our local mandali wish to serve in the prasadam distribution lines on all Sundays.',
      status: 'RESOLVED',
    },
  ];

  const filteredEnquiries = enquiries.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              DEVOTEE INBOX & HELPDESK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-gold" />
            Devotee Enquiries & Contact Messages
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            View and respond to inquiries sent through the public contact form, seva clarifications, and volunteer requests.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries by name, phone, or subject..."
            className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
          />
          <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredEnquiries.map((enq) => (
          <Card key={enq.id} variant="gold-border" className="p-5 bg-burgundy-deep/90 border-gold/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-2.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-gold">{enq.id}</span>
                <span className="font-bold text-ivory text-sm">{enq.name}</span>
                <span className="text-xs text-ivory/60 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gold/60" /> {enq.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ivory/50">{enq.date}</span>
                {enq.status === 'NEW' && (
                  <Badge variant="warning" size="sm" className="text-[10px]">New</Badge>
                )}
                {enq.status === 'RESPONDED' && (
                  <Badge variant="gold" size="sm" className="text-[10px]">Responded</Badge>
                )}
                {enq.status === 'RESOLVED' && (
                  <Badge variant="success" size="sm" className="text-[10px]">Resolved</Badge>
                )}
              </div>
            </div>

            <h4 className="text-xs font-bold text-gold-light">{enq.subject}</h4>
            <p className="text-xs text-ivory/80 font-sans leading-relaxed bg-burgundy/50 p-3 rounded-lg border border-gold/10">
              {enq.message}
            </p>

            <div className="flex justify-end pt-1">
              <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
                <MessageSquare className="w-3.5 h-3.5 mr-1 text-gold" /> Reply to Devotee
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
