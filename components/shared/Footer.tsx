import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>PALUGADA</h3>
            <p>
              Platform katalog digital dan marketplace warga Kelurahan Banjarsari. 
              Belanja produk tetangga, dukung ekonomi lokal.
            </p>
          </div>

          <div className="footer-links">
            <h4>Navigasi</h4>
            <ul>
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/katalog">Katalog Produk & Jasa</Link></li>
              <li><Link href="/admin">Portal Pengelola</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Hubungi Kami</h4>
            <ul>
              <li><a href="https://wa.me/#" target="_blank" rel="noopener noreferrer">WhatsApp Kantor Desa</a></li>
              <li><a href="#">Saran & Hubukan</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} PALUGADA Banjarsari. Hak cipta dilindungi.</span>
          <span>Desain Premium khas Kelurahan Banjarsari</span>
        </div>
      </div>
    </footer>
  );
}
