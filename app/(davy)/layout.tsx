import React from 'react';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function DavyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <div className="davy-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="app-root">
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </FavoritesProvider>
  );
}