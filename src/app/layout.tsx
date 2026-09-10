import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Srikari Ati Rudram | 28-Day Mahayagnam',
  description: 'Lokakalyanahita Nakshatra Shanthi Sahita Srikari Ati Rudra Mahayagnam with 14,641 Sri Rudra Trishathi Japas.',
  icons: {
    icon: [
      { url: '/assets/icons/FAVICON.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/assets/icons/FAVICON.svg',
    apple: '/assets/icons/FAVICON.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
