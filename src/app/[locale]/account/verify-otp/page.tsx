'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, ArrowLeft } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '+91 98765 43210';
  const t = useTranslations('account');

  const [otp, setOtp] = useState('1008');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/account');
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-gold mx-auto p-1 bg-burgundy-deep flex items-center justify-center">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-lighter">
            {t('verifyOtp')}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70">
            {t('otpSent')} <strong className="text-gold-light">{phone}</strong>
          </p>
        </div>

        <Card variant="gold-border" className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              label="Enter 4-Digit OTP"
              maxLength={4}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center font-mono text-2xl tracking-[10px] font-bold"
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold uppercase tracking-wider py-3.5"
            >
              Verify & Enter Portal
            </Button>
          </form>

          <div className="text-center text-xs text-ivory/60">
            Didn&apos;t receive OTP? <button type="button" className="text-gold font-semibold ml-1">Resend OTP</button>
          </div>
        </Card>

        <div className="text-center">
          <Link href="/account/login" className="inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-gold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
