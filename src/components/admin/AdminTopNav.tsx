'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { AdminUser, adminAuth } from '@/lib/adminAuth';
import { Link, useRouter } from '@/i18n/routing';

interface AdminTopNavProps {
  user: AdminUser | null;
  onOpenSidebar: () => void;
}

export function AdminTopNav({ user, onOpenSidebar }: AdminTopNavProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    adminAuth.logout();
    router.push('/admin/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-burgundy-deep/95 backdrop-blur-md border-b border-gold/25 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Sidebar Toggle & SRIKARI ADMIN Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-ivory hover:text-gold hover:bg-white/5 border border-gold/30 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black font-cinzel tracking-wider text-gold-lighter uppercase">
            SRIKARI ADMIN
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Full Access
          </span>
        </div>
      </div>

      {/* Right: Notifications & ADMIN Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="p-2 rounded-lg text-ivory/80 hover:text-gold hover:bg-white/5 border border-gold/20 relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-burgundy-deep" />
        </Link>

        {/* ADMIN ▼ Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-burgundy/80 hover:bg-burgundy border border-gold/30 text-gold-light hover:text-gold transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/40">
              A
            </div>
            <span className="text-xs font-bold font-cinzel tracking-wider uppercase">
              ADMIN
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-burgundy-deep border border-gold/40 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-gold/15">
                <p className="text-xs font-bold text-ivory">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gold/70 truncate">{user?.email || 'admin@srikariatirudram.com'}</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-ivory/80 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-gold/70" />
                <span>Profile</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-ivory/80 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-gold/70" />
                <span>Settings</span>
              </Link>

              <div className="my-1 border-t border-gold/15" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
