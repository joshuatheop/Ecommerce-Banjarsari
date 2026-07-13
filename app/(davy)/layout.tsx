import React from 'react';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function DavyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="davy-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-root">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}