'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, Search, MessageSquare, Trash2, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

interface Enquiry {
  id: string;
  enquiry_id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'RESPONDED' | 'RESOLVED';
  date?: string;
  created_at?: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/enquiries', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch enquiries');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'NEW' | 'RESPONDED' | 'RESOLVED') => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id || e.enquiry_id === id ? { ...e, status: newStatus } : e))
        );
      } else {
        alert(json.error || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating enquiry');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id && e.enquiry_id !== id));
      } else {
        alert(json.error || 'Failed to delete enquiry');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting enquiry');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.phone || '').includes(searchQuery) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.enquiry_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

        <Button
          variant="outline"
          size="sm"
          onClick={fetchEnquiries}
          disabled={loading}
          className="border-gold/30 hover:border-gold text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-gold ${loading ? 'animate-spin' : ''}`} />
          Refresh Inbox
        </Button>
      </div>

      {/* Filters & Search */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enquiries by name, phone, email, subject, ID..."
              className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
            />
            <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'NEW', 'RESPONDED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-gold text-burgundy-dark border-gold font-bold shadow-sm'
                    : 'bg-burgundy/60 text-ivory/70 border-gold/20 hover:border-gold/40'
                }`}
              >
                {st === 'ALL' ? 'All Messages' : st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content state handling */}
      {loading && enquiries.length === 0 ? (
        <div className="text-center py-12 bg-burgundy-deep/40 rounded-xl border border-gold/10">
          <RefreshCw className="w-8 h-8 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-ivory/70">Loading enquiries from database...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/30 border border-red-500/40 rounded-xl text-red-200 text-xs text-center">
          {error}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-12 bg-burgundy-deep/40 rounded-xl border border-gold/10">
          <Mail className="w-10 h-10 text-gold/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-ivory">No enquiries found</p>
          <p className="text-xs text-ivory/60 mt-1">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try clearing your search filters.'
              : 'Messages submitted via the public contact form will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <Card key={enq.id} variant="gold-border" className="p-5 bg-burgundy-deep/90 border-gold/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-2.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-gold">{enq.enquiry_id || enq.id}</span>
                  <span className="font-bold text-ivory text-sm">{enq.name}</span>
                  <a
                    href={`tel:${enq.phone}`}
                    className="text-xs text-ivory/70 hover:text-gold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-gold/60" /> {enq.phone}
                  </a>
                  {enq.email && (
                    <a
                      href={`mailto:${enq.email}`}
                      className="text-xs text-ivory/60 hover:text-gold flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-gold/60" /> {enq.email}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ivory/50 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold/50" />
                    {enq.date || (enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-GB') : '')}
                  </span>

                  {enq.status === 'NEW' && (
                    <Badge variant="warning" size="sm" className="text-[10px]">
                      New
                    </Badge>
                  )}
                  {enq.status === 'RESPONDED' && (
                    <Badge variant="gold" size="sm" className="text-[10px]">
                      Responded
                    </Badge>
                  )}
                  {enq.status === 'RESOLVED' && (
                    <Badge variant="success" size="sm" className="text-[10px]">
                      Resolved
                    </Badge>
                  )}
                </div>
              </div>

              {enq.subject && <h4 className="text-xs font-bold text-gold-light">{enq.subject}</h4>}
              <p className="text-xs text-ivory/80 font-sans leading-relaxed bg-burgundy/50 p-3 rounded-lg border border-gold/10 whitespace-pre-wrap">
                {enq.message}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-[11px] text-ivory/60 mr-1">Mark status:</span>
                  <button
                    disabled={updatingId === enq.id}
                    onClick={() => handleUpdateStatus(enq.id, 'NEW')}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      enq.status === 'NEW'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-burgundy-dark/50 text-ivory/50 border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    New
                  </button>
                  <button
                    disabled={updatingId === enq.id}
                    onClick={() => handleUpdateStatus(enq.id, 'RESPONDED')}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      enq.status === 'RESPONDED'
                        ? 'bg-gold/20 text-gold-lighter border-gold/40 font-bold'
                        : 'bg-burgundy-dark/50 text-ivory/50 border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    Responded
                  </button>
                  <button
                    disabled={updatingId === enq.id}
                    onClick={() => handleUpdateStatus(enq.id, 'RESOLVED')}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-burgundy-dark/50 text-ivory/50 border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    Resolved
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {enq.email && (
                    <a
                      href={`mailto:${enq.email}?subject=RE: ${encodeURIComponent(
                        enq.subject || 'Sri Kari Ati Rudram Enquiry'
                      )}`}
                    >
                      <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
                        <MessageSquare className="w-3.5 h-3.5 mr-1 text-gold" /> Reply Email
                      </Button>
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={updatingId === enq.id}
                    onClick={() => handleDelete(enq.id)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

