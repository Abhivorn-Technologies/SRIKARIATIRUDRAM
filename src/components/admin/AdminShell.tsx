'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { adminAuth, AdminUser } from '@/lib/adminAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { ToastProvider } from '@/components/ui/Toast';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const storedUser = adminAuth.getStoredUser();
    setUser(storedUser);
    setIsLoading(false);

    if (!storedUser && !isLoginPage) {
      router.replace('/admin/login');
    } else if (storedUser && isLoginPage) {
      router.replace('/admin');
    }
  }, [pathname, isLoginPage, router]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  // If on login page, just render the login page without the admin sidebar/topbar
  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  // Loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#180004] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-xs text-gold font-cinzel tracking-widest uppercase">
            Loading Srikari Admin...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, render loading before redirecting
  if (!user) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#180004] text-ivory flex">
        {/* Sidebar */}
        <AdminSidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-60'}`}>
          <AdminTopNav
            user={user}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

