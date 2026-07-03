import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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
        <div className="app-root">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
