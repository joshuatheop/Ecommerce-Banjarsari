import Link from 'next/link';
import { Icons } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Brand Column */}
          <div className="footer-brand">
            <h3>PALUGADA</h3>
            <p>
              Platform katalog digital UMKM Kelurahan Banjarsari. Menghubungkan warga, 
              memajukan ekonomi lokal, satu transaksi pada satu waktu.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid', placeItems: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all 0.15s',
                }}
              >
                <Icons.Instagram />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid', placeItems: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all 0.15s',
                }}
              >
                <Icons.Whatsapp />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 16 }}>
              Jelajahi
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Semua Produk', href: '/katalog?type=product' },
                { label: 'Layanan Jasa', href: '/katalog?type=service' },
                { label: 'Makanan & Minuman', href: '/katalog?type=product&category=makanan' },
                { label: 'Kerajinan Tangan', href: '/katalog?type=product&category=kerajinan' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, transition: 'color 0.15s' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: 16 }}>
              Informasi
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Tentang Kami', href: '#' },
                { label: 'Daftarkan UMKM', href: '#' },
                { label: 'Kebijakan Privasi', href: '#' },
                { label: 'Hubungi Kami', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, transition: 'color 0.15s' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            © {year} PALUGADA · Kelurahan Banjarsari
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            <Icons.MapPin />
            Banjarsari, Jawa Tengah
          </div>
        </div>
      </div>
    </footer>
  );
}
