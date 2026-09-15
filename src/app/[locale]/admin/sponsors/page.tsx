'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { Trophy, Plus, Search, Edit2, Trash2, RefreshCw, X, Check, Phone, User, DollarSign } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  title?: string;
  category: 'MAHAYAJNA' | 'ANNADANA' | 'VEDA_SEVA' | 'DAILY_SEVA';
  amount?: number;
  contact_person?: string;
  phone?: string;
  image_url?: string;
  display_consent: boolean;
  active: boolean;
  created_at?: string;
}

export default function AdminSponsorsPage() {
  const { showToast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | null>(null);
  const [deletingLoading, setDeletingLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    title: 'Maha Poshaka (Grand Sponsor)',
    category: 'MAHAYAJNA' as 'MAHAYAJNA' | 'ANNADANA' | 'VEDA_SEVA' | 'DAILY_SEVA',
    amount: '',
    contact_person: '',
    phone: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sponsors', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        let list: Sponsor[] = json.data || [];
        setSponsors(list);
      } else {
        setError(json.error || 'Failed to fetch sponsors');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenAdd = () => {
    setEditingSponsor(null);
    setFormData({
      name: '',
      title: 'Maha Poshaka (Grand Sponsor)',
      category: 'MAHAYAJNA',
      amount: '',
      contact_person: '',
      phone: '',
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sp: Sponsor) => {
    setEditingSponsor(sp);
    setFormData({
      name: sp.name,
      title: sp.title || 'Maha Poshaka (Grand Sponsor)',
      category: sp.category || 'MAHAYAJNA',
      amount: sp.amount ? String(sp.amount) : '',
      contact_person: sp.contact_person || '',
      phone: sp.phone || '',
      active: sp.active !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Sponsor / Organization name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        category: formData.category,
        amount: formData.amount ? Number(formData.amount) : null,
        contact_person: formData.contact_person.trim() || null,
        phone: formData.phone.trim() || null,
        active: formData.active,
      };

      if (editingSponsor) {
        // Update
        const res = await fetch(`/api/admin/sponsors/${editingSponsor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          showToast('Sponsor record updated successfully!', 'success');
          fetchSponsors();
        } else {
          showToast(json.error || 'Failed to update sponsor', 'error');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/sponsors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          showToast('New sponsor added successfully!', 'success');
          fetchSponsors();
        } else {
          showToast(json.error || 'Failed to add sponsor', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving sponsor record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteSponsor = async () => {
    if (!deletingSponsor) return;
    try {
      setDeletingLoading(true);
      const res = await fetch(`/api/admin/sponsors/${deletingSponsor.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSponsors((prev) => prev.filter((s) => s.id !== deletingSponsor.id));
        showToast('Sponsor record deleted successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to delete sponsor', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting sponsor', 'error');
    } finally {
      setDeletingLoading(false);
      setDeletingSponsor(null);
    }
  };

  const filteredSponsors = sponsors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contact_person || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone || '').includes(searchQuery)
  );

  const totalCorpus = sponsors.reduce((acc, s) => acc + Number(s.amount || 0), 0);
  const activeCount = sponsors.filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              PATRONS & CORPORATE SUPPORTERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-gold" />
            Sponsors & Poshaka Council
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage corporate patrons, Poshaka recognitions, digital banner placements, and Yagnam stage felicitations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSponsors}
            disabled={loading}
            className="border-gold/30 hover:border-gold text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 text-gold ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={handleOpenAdd}
            className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
            Add Sponsor
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Sponsors</span>
          <h3 className="text-xl font-black text-ivory mt-1">{sponsors.length} Patrons</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Total Sponsorship Corpus</span>
          <h3 className="text-xl font-black text-gold mt-1">₹{totalCorpus.toLocaleString('en-IN')}</h3>
        </Card>
        <Card className="p-4 bg-burgundy/70 border-gold/20">
          <span className="text-[10px] uppercase font-cinzel text-gold-light">Active Banners / Displays</span>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{activeCount} Display Active</h3>
        </Card>
      </div>

      {/* Search */}
      <Card variant="gold-border" className="p-4 bg-burgundy-deep/90 border-gold/30">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sponsors by company name, title, contact person, or phone..."
            className="pl-9 text-xs bg-burgundy-dark/90 border-gold/30 text-ivory placeholder:text-ivory/40"
          />
          <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </Card>

      {/* Content */}
      {loading && sponsors.length === 0 ? (
        <div className="text-center py-12 bg-burgundy-deep/40 rounded-xl border border-gold/10">
          <RefreshCw className="w-8 h-8 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-ivory/70">Loading sponsors from database...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/30 border border-red-500/40 rounded-xl text-red-200 text-xs text-center">
          {error}
        </div>
      ) : filteredSponsors.length === 0 ? (
        <div className="text-center py-12 bg-burgundy-deep/40 rounded-xl border border-gold/10">
          <Trophy className="w-10 h-10 text-gold/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-ivory">No sponsors found</p>
          <p className="text-xs text-ivory/60 mt-1">Click &quot;Add Sponsor&quot; to create a new corporate patron record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSponsors.map((sp) => (
            <Card
              key={sp.id}
              className="p-5 bg-burgundy-deep/90 border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="gold" size="sm" className="font-cinzel text-[10px]">
                    {sp.title || sp.category}
                  </Badge>
                  {sp.amount ? (
                    <span className="text-xs font-black text-gold-light">
                      ₹{Number(sp.amount).toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-sm font-bold text-ivory">{sp.name}</h3>
                {(sp.contact_person || sp.phone) && (
                  <p className="text-xs text-ivory/60 flex items-center gap-2">
                    {sp.contact_person && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gold/60" /> {sp.contact_person}
                      </span>
                    )}
                    {sp.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold/60" /> {sp.phone}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    sp.active
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-ivory/40 bg-burgundy/40 border-gold/10'
                  }`}
                >
                  {sp.active ? 'Banner Display Active' : 'Hidden'}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(sp)}
                  className="text-xs border-gold/30 hover:border-gold"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gold" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingSponsor(sp)}
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <Card
            variant="gold-border"
            className="w-full max-w-lg bg-burgundy-deep border-gold p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <h3 className="font-cinzel text-lg font-bold text-gold">
                  {editingSponsor ? 'Edit Sponsor Record' : 'Add New Sponsor Record'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-ivory/60 hover:text-ivory p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-ivory/80 font-medium">Sponsor / Organization Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sri Sai Ram Infra Developers"
                  className="bg-burgundy-dark/90 border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-ivory/80 font-medium">Title / Sponsorship Tier</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Maha Poshaka (Grand Sponsor)"
                    className="bg-burgundy-dark/90 border-gold/30 text-ivory text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ivory/80 font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full h-9 rounded-md bg-burgundy-dark/90 border border-gold/30 text-ivory px-3 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="MAHAYAJNA">Mahayajna Grand Sponsor</option>
                    <option value="ANNADANA">Annadanam Feeding Patron</option>
                    <option value="VEDA_SEVA">Veda Seva Supporter</option>
                    <option value="DAILY_SEVA">Daily Seva Patron</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-ivory/80 font-medium">Contribution Amount (₹)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 1000000"
                    className="bg-burgundy-dark/90 border-gold/30 text-ivory text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ivory/80 font-medium">Contact Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98480 11223"
                    className="bg-burgundy-dark/90 border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-ivory/80 font-medium">Contact Person Name</label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="e.g. Sri M. Raghava Rao"
                  className="bg-burgundy-dark/90 border-gold/30 text-ivory text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gold/40 text-gold focus:ring-gold bg-burgundy-dark"
                />
                <label htmlFor="active" className="text-xs text-ivory font-medium cursor-pointer">
                  Display active on website & public patron wall
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gold/20">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="border-gold/30 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="sm" disabled={submitting} className="text-xs font-bold">
                  {submitting ? 'Saving...' : editingSponsor ? 'Update Sponsor' : 'Add Sponsor'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Confirm Delete Sponsor Modal */}
      <ConfirmModal
        isOpen={!!deletingSponsor}
        onClose={() => setDeletingSponsor(null)}
        onConfirm={confirmDeleteSponsor}
        title="Delete Sponsor Record"
        message={`Are you sure you want to permanently delete the sponsor record for "${deletingSponsor?.name}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingLoading}
      />
    </div>
  );
}
