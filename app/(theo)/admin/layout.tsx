'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router           = useRouter();
  const { user, role, loading, logout } = useAuth();

  // Guard: redirect jika bukan admin
  useEffect(() => {
    if (!loading) {
      if (!user)            router.replace('/login');
      else if (role !== 'admin') router.replace('/');
    }
  }, [user, role, loading, router]);

  if (loading || !user || role !== 'admin') {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}>
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
        </div>
        <p className={styles.loadingText}>Memeriksa akses...</p>
      </div>
    );
  }

  const NAV_ITEMS = [
    { href: '/admin',          icon: '◈', label: 'Dashboard'  },
    { href: '/admin/produk',   icon: '⊞', label: 'Produk'     },
    { href: '/admin/jasa',     icon: '⚙', label: 'Jasa'       },
    { href: '/admin/umkm',     icon: '⊟', label: 'UMKM/Penyedia Jasa' },
    { href: '/admin/kategori', icon: '⊜', label: 'Kategori'   },
    { href: '/',               icon: '⌂', label: 'Laman User' },
  ];

  return (
    <div className={styles.shell}>
      {/* ===== SIDEBAR ===== */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.brandDot} />
            <span className={styles.brandText}>PALUGADA</span>
          </div>
          <p className={styles.brandSub}>Admin Panel</p>

          {/* Nav */}
          <nav className={styles.nav} aria-label="Admin navigation">
            <span className={styles.navSection}>Menu</span>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.navItem}
                id={`admin-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* User info + logout */}
        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>Admin</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={() => { logout(); router.replace('/'); }}
            className={styles.logoutBtn}
          >
            Keluar ↗
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
