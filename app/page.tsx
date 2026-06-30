import styles from './page.module.css';

/* ============================================================
   Homepage — PALUGADA Katalog UMKM Banjarsari
   ============================================================ */

const CATEGORIES = [
  { icon: '🍚', name: 'Makanan & Minuman', count: 22 },
  { icon: '🧺', name: 'Kerajinan Tangan',  count: 14 },
  { icon: '🥨', name: 'Camilan',            count: 8  },
  { icon: '🔧', name: 'Jasa Reparasi',      count: 6  },
  { icon: '💇', name: 'Kecantikan',         count: 5  },
  { icon: '🛠️', name: 'Konstruksi',         count: 3  },
  { icon: '🧴', name: 'Rumah Tangga',       count: 7  },
];

const STATS = [
  { value: '48',  label: 'UMKM Aktif'  },
  { value: '120', label: 'Produk'      },
  { value: '36',  label: 'Jasa'        },
  { value: '4',   label: 'Dusun'       },
];

export default function HomePage() {
  return (
    <div className={styles.root}>
      {/* ===== NAVBAR ===== */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <div className={styles.brand}>
            <span className={styles.brandDot} />
            PALUGADA
          </div>
          <div className={styles.navLinks}>
            <a href="#katalog">Katalog</a>
            <a href="#kategori">Kategori</a>
            <a href="#tentang">Tentang</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>● Live · Banjarsari 2026</span>
          <h1 className={styles.heroTitle}>
            Belanja dari&nbsp;
            <em className={styles.heroAccent}>tetangga.</em>
            <br />
            Bayar yang&nbsp;
            <em className={styles.heroAccent}>kenal.</em>
          </h1>
          <p className={styles.heroSub}>
            Satu katalog untuk semua produk &amp; jasa warga Banjarsari.
            Dikurasi langsung oleh tim Karang Taruna.
          </p>
          <div className={styles.heroActions}>
            <a href="#katalog" className="btn btn-primary btn-lg">
              Jelajahi Produk
            </a>
            <a href="#kategori" className="btn btn-secondary btn-lg">
              Lihat Kategori
            </a>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grid pattern */}
        <div className={styles.heroGrid} aria-hidden />
      </section>

      {/* ===== KATEGORI ===== */}
      <section id="kategori" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Kategori Pilihan</span>
            <h2 className={styles.sectionTitle}>Apa yang kamu cari?</h2>
          </div>
          <div className={styles.categoryScroll}>
            {CATEGORIES.map((c) => (
              <button key={c.name} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{c.icon}</span>
                <span className={styles.categoryName}>{c.name}</span>
                <span className={styles.categoryCount}>{c.count} item</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN ===== */}
      <section id="katalog" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Produk UMKM</span>
              <h2 className={styles.sectionTitle}>Yang Baru di Banjarsari</h2>
            </div>
            <a href="#" className={styles.seeAll}>Lihat semua →</a>
          </div>
          {/* Product grid — placeholder */}
          <div className={styles.productGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.productCard}>
                <div className={styles.productThumb}>
                  <span className={styles.productPlaceholder}>Foto Produk</span>
                </div>
                <div className={styles.productBody}>
                  <span className={styles.productCat}>Makanan</span>
                  <h3 className={styles.productName}>Produk UMKM {i + 1}</h3>
                  <p className={styles.productOwner}>Toko Banjarsari</p>
                  <span className={styles.productPrice}>Rp 25.000</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBand}>
            <div className={styles.ctaGlow} />
            <div className={styles.ctaText}>
              <span className={styles.ctaEyebrow}>Untuk Pemilik Usaha</span>
              <h3 className={styles.ctaTitle}>
                Punya usaha di Banjarsari?<br />Daftarkan gratis.
              </h3>
              <p className={styles.ctaSub}>
                Tim Karang Taruna akan membantu fotokan produk, mengisi deskripsi,
                dan menandai lokasi di peta.
              </p>
            </div>
            <div className={styles.ctaAction}>
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                📲 Daftar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <span className={styles.brandDot} />
                PALUGADA
              </div>
              <p className={styles.footerDesc}>
                Katalog UMKM &amp; Jasa Warga<br />Kelurahan Banjarsari
              </p>
            </div>
            <div>
              <h5 className={styles.footerHeading}>Tautan</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#katalog">Katalog</a></li>
                <li><a href="#kategori">Kategori</a></li>
                <li><a href="#tentang">Tentang</a></li>
              </ul>
            </div>
            <div>
              <h5 className={styles.footerHeading}>Kontak</h5>
              <ul className={styles.footerLinks}>
                <li>Karang Taruna Banjarsari</li>
                <li>Kec. Banjarsari, Kab. Ciamis</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 PALUGADA · Banjarsari</span>
            <span>Dibuat dengan ❤ oleh Karang Taruna</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
