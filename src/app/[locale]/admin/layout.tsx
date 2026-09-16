import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Admin Control Center | Srikari Ati Rudram',
  description: 'Administrative Portal for Srikari Ati Rudra Mahayagnam',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
