import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
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
  return (
    <html suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/icons/FAVICON.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/icons/FAVICON.svg" />
      </head>
      <body suppressHydrationWarning className="bg-burgundy-deep text-ivory min-h-screen flex flex-col selection:bg-gold selection:text-burgundy-deep">
        {children}
      </body>
    </html>
  );
}
