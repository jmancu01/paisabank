'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Simple check for auth vs non-auth pages
  const isAppView = !['/', '/login', '/signup'].includes(pathname);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>PaisBank</title>
        <meta
          name="description"
          content="PaisBank - Comienza a manejar tu vida financiera"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body
        className={`${inter.variable} antialiased ${isAppView ? 'bg-slate-100' : 'bg-white'}`}
      >
        <div
          className={`min-h-screen ${isAppView ? 'max-w-md mx-auto  bg-gray-50 shadow-lg' : ''}`}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
