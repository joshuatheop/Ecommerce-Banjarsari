import styles from './dashboard.module.css';

/* Dashboard kosong — siap dikembangkan */
export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.dateLabel}>{today}</p>
          <h1 className={styles.title}>Dashboard Admin</h1>
        </div>
      </div>

      {/* Welcome Card */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeGlow} aria-hidden />
        <span className={styles.welcomeEyebrow}>Selamat datang kembali</span>
        <h2 className={styles.welcomeTitle}>
          Halo, Admin PALUGADA 👋
        </h2>
        <p className={styles.welcomeDesc}>
          Dashboard ini akan menampilkan statistik, manajemen produk, toko, dan
          kategori UMKM Banjarsari. Fitur sedang dalam pengembangan.
        </p>
      </div>

      {/* Stat Cards Placeholder */}
      <div className={styles.statGrid}>
        {[
          { label: 'Total Produk',   value: '—', icon: '⊞', color: 'green' },
          { label: 'Total Toko',     value: '—', icon: '⊟', color: 'aqua'  },
          { label: 'Kategori',       value: '—', icon: '⊜', color: 'accent' },
          { label: 'Pengguna Aktif', value: '—', icon: '◉', color: 'dark'  },
        ].map((s) => (
          <div key={s.label} className={`${styles.statCard} ${styles[`stat_${s.color}`]}`}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={styles.statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <div className={styles.comingSoon}>
        <span className={styles.comingIcon}>🚧</span>
        <p className={styles.comingText}>
          Konten dashboard sedang dibangun.
          <br />
          Fitur berikutnya akan ditambahkan sesuai PBI.
        </p>
      </div>
    </div>
  );
}
