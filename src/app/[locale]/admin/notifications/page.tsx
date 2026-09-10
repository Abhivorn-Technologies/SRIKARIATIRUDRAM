'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Bell, Send, CheckCircle2, MessageCircle, Mail, AlertTriangle } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'all'>('all');
  const [sent, setSent] = useState(false);

  const notificationsLog = [
    {
      id: 1,
      type: 'Booking Confirmation',
      channel: 'WhatsApp & Email',
      recipient: 'K. Venkata Raman (SRK-2026-1082)',
      time: '10 Sep 2026, 14:23',
      status: 'DELIVERED',
      details: 'E-Ticket & QR pass sent with morning arrival instructions.',
    },
    {
      id: 2,
      type: 'Yagnam Reminder',
      channel: 'WhatsApp Broadcast',
      recipient: 'All Day 01 Seva Devotees (480 devotees)',
      time: '09 Sep 2026, 18:00',
      status: 'DELIVERED',
      details: 'Gentle reminder to arrive at Dilsukhnagar Yagashala by 6:30 AM.',
    },
    {
      id: 3,
      type: '80G Tax Receipt',
      channel: 'Email PDF',
      recipient: 'Sri Sai Ram Infra Ltd',
      time: '08 Sep 2026, 15:10',
      status: 'DELIVERED',
      details: 'Digitally signed 80G certificate for ₹2,50,000 donation.',
    },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setBroadcastMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              DISPATCH & ALERTS LOG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-gold" />
            Devotee Notifications & Broadcasts
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Send bulk announcements via WhatsApp/Email and monitor delivery logs for booking passes and 80G receipts.
          </p>
        </div>
      </div>

      {sent && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Broadcast dispatched successfully to registered devotees!</span>
        </div>
      )}

      {/* Broadcast Message Form */}
      <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2 border-b border-gold/20 pb-3">
          <Send className="w-4 h-4 text-gold" />
          Send Immediate Broadcast to Devotees
        </h3>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Broadcast Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter alert message to send to devotees..."
                rows={3}
                required
                className="w-full p-3 rounded-lg bg-burgundy-dark/90 border border-gold/30 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-light">Target Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
                >
                  <option value="all">WhatsApp & Email (Both)</option>
                  <option value="whatsapp">WhatsApp Only</option>
                  <option value="email">Email Only</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="sm"
                className="w-full font-bold uppercase tracking-wider text-xs py-2.5 shadow-gold-sm"
              >
                <Send className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
                Dispatch Broadcast
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Notifications Log */}
      <div className="space-y-3">
        <h3 className="font-cinzel text-sm font-bold text-gold-lighter uppercase tracking-wider">
          Recent Outgoing Notification Dispatches
        </h3>

        {notificationsLog.map((log) => (
          <Card key={log.id} className="p-4 bg-burgundy/70 border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm" className="text-[10px]">
                  {log.type}
                </Badge>
                <span className="text-[10px] text-ivory/60 font-mono">{log.channel}</span>
                <span className="text-[10px] text-ivory/40">• {log.time}</span>
              </div>
              <h4 className="text-xs font-bold text-ivory">{log.recipient}</h4>
              <p className="text-[11px] text-ivory/70">{log.details}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> {log.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
