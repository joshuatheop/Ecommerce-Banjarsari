'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Brand */}
          <Link href="/" className="brand">
            <div className="brand-mark" />
            <div>
              PALUGADA
              <small>Banjarsari</small>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="header-nav">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              Beranda
            </Link>
            <Link href="/katalog?type=product" className={pathname.startsWith('/katalog') ? 'active' : ''}>
              Katalog
            </Link>
            <Link href="/katalog?type=service" className={''}>
              Layanan Jasa
            </Link>
          </nav>

          {/* Search */}
          <div className="search-box">
            <Icons.Search />
            <input
              type="text"
              className="input"
              placeholder="Cari produk atau layanan..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/katalog?search=${encodeURIComponent(val)}`;
                }
              }}
            />
          </div>

          {/* Auth Section */}
          {!loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {user ? (
                /* === Sudah login: avatar + dropdown === */
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    id="navbar-avatar-btn"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--secondary)',
                      cursor: 'pointer',
                      background: 'var(--surface-2)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxShadow: dropdownOpen ? '0 0 0 3px rgba(5,71,43,0.15)' : 'none',
                    }}
                    aria-label="Menu akun"
                    aria-expanded={dropdownOpen}
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName ?? 'Foto profil'}
                        width={38}
                        height={38}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      /* Fallback: inisial nama */
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 15,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                      }}>
                        {(user.displayName ?? user.email ?? 'U').charAt(0)}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      id="navbar-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: 0,
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: 200,
                        overflow: 'hidden',
                        zIndex: 100,
                        animation: 'navDropdownIn 0.15s ease',
                      }}
                    >
                      {/* Info user */}
                      <div style={{
                        padding: '14px 16px 12px',
                        borderBottom: '1px solid var(--line)',
                      }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: 'var(--dark)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {user.displayName ?? 'Pengguna'}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: 'var(--primary)',
                          opacity: 0.7,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: 2,
                        }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Opsi */}
                      <div style={{ padding: '6px 0' }}>
                        <Link
                          href="/profile"
                          id="navbar-profile-link"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 16px',
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--dark)',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icons.User style={{ width: 16, height: 16, color: 'var(--primary)', flexShrink: 0 }} />
                          Profil Saya
                        </Link>

                        <button
                          id="navbar-logout-btn"
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 16px',
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#c0392b',
                            width: '100%',
                            textAlign: 'left',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icons.LogOut style={{ width: 16, height: 16, color: '#c0392b', flexShrink: 0 }} />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* === Belum login: tombol Login + Register === */
                <>
                  <Link
                    href="/register"
                    id="navbar-register-btn"
                    className="btn btn-ghost"
                    style={{ fontSize: '15px', fontWeight: 600 }}
                  >
                    Daftar
                  </Link>
                  <Link
                    href="/login"
                    id="navbar-login-btn"
                    className="btn btn-primary"
                    style={{ fontSize: '15px', fontWeight: 600 }}
                  >
                    Masuk
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animasi dropdown */}
      <style>{`
        @keyframes navDropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
