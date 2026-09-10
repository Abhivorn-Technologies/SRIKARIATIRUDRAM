'use client';

import React, { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Smartphone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DevoteeLoginPage() {
  const router = useRouter();
  const t = useTranslations('account');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/account/verify-otp?phone=${encodeURIComponent(phone)}`);
      }, 800);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-gold mx-auto p-1 bg-burgundy-deep flex items-center justify-center">
            <span className="font-cinzel text-2xl font-bold text-gold">ॐ</span>
          </div>
          <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-lighter">
            {t('loginTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans">
            {t('loginSubtitle')}
          </p>
        </div>

        <Card variant="gold-border" className="p-6 md:p-8 space-y-6 font-sans">
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              type="tel"
              label={t('enterMobile')}
              placeholder="10-digit mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold uppercase tracking-wider py-3.5"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              {t('sendOtp')}
            </Button>
          </form>

          <div className="pt-2 border-t border-gold/20 flex items-center justify-center gap-1.5 text-xs text-ivory/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure OTP-based instant devotee access</span>
          </div>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-xs text-gold-light hover:text-gold">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
