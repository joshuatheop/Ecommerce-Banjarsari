import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://palugada.banjarsarigarut.id';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PALUGADA — Katalog UMKM & Jasa Banjarsari',
    template: '%s | PALUGADA Banjarsari',
  },
  description:
    'Platform katalog digital untuk UMKM dan pelaku jasa di Kelurahan Banjarsari. Temukan produk lokal, jasa warga, dan dukung ekonomi tetangga.',
  openGraph: {
    title: 'PALUGADA — Katalog UMKM & Jasa Banjarsari',
    description:
      'Platform katalog digital untuk UMKM dan pelaku jasa di Kelurahan Banjarsari. Temukan produk lokal, jasa warga, dan dukung ekonomi tetangga.',
    url: BASE_URL,
    siteName: 'PALUGADA Banjarsari',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/logo-banjarsari.png`,
        width: 800,
        height: 600,
        alt: 'PALUGADA — Katalog UMKM & Jasa Kelurahan Banjarsari',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PALUGADA — Katalog UMKM & Jasa Banjarsari',
    description:
      'Platform katalog digital untuk UMKM dan pelaku jasa di Kelurahan Banjarsari. Temukan produk lokal, jasa warga, dan dukung ekonomi tetangga.',
    images: [`${BASE_URL}/logo-banjarsari.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jetbrainsMono.variable} ${plusJakartaSans.variable}`}>
      <body className="theo-theme">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
