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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AdminUser, adminAuth } from '@/lib/adminAuth';

interface AdminSidebarProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  user,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // State for collapsible sub-menus
  const [masterOpsExpanded, setMasterOpsExpanded] = useState(true);
  const [scheduleExpanded, setScheduleExpanded] = useState(true);
  const [sevasExpanded, setSevasExpanded] = useState(true);
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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-gradient-to-b from-burgundy-dark via-burgundy-deep to-[#180004] border-r border-gold/30 shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-60'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-gold/25 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 group overflow-hidden">
            {!isCollapsed ? (
              <>
                <Image
                  src="/assets/icons/SRIKARIATI RUDRAM.svg"
                  alt="Srikari Ati Rudram"
                  width={140}
                  height={36}
                  className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <span className="text-[10px] font-cinzel uppercase font-black tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/40">
                  ADMIN
                </span>
              </>
            ) : (
              <span className="text-xs font-cinzel font-black text-gold px-2 py-1 rounded bg-gold/15 border border-gold/40">
                SAR
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Arrow Button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-gold hover:bg-gold/20 border border-gold/40 transition-colors"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-ivory/70 hover:text-gold hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
              {!isCollapsed && <span>Dashboard Hub</span>}
            </div>
            {!isCollapsed && isExactActive('/admin') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* MASTER CATEGORY DROPDOWN: 5 Core Operations */}
          {(() => {
            const isCoreOpsActive =
              pathname.startsWith('/admin/bookings') ||
              pathname.startsWith('/admin/special-sevas-bookings') ||
              pathname.startsWith('/admin/donations') ||
              pathname.startsWith('/admin/annadanam') ||
              pathname.startsWith('/admin/enquiries');

            return (
              <div className="space-y-0.5 pt-1">
                <button
                  onClick={() => setMasterOpsExpanded(!masterOpsExpanded)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isCoreOpsActive
                      ? 'bg-gold/20 border border-gold/40 text-gold-lighter font-bold'
                      : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className={`w-4 h-4 ${isCoreOpsActive ? 'text-gold' : 'text-gold/60'}`} />
                    {!isCollapsed && <span>All Core Operations (5)</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gold/70 transition-transform ${
                        masterOpsExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {masterOpsExpanded && !isCollapsed && (
                  <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-gold/40 ml-4 my-1 bg-[#1A0004]/60 rounded-r-xl p-1.5">
                    {/* 1. 28-Day Seva Bookings */}
                    <Link
                      href="/admin/bookings"
                      onClick={onClose}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isExactActive('/admin/bookings')
                          ? 'bg-gold/25 text-gold-lighter font-bold border border-gold/40'
                          : 'text-ivory/80 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gold/80" />
                        <span>1. 28-Day Seva Bookings</span>
                      </div>
                    </Link>

                    {/* 2. Special Sevas Bookings */}
                    <Link
                      href="/admin/special-sevas-bookings"
                      onClick={onClose}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isExactActive('/admin/special-sevas-bookings')
                          ? 'bg-gold/25 text-gold-lighter font-bold border border-gold/40'
                          : 'text-ivory/80 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>2. Special Sevas Bookings</span>
                      </div>
                    </Link>

                    {/* 3. General Donations */}
                    <Link
                      href="/admin/donations"
                      onClick={onClose}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isExactActive('/admin/donations')
                          ? 'bg-gold/25 text-gold-lighter font-bold border border-gold/40'
                          : 'text-ivory/80 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 text-rose-400" />
                        <span>3. General Donations</span>
                      </div>
                    </Link>

                    {/* 4. Annadanam Meals */}
                    <Link
                      href="/admin/annadanam"
                      onClick={onClose}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isExactActive('/admin/annadanam')
                          ? 'bg-gold/25 text-gold-lighter font-bold border border-gold/40'
                          : 'text-ivory/80 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                        <span>4. Annadanam Meals</span>
                      </div>
                    </Link>

                    {/* 5. Contact Enquiries */}
                    <Link
                      href="/admin/enquiries"
                      onClick={onClose}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isExactActive('/admin/enquiries')
                          ? 'bg-gold/25 text-gold-lighter font-bold border border-gold/40'
                          : 'text-ivory/80 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>5. Contact Enquiries</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Standalone Master Catalog Link: Special Sevas Catalog */}
          <Link
            href="/admin/sevas"
            onClick={onClose}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              isExactActive('/admin/sevas')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold shadow-gold-sm'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              {!isCollapsed && <span>Special Sevas Catalog</span>}
            </div>
            {!isCollapsed && isExactActive('/admin/sevas') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Schedule (Parent + Sub-items) */}
          <div className="space-y-0.5 pt-1">
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
                <span>Schedule & Rituals</span>
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
                  <span>28-Day Programme & Seva Desk</span>
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
                  href="/admin/sankalpam"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/sankalpam')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span className="text-gold font-bold">Priest Sankalpam Register</span>
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

          {/* Devotees CRM */}
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
              <span>Devotees Database</span>
            </div>
            {pathname.startsWith('/admin/devotees') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Gallery Media */}
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
              <span>Gallery & Photos</span>
            </div>
            {pathname.startsWith('/admin/gallery') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {/* Live Broadcast */}
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
              <span>Live Broadcast</span>
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
              <span>Mahayagnam Sponsors</span>
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
              <span>FAQ Management</span>
            </div>
            {pathname.startsWith('/admin/faq') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
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
                {!isCollapsed && <span>Payments & Refunds</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gold/60 transition-transform ${
                    paymentsExpanded ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {paymentsExpanded && (
              <div className={`py-1 space-y-0.5 my-0.5 ${isCollapsed ? '' : 'pl-6 pr-1 border-l border-gold/20 ml-5'}`}>
                <Link
                  href="/admin/payments"
                  onClick={onClose}
                  title="Transactions"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/payments')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>{!isCollapsed ? 'Transactions' : 'Txns'}</span>
                </Link>
                <Link
                  href="/admin/payments/refunds"
                  onClick={onClose}
                  title="Refunds"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isExactActive('/admin/payments/refunds')
                      ? 'bg-gold/20 text-gold-lighter font-bold border border-gold/40'
                      : 'text-ivory/70 hover:text-gold hover:bg-white/5'
                  }`}
                >
                  <span>{!isCollapsed ? 'Refunds' : 'Ref'}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link
            href="/admin/settings"
            onClick={onClose}
            title="Settings"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              pathname.startsWith('/admin/settings')
                ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold-lighter border border-gold/50 font-bold'
                : 'text-ivory/80 hover:text-gold-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${pathname.startsWith('/admin/settings') ? 'text-gold' : 'text-gold/60'}`} />
              {!isCollapsed && <span>System Settings</span>}
            </div>
            {!isCollapsed && pathname.startsWith('/admin/settings') && <ChevronRight className="w-3.5 h-3.5 text-gold" />}
          </Link>

          {!isCollapsed && (
            <div className="pt-3 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-gold/50 font-cinzel">
              Quick Actions
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            title="View Public Website"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-ivory/70 hover:text-gold-light hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-gold/60" />
              {!isCollapsed && <span>View Public Website</span>}
            </div>
          </Link>
        </div>
      </aside>

    </>
  );
}
