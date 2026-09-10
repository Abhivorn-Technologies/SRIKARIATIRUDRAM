'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Megaphone, Plus, Trash2, Edit3, CheckCircle2, Pin } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Devotee Prasadam Distribution Timing Change',
      category: 'General',
      date: '25 Nov 2026',
      pinned: true,
      active: true,
      text: 'Maha Prasadam will be served continuously from 11:30 AM to 3:30 PM at the Annadanam hall.',
    },
    {
      id: 2,
      title: 'Special Live Telecast of Chandi Homam on Day 03',
      category: 'Live Broadcast',
      date: '27 Nov 2026',
      pinned: false,
      active: true,
      text: 'Day 3 Chandi Parayanam & Purnahuti will be broadcasted live in 4K resolution on YouTube.',
    },
    {
      id: 3,
      title: 'Parking Instructions for Dilsukhnagar Yagnashala Ground',
      category: 'Logistics',
      date: '25 Nov 2026',
      pinned: false,
      active: true,
      text: 'Designated 4-wheeler parking is available near Gate 3 with continuous shuttle service.',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      date: 'Today',
      pinned: false,
      active: true,
      text: newText,
    };
    setAnnouncements([newItem, ...announcements]);
    setNewTitle('');
    setNewText('');
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              COMMUNICATION BROADCASTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-gold" />
            Yagnam Announcements & Notices
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Post real-time flash news, prasadam distribution timings, and devotee advisories across the website.
          </p>
        </div>
      </div>

      {/* Add New Announcement Card */}
      <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-4">
        <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2 border-b border-gold/20 pb-3">
          <Plus className="w-4 h-4 text-gold" />
          Publish New Announcement
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Announcement Headline</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Special Deeparadhana ceremony at 6:30 PM this evening"
                required
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-burgundy-dark/90 border border-gold/30 text-ivory outline-none h-9"
              >
                <option>General</option>
                <option>Live Broadcast</option>
                <option>Logistics & Parking</option>
                <option>Prasadam / Annadanam</option>
                <option>Ritual Advisory</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gold-light">Announcement Details / Message</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Provide complete details for devotees..."
              rows={2}
              className="w-full p-3 rounded-lg bg-burgundy-dark/90 border border-gold/30 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold outline-none"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
              Publish Announcement
            </Button>
          </div>
        </form>
      </Card>

      {/* Announcements List */}
      <div className="space-y-3">
        <h3 className="font-cinzel text-sm font-bold text-gold-lighter uppercase tracking-wider">
          Active Announcements ({announcements.length})
        </h3>

        {announcements.map((item) => (
          <Card key={item.id} className="p-4 bg-burgundy/70 border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {item.pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <Badge variant="outline" size="sm" className="text-[10px] border-gold/30 text-gold-light">
                  {item.category}
                </Badge>
                <span className="text-[10px] text-ivory/50">{item.date}</span>
              </div>
              <h4 className="text-sm font-bold text-ivory">{item.title}</h4>
              <p className="text-xs text-ivory/70">{item.text}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-500/30 transition-colors"
                title="Delete Announcement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
