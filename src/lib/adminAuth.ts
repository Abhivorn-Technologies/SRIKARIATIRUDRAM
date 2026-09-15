'use client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  lastActiveAt?: number;
}

const ADMIN_STORAGE_KEY = 'srikari_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export const adminAuth = {
  getStoredUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return null;
      const user: AdminUser = JSON.parse(stored);

      // Check if session has expired (30 minutes of inactivity / session duration)
      if (user.lastActiveAt && Date.now() - user.lastActiveAt > SESSION_DURATION_MS) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      return null;
    }
  },

  login(user: Omit<AdminUser, 'lastActiveAt'>) {
    if (typeof window === 'undefined') return;
    const sessionUser: AdminUser = {
      ...user,
      lastActiveAt: Date.now(),
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionUser));
    // Set 30 minute cookie (1800 seconds)
    document.cookie = `${ADMIN_STORAGE_KEY}=${user.email}; path=/; max-age=1800; SameSite=Lax`;
  },

  touchSession() {
    if (typeof window === 'undefined') return;
    const user = this.getStoredUser();
    if (user) {
      user.lastActiveAt = Date.now();
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    }
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

