'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/lib/auth';
import { seedAdmin } from '@/lib/seedAdmin';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [pending,  setPending]  = useState(false);
  const [seeded,   setSeeded]   = useState(false);

  // Kalau sudah login, redirect sesuai role
  useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') router.replace('/admin');
      else router.replace('/');
    }
  }, [user, role, loading, router]);

  // Seed admin sekali saja saat halaman dimuat
  useEffect(() => {
    if (!seeded) {
      setSeeded(true);
      seedAdmin().catch(() => {});
    }
  }, [seeded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPending(true);

    try {
      const cred    = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await getUserRole(cred.user.uid);

      if (userRole === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Email atau password salah.');
      } else if (code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else if (code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setPending(false);
    }
  };

  // Jangan tampilkan form jika masih loading atau sudah login
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background decorations */}
      <div className={styles.bgGlow1} aria-hidden />
      <div className={styles.bgGlow2} aria-hidden />
      <div className={styles.bgGrid}  aria-hidden />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>PALUGADA</span>
        </div>
        <p className={styles.logoSub}>Katalog UMKM Banjarsari</p>

        <h1 className={styles.title}>Masuk ke Akun</h1>
        <p className={styles.subtitle}>
          Khusus admin &amp; pengelola platform.
        </p>

        <form id="login-form" onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="login-email" className={styles.label}>Email</label>
            <input
              id="login-email"
              type="email"
              className={`input ${styles.input}`}
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password" className={styles.label}>Password</label>
            <input
              id="login-password"
              type="password"
              className={`input ${styles.input}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div id="login-error" role="alert" className={styles.error}>
              ⚠ {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={pending}
          >
            {pending ? 'Memproses...' : 'Masuk →'}
          </button>
        </form>

        <p className={styles.backLink}>
          <a href="/" className={styles.backAnchor}>← Kembali ke Beranda</a>
        </p>
      </div>
    </div>
  );
}
