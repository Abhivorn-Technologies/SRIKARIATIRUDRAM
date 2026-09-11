'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Upload, Trash2, Edit3, Plus, RefreshCw, X, AlertCircle, Check } from 'lucide-react';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDayNumber, setEditDayNumber] = useState(1);
  const [editNakshatra, setEditNakshatra] = useState('');
  const [editCategory, setEditCategory] = useState('rituals');
  const [savingEdit, setSavingEdit] = useState(false);

  // Upload Form
  const [title, setTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/gallery');
      const json = await res.json();
      if (json.success) {
        setImages(json.data || []);
      } else {
        setError(json.error || 'Failed to load gallery');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openEditModal = (img: any) => {
    setEditItem(img);
    setEditTitle(img.title || img.name || '');
    setEditDayNumber(img.day_number || 1);
    setEditNakshatra(img.nakshatra || '');
    setEditCategory(img.category || 'rituals');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    try {
      setSavingEdit(true);
      const res = await fetch(`/api/admin/gallery/${editItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          day_number: editDayNumber,
          nakshatra: editNakshatra,
          category: editCategory
        })
      });
      const json = await res.json();
      if (json.success) {
        setEditItem(null);
        fetchGallery();
      } else {
        alert(json.error || 'Failed to update photo');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update photo');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    try {
      setUploading(true);

      // 1. Request secure signed signature from server
      const sigRes = await fetch('/api/admin/upload/cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'srikari_atirudram/gallery' })
      });
      const sigJson = await sigRes.json();
      if (!sigJson.success) throw new Error(sigJson.error || 'Failed to sign upload request');

      const { signature, timestamp, apiKey, cloudName, folder } = sigJson.data;

      // 2. Direct upload to Cloudinary CDN
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const cloudJson = await cloudRes.json();
      if (cloudJson.error) throw new Error(cloudJson.error.message || 'Cloudinary upload failed');

      // 3. Save metadata to Supabase media_assets table
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedFile.name,
          title: title || selectedFile.name,
          media_type: 'image',
          cloudinary_public_id: cloudJson.public_id,
          secure_url: cloudJson.secure_url,
          url: cloudJson.secure_url,
          format: cloudJson.format,
          bytes: cloudJson.bytes,
          day_number: dayNumber,
          nakshatra: nakshatra,
          published: true
        })
      });

      const saveJson = await saveRes.json();
      if (saveJson.success) {
        setIsUploadOpen(false);
        setSelectedFile(null);
        setTitle('');
        fetchGallery();
      } else {
        alert(saveJson.error || 'Failed to save asset in database');
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchGallery();
      } else {
        alert(json.error || 'Failed to delete photo');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesDay = activeDayFilter === 'all' || String(img.day_number) === activeDayFilter;
    const matchesCategory = activeCategoryFilter === 'all' || img.category === activeCategoryFilter;
    return matchesDay && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              Photo Gallery & Media Manager
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Live database archive with edit, remove, and Cloudinary upload controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGallery}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload New Photo
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filter Row */}
      <Card className="p-4 bg-[#240006]/90 border-gold/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gold font-semibold font-cinzel">Day:</label>
            <select
              value={activeDayFilter}
              onChange={(e) => setActiveDayFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#1A0004] border border-gold/30 text-ivory outline-none"
            >
              <option value="all">All 28 Days</option>
              {Array.from({ length: 28 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Day {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gold font-semibold font-cinzel">Category:</label>
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#1A0004] border border-gold/30 text-ivory outline-none capitalize"
            >
              <option value="all">All Categories</option>
              <option value="rituals">Rituals & Homam</option>
              <option value="deities">Deity Alankaram</option>
              <option value="vedic">Veda Parayanam</option>
              <option value="annadanam">Annadanam</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-ivory/60">
          Showing <span className="text-gold font-bold">{filteredImages.length}</span> images in database
        </div>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <Card key={img.id} className="bg-[#240006]/90 border-gold/20 overflow-hidden group hover:border-gold/50 transition-all flex flex-col justify-between">
              <div className="relative aspect-square w-full bg-black/50 overflow-hidden">
                <img
                  src={img.secure_url || img.url}
                  alt={img.title || 'Srikari Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(img)}
                    title="Edit Photo Details"
                    className="w-7 h-7 rounded-full bg-gold/90 text-maroon font-bold flex items-center justify-center hover:bg-gold-light shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    title="Remove Photo"
                    className="w-7 h-7 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 flex items-center justify-center hover:bg-red-800 shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {img.category && (
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-gold-lighter border border-gold/30">
                    {img.category}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="font-semibold text-xs text-ivory truncate" title={img.title || img.name}>
                  {img.title || img.name}
                </p>
                <div className="flex justify-between items-center text-[10px] text-ivory/60">
                  <span>Day {img.day_number || 1}</span>
                  <span className="text-gold font-medium">{img.nakshatra || 'All Nakshatras'}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ivory/50 italic">
            {loading ? 'Loading gallery from database...' : 'No photos found matching filters.'}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-gold" />
                <h3 className="font-cinzel text-lg font-bold text-gold">Edit Photo Details</h3>
              </div>
              <button type="button" onClick={() => setEditItem(null)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ivory/70 block mb-1">Photo Title / Caption *</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Mahayagnam Day (1-28)</label>
                  <select
                    value={editDayNumber}
                    onChange={(e) => setEditDayNumber(Number(e.target.value))}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-ivory/70 block mb-1">Nakshatra</label>
                  <Input
                    placeholder="e.g. Rohini"
                    value={editNakshatra}
                    onChange={(e) => setEditNakshatra(e.target.value)}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs capitalize"
                >
                  <option value="rituals">Rituals & Homam</option>
                  <option value="deities">Deity Alankaram</option>
                  <option value="vedic">Veda Parayanam</option>
                  <option value="annadanam">Annadanam</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setEditItem(null)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpload} className="w-full max-w-lg bg-[#240006] border border-gold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold">Upload Photo to Cloudinary</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ivory/70 block mb-1">Select Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-ivory/70 block mb-1">Photo Title / Caption *</label>
                <Input
                  placeholder="e.g. Maha Rudra Homam Poornahuti Moments"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory/70 block mb-1">Mahayagnam Day (1-28)</label>
                  <select
                    value={dayNumber}
                    onChange={(e) => setDayNumber(Number(e.target.value))}
                    className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs"
                  >
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-ivory/70 block mb-1">Nakshatra</label>
                  <Input
                    placeholder="e.g. Rohini"
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/20">
              <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} className="border-gold/30 text-gold text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light">
                {uploading ? 'Uploading to Cloudinary...' : 'Upload & Publish'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

