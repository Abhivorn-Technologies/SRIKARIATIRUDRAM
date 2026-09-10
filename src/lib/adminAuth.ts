'use client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

const ADMIN_STORAGE_KEY = 'srikari_admin_session';

export const adminAuth = {
  getStoredUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  login(user: AdminUser) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    // Also set cookie for server/middleware compatibility
    document.cookie = `${ADMIN_STORAGE_KEY}=${user.email}; path=/; max-age=86400; SameSite=Lax`;
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    document.cookie = `${ADMIN_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  },
};
