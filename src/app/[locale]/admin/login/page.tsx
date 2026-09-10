'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { adminAuth } from '@/lib/adminAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@srikariatirudram.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      // Valid demo authentication for the single Admin
      if (email.toLowerCase() === 'admin@srikariatirudram.com' && password === 'admin123') {
        adminAuth.login({
          id: 'admin_1',
          name: 'Administrator',
          email: 'admin@srikariatirudram.com',
        });
        router.push('/admin');
      } else if (password.length >= 6) {
        // Accept other admin emails with min 6 char password
        adminAuth.login({
          id: 'admin_single',
          name: 'Administrator',
          email: email.trim(),
        });
        router.push('/admin');
      } else {
        setError('Invalid credentials. Use demo: admin@srikariatirudram.com / admin123');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#180004] via-burgundy-deep to-[#180004] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Mandala Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold/15 via-burgundy/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-gold transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Website
          </Link>
          <span className="text-[11px] text-ivory/50 font-cinzel tracking-widest uppercase">
            Srikari Ati Rudram
          </span>
        </div>

        {/* Main Login Card */}
        <Card
          variant="gold-border"
          className="p-6 sm:p-8 bg-burgundy-deep/95 backdrop-blur-xl border-gold/40 shadow-2xl space-y-6"
        >
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Image
                src="/assets/icons/SRIKARIATI RUDRAM.svg"
                alt="Srikari Ati Rudram"
                width={200}
                height={55}
                priority
                className="h-11 w-auto object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-cinzel font-black tracking-widest text-gold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                SRIKARI ADMIN
              </div>
              <h1 className="font-cinzel text-xl sm:text-2xl font-black text-gold-lighter pt-1">
                Admin Sign In
              </h1>
              <p className="text-xs text-ivory/70 font-sans">
                Full-access administrative control center for Mahayagnam operations.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-sans">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light block">
                Admin Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srikariatirudram.com"
                  required
                  className="pl-10 text-xs sm:text-sm bg-burgundy-dark/90 border-gold/40 text-ivory placeholder:text-ivory/40 focus:border-gold"
                />
                <Mail className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-light block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 text-xs sm:text-sm bg-burgundy-dark/90 border-gold/40 text-ivory placeholder:text-ivory/40 focus:border-gold"
                />
                <Lock className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 rounded-xl bg-primary/40 border border-gold/20 flex items-start gap-2.5 text-xs text-ivory/80">
              <KeyRound className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[11px]">
                <p className="font-bold text-gold-light">Single Admin Access:</p>
                <p className="font-mono text-ivory/90">admin@srikariatirudram.com / admin123</p>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading}
              className="w-full font-bold uppercase tracking-wider text-xs py-3 shadow-gold-md"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-burgundy-deep border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-burgundy-deep" />
                  <span>Sign In as Admin</span>
                </div>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer info */}
        <p className="text-center text-[11px] text-ivory/50 font-sans">
          Protected System • Srikari Seva Samiti © 2026
        </p>
      </div>
    </div>
  );
}
