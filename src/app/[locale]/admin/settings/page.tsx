'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  Building,
  CreditCard,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    site_title: 'Srikari Ati Rudra Mahayagnam 2026',
    kalyanam_amount: 5116,
    annadanam_slot_amount: 5116,
    nakshatra_hawan_amount: 216,
    contact_phone: '+91 94904 62652',
    contact_email: 'contact@srikariatirudram.org',
    venue_address: 'Srikari Sri Kshetram, Yajna Vedika, Hyderabad, Telangana, India'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (json.success) {
        setSettings((prev: any) => ({ ...prev, ...json.data }));
      } else {
        setError(json.error || 'Failed to load settings');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...settings,
        kalyanam_amount: settings.kalyanam_amount === '' ? 5116 : Number(settings.kalyanam_amount),
        annadanam_slot_amount: settings.annadanam_slot_amount === '' ? 5116 : Number(settings.annadanam_slot_amount),
        nakshatra_hawan_amount: settings.nakshatra_hawan_amount === '' ? 216 : Number(settings.nakshatra_hawan_amount),
      };
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.error || 'Failed to update settings');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#240006] border border-gold/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-gold" />
            <h1 className="font-cinzel text-2xl font-bold text-ivory">
              System Settings & Configurations
            </h1>
          </div>
          <p className="text-xs text-ivory/70">
            Dynamic site-wide configurations, donation amounts, contact details, and venue settings stored in Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={loading}
            className="border-gold/40 text-gold hover:bg-gold/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-gold text-maroon font-bold text-xs hover:bg-gold-light"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved to Supabase! All public pages and booking flows reflect changes immediately.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Information */}
        <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-4">
          <div className="flex items-center gap-2 border-b border-gold/15 pb-2">
            <Building className="w-4 h-4 text-gold" />
            <h3 className="font-cinzel text-sm font-bold text-ivory">General Information</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-ivory/70 block mb-1">Official Event Title</label>
              <Input
                value={settings.site_title || ''}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Contact Phone Number</label>
              <Input
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Contact Email Address</label>
              <Input
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Official Temple UPI ID (VPA for QR Code)</label>
              <Input
                value={settings.temple_upi_id ?? ''}
                onChange={(e) => setSettings({ ...settings, temple_upi_id: e.target.value })}
                placeholder="e.g. srikariatirudram@icici or 9490462652@ybl"
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs font-mono"
              />
              <p className="text-[10px] text-gold/70 mt-1">
                This UPI ID is used to generate the dynamic QR Code & Mobile UPI pay buttons.
              </p>
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Yajnashala Venue Address</label>
              <textarea
                value={settings.venue_address || ''}
                onChange={(e) => setSettings({ ...settings, venue_address: e.target.value })}
                className="w-full bg-[#1A0004] border border-gold/30 text-ivory rounded-lg p-2 text-xs h-20"
              />
            </div>
          </div>
        </Card>

        {/* Dynamic Pricing & Payment Settings */}
        <Card className="p-5 bg-[#240006]/90 border-gold/20 space-y-4">
          <div className="flex items-center gap-2 border-b border-gold/15 pb-2">
            <CreditCard className="w-4 h-4 text-gold" />
            <h3 className="font-cinzel text-sm font-bold text-ivory">Dynamic Seva Pricing Rules</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-ivory/70 block mb-1">Subramanyeswara Kalyanam Dakshina (Krithika Day) ₹</label>
              <Input
                type="number"
                value={settings.kalyanam_amount ?? ''}
                onChange={(e) => setSettings({ ...settings, kalyanam_amount: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Per-Day Annadanam Sponsorship Base (₹)</label>
              <Input
                type="number"
                value={settings.annadanam_slot_amount ?? ''}
                onChange={(e) => setSettings({ ...settings, annadanam_slot_amount: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>

            <div>
              <label className="text-ivory/70 block mb-1">Nakshatra Hawan Minimum Contribution (₹)</label>
              <Input
                type="number"
                value={settings.nakshatra_hawan_amount ?? ''}
                onChange={(e) => setSettings({ ...settings, nakshatra_hawan_amount: e.target.value })}
                className="bg-[#1A0004] border-gold/30 text-ivory text-xs"
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
