import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#35030A] text-[#FFF8E8] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-6xl font-bold text-[#C99A3D]">404</span>
          <h2 className="text-2xl font-bold font-serif">Page Not Found</h2>
          <p className="text-sm text-ivory/70">
            The auspicious page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block bg-[#C99A3D] text-[#35030A] px-6 py-2.5 rounded-lg font-bold text-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
