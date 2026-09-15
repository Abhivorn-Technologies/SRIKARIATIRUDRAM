'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { HelpCircle, Plus, Trash2, Edit2, Search, RefreshCw, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  question_te?: string;
  question_hi?: string;
  answer: string;
  answer_te?: string;
  answer_hi?: string;
  category?: string;
  sort_order?: number;
  published?: boolean;
}

export default function AdminFAQPage() {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FAQItem | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    question_te: '',
    answer: '',
    answer_te: '',
    category: 'General',
    sort_order: 1,
    published: true,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/faq', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data || []);
      } else {
        setError(json.error || 'Failed to fetch FAQs');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      question_te: '',
      answer: '',
      answer_te: '',
      category: 'General',
      sort_order: faqs.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question || '',
      question_te: item.question_te || '',
      answer: item.answer || '',
      answer_te: item.answer_te || '',
      category: item.category || 'General',
      sort_order: item.sort_order || 1,
      published: item.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: FAQItem) => {
    const newPublished = !item.published;
    try {
      const res = await fetch(`/api/admin/faq/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished })
      });
      const json = await res.json();
      if (json.success) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, published: newPublished } : f))
        );
        showToast(
          newPublished ? 'FAQ is now PUBLIC on website' : 'FAQ is HIDDEN from website',
          'success'
        );
      } else {
        showToast(json.error || 'Failed to update visibility', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Question and Answer are required', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        question: formData.question.trim(),
        question_te: formData.question_te.trim() || null,
        answer: formData.answer.trim(),
        answer_te: formData.answer_te.trim() || null,
        category: formData.category,
        sort_order: Number(formData.sort_order) || 1,
        published: formData.published,
      };

      if (editingItem) {
        const res = await fetch(`/api/admin/faq/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          showToast('FAQ updated successfully!', 'success');
          fetchFaqs();
        } else {
          showToast(json.error || 'Failed to update FAQ', 'error');
        }
      } else {
        const res = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          showToast('New FAQ added successfully!', 'success');
          fetchFaqs();
        } else {
          showToast(json.error || 'Failed to add FAQ', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeletingLoading(true);
      const res = await fetch(`/api/admin/faq/${deletingItem.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== deletingItem.id));
        showToast('FAQ item deleted successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to delete FAQ', 'error');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setDeletingLoading(false);
      setDeletingItem(null);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const q = (faq.question + ' ' + (faq.answer || '') + ' ' + (faq.category || '')).toLowerCase();
    return q.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Frequently Asked Questions (FAQ) Manager
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Manage FAQs displayed across the website for devotee guidance, Sankalpam rules, and ritual details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFaqs}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add FAQ Item
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Filter Bar */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gold/60 absolute left-3 top-2.5" />
          <Input
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#1A0004] border-gold/30 text-ivory text-xs"
          />
        </div>
        <div className="text-xs text-ivory/60 font-sans">
          Total FAQs: <strong className="text-gold">{faqs.length}</strong> (Public: {faqs.filter(f => f.published !== false).length})
        </div>
      </Card>

      {/* FAQ Items List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <Card key={faq.id} className="p-5 bg-burgundy-deep/90 border-gold/25 space-y-3 group hover:border-gold/50 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm" className="text-[10px]">
                    {faq.category || 'General'}
                  </Badge>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      faq.published !== false
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                    }`}
                  >
                    {faq.published !== false ? 'PUBLIC' : 'HIDDEN'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Hide / Unhide Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(faq)}
                    title={faq.published !== false ? 'Hide from public website' : 'Make public on website'}
                    className={`h-7 px-2 text-xs flex items-center gap-1 ${
                      faq.published !== false
                        ? 'text-emerald-400 hover:bg-emerald-950/40'
                        : 'text-amber-400 hover:bg-amber-950/40'
                    }`}
                  >
                    {faq.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{faq.published !== false ? 'Public' : 'Hidden'}</span>
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(faq)}
                    title="Edit FAQ"
                    className="h-7 w-7 p-0 text-gold hover:bg-gold/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingItem(faq)}
                    title="Delete FAQ"
                    className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-ivory group-hover:text-gold-light transition-colors">
                  {faq.question}
                </h3>
                {faq.question_te && (
                  <p className="text-xs text-gold/80 font-telugu font-semibold">
                    {faq.question_te}
                  </p>
                )}
                <p className="text-xs text-ivory/75 font-sans leading-relaxed pt-1">
                  {faq.answer}
                </p>
                {faq.answer_te && (
                  <p className="text-xs text-ivory/60 font-telugu leading-relaxed pt-1">
                    {faq.answer_te}
                  </p>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-ivory/50 italic bg-burgundy-deep/40 rounded-xl border border-gold/10">
            {loading ? 'Loading FAQs from database...' : 'No FAQs found matching your search.'}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-xl bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">
                {editingItem ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/80 font-medium block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Rituals">Rituals & Homams</option>
                    <option value="Booking & Prasadam">Booking & Prasadam</option>
                    <option value="Location & Travel">Location & Travel</option>
                  </select>
                </div>

                <div>
                  <label className="text-ivory/80 font-medium block mb-1">Sort Order</label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Question (English) *</label>
                <Input
                  required
                  placeholder="e.g. Can devotees attend the Yagnam in person?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Question (Telugu)</label>
                <Input
                  placeholder="e.g. ఈ మహాయజ్ఞంలో భక్తులు ప్రత్యక్షంగా పాల్గొనవచ్చా?"
                  value={formData.question_te}
                  onChange={(e) => setFormData({ ...formData, question_te: e.target.value })}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs font-telugu"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Answer (English) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed answer explanation..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="text-ivory/80 font-medium block mb-1">Answer (Telugu)</label>
                <textarea
                  rows={3}
                  placeholder="తెలుగు వివరణ..."
                  value={formData.answer_te}
                  onChange={(e) => setFormData({ ...formData, answer_te: e.target.value })}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs font-telugu"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faq-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-gold/40 text-gold focus:ring-gold bg-[#1A0004]"
                />
                <label htmlFor="faq-published" className="text-xs text-ivory font-medium cursor-pointer">
                  Publicly visible on website FAQ section
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add FAQ'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete FAQ Item"
        message={`Are you sure you want to permanently delete the FAQ question "${deletingItem?.question}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingLoading}
      />
    </div>
  );
}
