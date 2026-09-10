'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  Building,
  CalendarCheck,
  CreditCard,
  BellRing,
  Globe,
  Save,
  CheckCircle2,
  Info,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'booking' | 'payment' | 'notifications' | 'language'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    orgName: 'Srikari Seva Samiti (Regd.)',
    trusteeName: 'Sri K. Venkata Raman & Srikari Trust Board',
    venue: 'Sri Shirdi Sai Baba Sansthan Yagashala Ground',
    venueLandmark: 'Dilsukhnagar, Hyderabad, Telangana 500060',
    primaryPhone: '+91 94401 23456',
    secondaryPhone: '+91 98490 98765',
    whatsappPhone: '+91 94401 23456',
    officialEmail: 'info@srikariatirudram.com',
    accountsEmail: 'accounts@srikariatirudram.com',
    yagnamDates: '25 Nov 2026 – 22 Dec 2026 (28 Sacred Days)',
  });

  const [bookingSettings, setBookingSettings] = useState({
    enableOnlineBooking: true,
    enableCounterBooking: true,
    dailySankalpamCutoff: '18:00',
    maxFamilyMembersPerPass: '6',
    autoConfirmUPI: true,
    requireGotram: true,
    requireNakshatra: true,
    allowSpecialRequests: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    merchantName: 'SRIKARI SEVA SAMITI',
    upiVpa: 'srikariyagnam@icici',
    paymentGatewayProvider: 'Razorpay / Cashfree (Integrated)',
    gatewayKeyId: 'rzp_live_••••••••••••••••',
    gatewayKeySecret: '••••••••••••••••••••••••',
    enableUpiQr: true,
    enableNetBanking: true,
    enableCardPayments: true,
    enableManualReceiptUpload: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableWhatsappAlerts: true,
    whatsappApiKey: 'wa_live_••••••••••••••••',
    whatsappSenderNumber: '+91 94401 23456',
    enableEmailReceipts: true,
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    senderEmail: 'receipts@srikariatirudram.com',
    smsGatewayEnabled: true,
  });

  const [languageSettings, setLanguageSettings] = useState({
    defaultLanguage: 'en',
    englishActive: true,
    teluguActive: true,
    hindiActive: true,
    autoTranslatePurohitSlokas: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building, desc: 'Organisation, venue & contacts' },
    { id: 'booking', label: 'Booking', icon: CalendarCheck, desc: 'Capacity & registration limits' },
    { id: 'payment', label: 'Payment', icon: CreditCard, desc: 'UPI & gateway configurations' },
    { id: 'notifications', label: 'Notifications', icon: BellRing, desc: 'WhatsApp & Email SMS alerts' },
    { id: 'language', label: 'Language', icon: Globe, desc: 'English, Telugu & Hindi' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              OPERATIONAL CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-gold" />
            Admin Operations Settings
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage single-admin operational preferences, venue coordinates, booking capacities, payment gateways, and communications.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="gold"
          size="sm"
          className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Save Operational Settings
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Operational settings updated successfully across the Srikari Admin control center!</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-burgundy via-burgundy-deep to-burgundy border-gold shadow-gold-sm'
                  : 'bg-burgundy-deep/60 border-gold/20 hover:border-gold/50 hover:bg-burgundy/40 text-ivory/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-gold/60'}`} />
                <span className={`text-xs font-cinzel font-bold ${isActive ? 'text-gold-lighter' : 'text-ivory'}`}>
                  {tab.label}
                </span>
              </div>
              <p className="text-[10px] text-ivory/60 mt-1 truncate font-sans">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: General */}
      {activeTab === 'general' && (
        <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-6">
          <div className="border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <Building className="w-4 h-4 text-gold" />
              General Organisation & Venue Information
            </h3>
            <p className="text-xs text-ivory/60 font-sans mt-0.5">
              Official committee info, Yagashala location details, and devotee enquiry phone lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Organisation / Trust Name</label>
              <Input
                value={generalSettings.orgName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, orgName: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Trustee / Committee Head</label>
              <Input
                value={generalSettings.trusteeName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, trusteeName: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Yagashala Venue</label>
              <Input
                value={generalSettings.venue}
                onChange={(e) => setGeneralSettings({ ...generalSettings, venue: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Venue Landmark & Address</label>
              <Input
                value={generalSettings.venueLandmark}
                onChange={(e) => setGeneralSettings({ ...generalSettings, venueLandmark: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Primary Contact Number</label>
              <Input
                value={generalSettings.primaryPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, primaryPhone: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Secondary / Helpline Number</label>
              <Input
                value={generalSettings.secondaryPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, secondaryPhone: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Official Enquiry Email</label>
              <Input
                type="email"
                value={generalSettings.officialEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, officialEmail: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Accounts / 80G Receipts Email</label>
              <Input
                type="email"
                value={generalSettings.accountsEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, accountsEmail: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Booking */}
      {activeTab === 'booking' && (
        <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-6">
          <div className="border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold" />
              Booking Configuration, Availability & Capacity
            </h3>
            <p className="text-xs text-ivory/60 font-sans mt-0.5">
              Control daily registration quotas, cutoff timings for Homam chanting lists, and devotee parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ivory">Online Seva Registrations</p>
                <p className="text-[11px] text-ivory/60">Allow devotees to book sevas through the website</p>
              </div>
              <input
                type="checkbox"
                checked={bookingSettings.enableOnlineBooking}
                onChange={(e) => setBookingSettings({ ...bookingSettings, enableOnlineBooking: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ivory">Counter Spot Bookings</p>
                <p className="text-[11px] text-ivory/60">Enable counter billing desk inside the temple premises</p>
              </div>
              <input
                type="checkbox"
                checked={bookingSettings.enableCounterBooking}
                onChange={(e) => setBookingSettings({ ...bookingSettings, enableCounterBooking: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Daily Sankalpam List Cutoff Time</label>
              <Input
                type="time"
                value={bookingSettings.dailySankalpamCutoff}
                onChange={(e) => setBookingSettings({ ...bookingSettings, dailySankalpamCutoff: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
              <p className="text-[10px] text-ivory/50">Bookings after this time are batched for next morning sankalpam</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Max Family Members Per Pass</label>
              <Input
                type="number"
                value={bookingSettings.maxFamilyMembersPerPass}
                onChange={(e) => setBookingSettings({ ...bookingSettings, maxFamilyMembersPerPass: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
              <p className="text-[10px] text-ivory/50">Maximum names included in a single Sankalpam ticket</p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Payment */}
      {activeTab === 'payment' && (
        <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-6">
          <div className="border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold" />
              Payment Gateway & UPI Configurations
            </h3>
            <p className="text-xs text-ivory/60 font-sans mt-0.5">
              UPI VPA address, Razorpay/Cashfree webhook placeholders, and manual transaction reconciliation options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Merchant Name on UPI</label>
              <Input
                value={paymentSettings.merchantName}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, merchantName: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Official Trust UPI VPA (Virtual Payment Address)</label>
              <Input
                value={paymentSettings.upiVpa}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, upiVpa: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Payment Gateway API Key ID (Placeholder)</label>
              <Input
                value={paymentSettings.gatewayKeyId}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, gatewayKeyId: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Payment Gateway Secret Key (Placeholder)</label>
              <Input
                type="password"
                value={paymentSettings.gatewayKeySecret}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, gatewayKeySecret: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory">Direct UPI Dynamic QR Code</span>
              <input
                type="checkbox"
                checked={paymentSettings.enableUpiQr}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, enableUpiQr: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory">Devotee Screenshot / UTR Verification Upload</span>
              <input
                type="checkbox"
                checked={paymentSettings.enableManualReceiptUpload}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, enableManualReceiptUpload: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Notifications */}
      {activeTab === 'notifications' && (
        <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-6">
          <div className="border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <BellRing className="w-4 h-4 text-gold" />
              WhatsApp & Email Communication Gateways
            </h3>
            <p className="text-xs text-ivory/60 font-sans mt-0.5">
              Configure automated receipt dispatches, WhatsApp confirmation templates, and priest reminders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">WhatsApp Business API Key (Placeholder)</label>
              <Input
                value={notificationSettings.whatsappApiKey}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, whatsappApiKey: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">WhatsApp Sender Phone Number</label>
              <Input
                value={notificationSettings.whatsappSenderNumber}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, whatsappSenderNumber: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">SMTP Host / Email Gateway (Placeholder)</label>
              <Input
                value={notificationSettings.smtpHost}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, smtpHost: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light">Sender Email Address</label>
              <Input
                value={notificationSettings.senderEmail}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, senderEmail: e.target.value })}
                className="text-xs bg-burgundy-dark/90 border-gold/30 text-ivory"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory">Instant WhatsApp Booking Pass with QR</span>
              <input
                type="checkbox"
                checked={notificationSettings.enableWhatsappAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, enableWhatsappAlerts: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory">Automated PDF E-Receipt via Email</span>
              <input
                type="checkbox"
                checked={notificationSettings.enableEmailReceipts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, enableEmailReceipts: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Language */}
      {activeTab === 'language' && (
        <Card variant="gold-border" className="p-5 sm:p-6 bg-burgundy-deep/90 border-gold/30 space-y-6">
          <div className="border-b border-gold/15 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-lighter flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold" />
              Language Configuration (English, Telugu, Hindi)
            </h3>
            <p className="text-xs text-ivory/60 font-sans mt-0.5">
              Control portal language availability, devotee default preference, and bilingual Sankalpam chanting exports.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ivory">English Language Support</p>
                <p className="text-[11px] text-ivory/60">Universal global & pan-India devotee accessibility</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ivory">Telugu Language Support (తెలుగు)</p>
                <p className="text-[11px] text-ivory/60">Native Telugu script for Telangana & Andhra Pradesh devotees</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ivory">Hindi Language Support (हिन्दी)</p>
                <p className="text-[11px] text-ivory/60">Devanagari script for North India & international devotees</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
