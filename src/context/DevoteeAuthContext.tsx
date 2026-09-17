'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DevoteeSession {
  phone: string;
  fullName?: string;
  gotram?: string;
  nakshatra?: string;
  email?: string;
  rasi?: string;
  address?: string;
  city?: string;
}

interface DevoteeAuthContextType {
  session: DevoteeSession | null;
  isLoading: boolean;
  login: (phone: string, extra?: Partial<DevoteeSession>) => void;
  logout: () => void;
  updateSession: (extra: Partial<DevoteeSession>) => void;
}

const DevoteeAuthContext = createContext<DevoteeAuthContextType>({
  session: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateSession: () => {},
});

const SESSION_STORAGE_KEY = 'srikari_devotee_session';

export function DevoteeAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DevoteeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.phone) {
          setSession(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse devotee session from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (phone: string, extra?: Partial<DevoteeSession>) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const newSession: DevoteeSession = {
      phone: cleanPhone,
      ...(extra || {}),
    };
    setSession(newSession);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch (e) {
      console.warn('Failed to save devotee session', e);
    }
  };

  const logout = () => {
    setSession(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear devotee session', e);
    }
  };

  const updateSession = (extra: Partial<DevoteeSession>) => {
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...extra };
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <DevoteeAuthContext.Provider value={{ session, isLoading, login, logout, updateSession }}>
      {children}
    </DevoteeAuthContext.Provider>
  );
}

export function useDevoteeAuth() {
  return useContext(DevoteeAuthContext);
}
