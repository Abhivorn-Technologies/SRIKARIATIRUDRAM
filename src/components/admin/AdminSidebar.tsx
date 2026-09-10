'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import {
  LayoutDashboard,
  Calendar,
  Flame,
  ClipboardList,
  Scroll,
  Users,
  Coins,
  Utensils,
  CreditCard,
  Image as ImageIcon,
  Radio,
  Trophy,
  HelpCircle,
  FileText,
  BarChart3,
  Mail,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AdminUser, adminAuth } from '@/lib/adminAuth';

interface AdminSidebarProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // State for collapsible sub-menus
  const [scheduleExpanded, setScheduleExpanded] = useState(true);
  const [paymentsExpanded, setPaymentsExpanded] = useState(true);

  const handleLogout = () => {
    adminAuth.logout();
    router.push('/admin/login');
  };

  const isExactActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-burgundy-dark via-burgundy-deep to-[#180004] border-r border-gold/30 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-gold/25 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 group">
            <Image
              src="/assets/icons/SRIKARIATI RUDRAM.svg"
              alt="Srikari Ati Rudram"
              width={150}
              height={38}
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-[10px] font-cinzel uppercase font-black tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/40">
              ADMIN
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-ivory/70 hover:text-gold hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {/* Dashboard */}
          <Link
            href="/admin"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              isExactActive('/admin')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold shadow-gold-sm'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 ${isExactActive('/admin') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Dashboard</span>
            </div>
            {isExactActive('/admin') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Schedule (Parent + Sub-items) */}
          <div className="space-y-0.5">
            <button
              onClick={() => setScheduleExpanded(!scheduleExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname.startsWith('/admin/schedule')
                  ? 'text-gold-lighter bg-gold/10 border border-gold/30 font-bold'
                  : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gold/70" />
                <span>Schedule</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gold/60 transition-transform ${
                  scheduleExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {scheduleExpanded && (
              <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-gold/20 ml-5 my-0.5">
                <Link
                  href="/admin/schedule"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/schedule')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>28-Day Programme</span>
                </Link>
                <Link
                  href="/admin/schedule/today"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/schedule/today')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>Today&apos;s Programme</span>
                </Link>
                <Link
                  href="/admin/schedule/announcements"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/schedule/announcements')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>Announcements</span>
                </Link>
              </div>
            )}
          </div>

          {/* Sevas */}
          <Link
            href="/admin/sevas"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/sevas')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className={`w-4 h-4 ${pathname.startsWith('/admin/sevas') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Sevas</span>
            </div>
            {pathname.startsWith('/admin/sevas') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Bookings */}
          <Link
            href="/admin/bookings"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/bookings')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className={`w-4 h-4 ${pathname.startsWith('/admin/bookings') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Bookings</span>
            </div>
            {pathname.startsWith('/admin/bookings') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Sankalpam */}
          <Link
            href="/admin/sankalpam"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/sankalpam')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Scroll className={`w-4 h-4 ${pathname.startsWith('/admin/sankalpam') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Sankalpam</span>
            </div>
            {pathname.startsWith('/admin/sankalpam') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Devotees */}
          <Link
            href="/admin/devotees"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/devotees')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 ${pathname.startsWith('/admin/devotees') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Devotees</span>
            </div>
            {pathname.startsWith('/admin/devotees') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Donations */}
          <Link
            href="/admin/donations"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/donations')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Coins className={`w-4 h-4 ${pathname.startsWith('/admin/donations') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Donations</span>
            </div>
            {pathname.startsWith('/admin/donations') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Annadanam */}
          <Link
            href="/admin/annadanam"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/annadanam')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Utensils className={`w-4 h-4 ${pathname.startsWith('/admin/annadanam') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Annadanam</span>
            </div>
            {pathname.startsWith('/admin/annadanam') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Payments (Parent + Sub-items) */}
          <div className="space-y-0.5">
            <button
              onClick={() => setPaymentsExpanded(!paymentsExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname.startsWith('/admin/payments')
                  ? 'text-gold-lighter bg-gold/10 border border-gold/30 font-bold'
                  : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gold/70" />
                <span>Payments</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gold/60 transition-transform ${
                  paymentsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {paymentsExpanded && (
              <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-gold/20 ml-5 my-0.5">
                <Link
                  href="/admin/payments"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/payments')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>Transactions</span>
                </Link>
                <Link
                  href="/admin/payments/refunds"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/payments/refunds')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>Refunds</span>
                </Link>
              </div>
            )}
          </div>

          {/* Gallery */}
          <Link
            href="/admin/gallery"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/gallery')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className={`w-4 h-4 ${pathname.startsWith('/admin/gallery') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Gallery</span>
            </div>
            {pathname.startsWith('/admin/gallery') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Live */}
          <Link
            href="/admin/live"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/live')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className={`w-4 h-4 ${pathname.startsWith('/admin/live') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Live</span>
            </div>
            {pathname.startsWith('/admin/live') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Sponsors */}
          <Link
            href="/admin/sponsors"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/sponsors')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy className={`w-4 h-4 ${pathname.startsWith('/admin/sponsors') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Sponsors</span>
            </div>
            {pathname.startsWith('/admin/sponsors') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* FAQ */}
          <Link
            href="/admin/faq"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/faq')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className={`w-4 h-4 ${pathname.startsWith('/admin/faq') ? 'text-gold' : 'text-gold/60'}`} />
              <span>FAQ</span>
            </div>
            {pathname.startsWith('/admin/faq') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Content */}
          <Link
            href="/admin/content"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/content')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-4 h-4 ${pathname.startsWith('/admin/content') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Content</span>
            </div>
            {pathname.startsWith('/admin/content') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Reports */}
          <Link
            href="/admin/reports"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/reports')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-4 h-4 ${pathname.startsWith('/admin/reports') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Reports</span>
            </div>
            {pathname.startsWith('/admin/reports') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Enquiries */}
          <Link
            href="/admin/enquiries"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/enquiries')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className={`w-4 h-4 ${pathname.startsWith('/admin/enquiries') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Enquiries</span>
            </div>
            {pathname.startsWith('/admin/enquiries') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Notifications */}
          <Link
            href="/admin/notifications"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/notifications')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className={`w-4 h-4 ${pathname.startsWith('/admin/notifications') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Notifications</span>
            </div>
            {pathname.startsWith('/admin/notifications') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/settings')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${pathname.startsWith('/admin/settings') ? 'text-gold' : 'text-gold/60'}`} />
              <span>Settings</span>
            </div>
            {pathname.startsWith('/admin/settings') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          <div className="pt-3 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-gold/50 font-cinzel">
            Quick Actions
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-ivory/70 hover:text-gold-light hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-gold/60" />
              <span>View Public Website</span>
            </div>
          </Link>
        </div>

        {/* User Profile Card & Logout (NO ROLES) */}
        <div className="p-3 border-t border-gold/25 bg-black/30">
          <div className="p-2.5 rounded-xl bg-burgundy/60 border border-gold/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ivory truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gold/70 truncate">{user?.email || 'admin@srikariatirudram.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-950/50 border border-rose-500/30 transition-all shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
