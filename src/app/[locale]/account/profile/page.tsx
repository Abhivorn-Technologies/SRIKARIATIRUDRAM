'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { NAKSHATRAS, RASIS } from '@/lib/constants';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function AccountProfilePage() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';
  const { session, updateSession } = useDevoteeAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gotram, setGotram] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [rasi, setRasi] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.phone) {
      setPhone(session.phone);
      setLoading(true);
      fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session.phone)}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data?.profile) {
            const p = json.data.profile;
            setName(p.fullName || '');
            setEmail(p.email || '');
            setGotram(p.gotram || '');
            setNakshatra(p.nakshatra || '');
            setRasi(p.rasi || '');
            setAddress(p.address || '');
            setCity(p.city || '');
          }
        })
        .catch((err) => console.error('Failed to load profile', err))
        .finally(() => setLoading(false));
    }
  }, [session?.phone]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/devotee/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone || session?.phone,
          full_name: name,
          email,
          gotram,
          nakshatram: nakshatra,
          rasi,
          address,
          city,
        }),
      });
      const json = await res.json();
      if (json.success) {
        updateSession({ fullName: name, email, gotram, nakshatra, rasi, address, city });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Save profile error', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="border-b border-gold/20 pb-4">
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
              Devotee Profile & Spiritual Sankalpam Details
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Manage your personal information, address for prasadam courier, and spiritual details in MongoDB
            </p>
          </div>

          <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
            {isSaved && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Profile updated successfully in MongoDB!</span>
              </div>
            )}

            {loading ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
                <p className="text-xs text-gold-light">Loading profile from MongoDB...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="tel"
                    label="Mobile Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    label={isTe ? 'ఈమెయిల్ చిరునామా' : isHi ? 'ईमेल पता' : 'Email Address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label={isTe ? 'గోత్రం' : isHi ? 'गोत्र' : 'Gotram'}
                    value={gotram}
                    onChange={(e) => setGotram(e.target.value)}
                    placeholder={isTe ? 'మీ గోత్రం నమోదు చేయండి (ఉదా: భరద్వాజ, కాశ్యప)' : isHi ? 'अपना गोत्र दर्ज करें (उदा: भारद्वाज, कश्यप)' : 'Enter your Gotram (e.g. Bharadwaja, Kashyapa)'}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Janma Nakshatra"
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.nameEn}>
                        {isTe ? n.nameTe : n.nameEn} ({isTe ? n.rasiTe : n.rasiEn})
                      </option>
                    ))}
                  </Select>
                  <Select
                    label="Rasi"
                    value={rasi}
                    onChange={(e) => setRasi(e.target.value)}
                  >
                    {RASIS.map((r) => (
                      <option key={r.id} value={r.nameEn}>
                        {isTe ? r.nameTe : r.nameEn}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Postal Address for Prasadam Delivery"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="gold" size="md" isLoading={saving} className="font-bold uppercase tracking-wider">
                    {saving ? 'Saving...' : 'Save Profile to MongoDB'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
