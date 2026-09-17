'use client';

import React, { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { validatePhone, validatePassword } from '@organization-wide-standards/input-validations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Smartphone, Lock, ShieldCheck, KeyRound, UserCheck, Eye, EyeOff, CheckCircle2, AlertCircle, LogIn, UserPlus } from 'lucide-react';

export default function DevoteeLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const { login } = useDevoteeAuth();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Real-time Validations from @organization-wide-standards/input-validations
  const phoneVal = validatePhone(phone);
  const passVal = validatePassword(password);
  const passwordsMatch = Boolean(password && confirmPassword && password === confirmPassword);

  // Handle Switch Mode
  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phoneVal.isValid) {
      setErrorMsg(phoneVal.errorMessage || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/devotee/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const json = await res.json();

      if (json.success && json.data) {
        login(json.data.phone, json.data);
        setSuccessMsg(redirectUrl ? 'Sign In successful! Continuing to booking...' : 'Sign In successful! Redirecting to Devotee Dashboard...');
        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            router.push('/account');
          }
        }, 600);
      } else if (json.requireSetup) {
        setMode('signup');
        setErrorMsg(`Password is not set for mobile number ${phone} yet. Please set your password below to activate your login.`);
      } else {
        setErrorMsg(json.error || 'Invalid mobile number or password.');
      }
    } catch (err: any) {
      setErrorMsg('Sign In failed. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phoneVal.isValid) {
      setErrorMsg(phoneVal.errorMessage || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!passVal.isValid) {
      setErrorMsg(passVal.errorMessage || 'Password does not meet validation rules.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure Password and Confirm Password match.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/devotee/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          fullName: fullName.trim() || 'Sacred Devotee',
          password,
          confirmPassword
        })
      });
      const json = await res.json();

      if (json.success && json.data) {
        login(json.data.phone, json.data);
        setSuccessMsg(redirectUrl ? 'Sign Up successful! Continuing to booking...' : 'Sign Up successful! Redirecting to Devotee Dashboard...');
        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            router.push('/account');
          }
        }, 600);
      } else {
        setErrorMsg(json.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMsg('Sign Up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full border-2 border-gold mx-auto p-1 bg-burgundy-deep flex items-center justify-center shadow-gold-sm">
            <span className="font-cinzel text-3xl font-bold text-gold">ॐ</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-lighter tracking-wide">
            Devotee Account
          </h1>
          <p className="text-xs sm:text-sm text-ivory/75 font-sans">
            Srikari Ati Rudra Mahayagnam — Devotee Portal
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-burgundy-deep/90 border border-gold/30">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-cinzel transition-all flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#2B0005] shadow-md'
                : 'text-ivory/70 hover:text-gold-light'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-cinzel transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#2B0005] shadow-md'
                : 'text-ivory/70 hover:text-gold-light'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        <Card variant="sacred" className="p-6 md:p-8 space-y-6 font-sans border-gold/40">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= SIGN IN FORM ================= */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="border-b border-gold/20 pb-2">
                <h3 className="font-cinzel text-lg font-bold text-gold-lighter">
                  Sign In to Your Account
                </h3>
                <p className="text-xs text-ivory/70">
                  Enter your mobile number and password to open your dashboard.
                </p>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gold font-cinzel">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans focus:outline-none focus:border-[#D6A532]"
                  />
                </div>
                {phone.length > 0 && !phoneVal.isValid && (
                  <p className="text-[11px] text-rose-400 font-medium pt-1">
                    ⚠️ {phoneVal.errorMessage}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gold font-cinzel">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-sm font-sans focus:outline-none focus:border-[#D6A532]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={loading}
                disabled={!phoneVal.isValid || !password}
                className="w-full font-bold uppercase tracking-wider py-3.5 text-xs shadow-gold-md"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-xs text-gold-light hover:text-gold font-semibold transition-colors"
                >
                  Don't have an account? <span className="underline">Sign Up here</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= SIGN UP FORM ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="border-b border-gold/20 pb-2">
                <h3 className="font-cinzel text-lg font-bold text-gold-lighter">
                  Create Devotee Account (Sign Up)
                </h3>
                <p className="text-xs text-ivory/70">
                  Register your mobile number and set a password to track Sevas.
                </p>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gold font-cinzel">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] placeholder:text-[#8A8A8A] text-xs font-sans focus:outline-none focus:border-[#D6A532]"
                  />
                </div>
                {phone.length > 0 && !phoneVal.isValid && (
                  <p className="text-[11px] text-rose-400 font-medium pt-1">
                    ⚠️ {phoneVal.errorMessage}
                  </p>
                )}
              </div>

              {/* Devotee Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gold font-cinzel">
                  Devotee Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Satyanarayana Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] text-xs font-sans focus:outline-none focus:border-[#D6A532]"
                />
              </div>

              {/* Create Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gold font-cinzel">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] text-xs font-sans focus:outline-none focus:border-[#D6A532]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Rules Validation Helper */}
                {password.length > 0 && (
                  <div className="p-2 rounded bg-burgundy-deep/90 border border-gold/20 text-[11px] space-y-1 mt-1">
                    <p className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-emerald-400' : 'text-ivory/60'}`}>
                      <span>{password.length >= 8 ? '✓' : '○'}</span> At least 8 characters long
                    </p>
                    <p className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-ivory/60'}`}>
                      <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span> Contains uppercase letter (A-Z)
                    </p>
                    <p className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password) ? 'text-emerald-400' : 'text-ivory/60'}`}>
                      <span>{/[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password) ? '✓' : '○'}</span> Contains special character (!@#$)
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gold font-cinzel">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password to confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#D6A532]/40 text-[#3A0A0A] text-xs font-sans focus:outline-none focus:border-[#D6A532]"
                  />
                </div>

                {confirmPassword.length > 0 && (
                  <p className={`text-[11px] font-medium pt-1 ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passwordsMatch ? '✓ Passwords match!' : '⚠️ Passwords do not match'}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={loading}
                disabled={!phoneVal.isValid || !passVal.isValid || !passwordsMatch}
                className="w-full font-bold uppercase tracking-wider py-3.5 text-xs shadow-gold-md"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account &amp; Sign In
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-xs text-gold-light hover:text-gold font-semibold transition-colors"
                >
                  Already have an account? <span className="underline">Sign In here</span>
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-gold/20 flex items-center justify-center gap-1.5 text-xs text-ivory/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Standard Verified Devotee Security</span>
          </div>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-xs text-gold-light hover:text-gold transition-colors">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
