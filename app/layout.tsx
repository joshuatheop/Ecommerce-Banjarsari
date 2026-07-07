import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PALUGADA — Katalog UMKM & Jasa Banjarsari",
  description: "Platform e-commerce & katalog digital untuk UMKM dan pelaku jasa di Kelurahan Banjarsari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
