"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark"></span>
            <span>
              PALUGADA
              <small>Katalog Banjarsari</small>
            </span>
          </Link>

          <nav className="header-nav">
            <Link 
              href="/" 
              className={pathname === "/" ? "active" : ""}
            >
              Beranda
            </Link>
            <Link 
              href="/katalog" 
              className={pathname.startsWith("/katalog") ? "active" : ""}
            >
              Katalog
            </Link>
            <Link 
              href="/admin" 
              className={`btn btn-secondary btn-sm ${pathname.startsWith("/admin") ? "active" : ""}`}
              style={{ padding: "6px 12px", border: "1px solid var(--line)" }}
            >
              Admin Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
