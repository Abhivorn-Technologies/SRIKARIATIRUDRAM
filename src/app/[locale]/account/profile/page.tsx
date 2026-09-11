'use client';

import React, { useState } from 'react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { COMMON_GOTRAMS, GOTRAMS_LIST, NAKSHATRAS, RASIS } from '@/lib/constants';
import { CheckCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function AccountProfilePage() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const [name, setName] = useState('K. Satyanarayana Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('satya.sharma@example.com');
  const [gotram, setGotram] = useState('Bharadwaja');
  const [nakshatra, setNakshatra] = useState('rohini');
  const [rasi, setRasi] = useState('vrishabha');
  const [address, setAddress] = useState('Flat 402, Sri Nilayam, Banjara Hills, Hyderabad');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
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
              Devotee Profile Details
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Manage your personal information, address for prasadam courier, and spiritual details
            </p>
          </div>

          <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
            {isSaved && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

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
                  label="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  label="Gotram"
                  value={gotram}
                  onChange={(e) => setGotram(e.target.value)}
                >
                  {GOTRAMS_LIST.map((g) => (
                    <option key={g.id} value={g.id}>
                      {isTe ? g.nameTe : isHi ? g.nameHi : g.nameEn}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Janma Nakshatra"
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                >
                  {NAKSHATRAS.map((n) => (
                    <option key={n.id} value={n.id}>
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
                    <option key={r.id} value={r.id}>
                      {isTe ? r.nameTe : r.nameEn}
                    </option>
                  ))}
                </Select>
              </div>

              <Input
                label="Postal Address for Prasadam Delivery"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="gold" size="md" className="font-bold uppercase tracking-wider">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
