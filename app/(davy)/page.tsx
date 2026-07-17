import Link from "next/link";
import { getProducts, getServices, getBusinesses } from "@/lib/firestore/data-loader";
import ProductCard from "@/components/shared/ProductCard";
import ServiceCard from "@/components/shared/ServiceCard";
import RankRow from "@/components/shared/RankRow";
import { Icons } from "@/components/shared/Icons";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const [rawProducts, rawServices, rawBusinesses] = await Promise.all([
    getProducts(),
    getServices(),
    getBusinesses(),
  ]);

  // Guard: ensure arrays even if Firebase returns undefined unexpectedly
  const products = rawProducts ?? [];
  const services = rawServices ?? [];
  const businesses = rawBusinesses ?? [];

  // Map business ID to Name for quick lookups
  const businessMap = new Map(businesses.map((b) => [b.id, b.name]));
  const getBusinessName = (id: string) => businessMap.get(id) || "UMKM Banjarsari";

  // Featured items (default first items)
  const featuredProducts = products.slice(0, 4);
  const featuredServices = services.slice(0, 4);

  // Sort and slice top items by views (PBI-05 and PBI-06)
  const topProducts = [...products]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 4);

  const topServices = [...services]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 4);

  // Quick categories
  const quickCategories = [
    { name: "Makanan & Minuman", icon: "🍚", slug: "makanan", type: "product" },
    { name: "Kerajinan Tangan", icon: "🧺", slug: "kerajinan", type: "product" },
    { name: "Camilan", icon: "🥨", slug: "camilan", type: "product" },
    { name: "Jasa Reparasi", icon: "🔧", slug: "reparasi-elektronik", type: "service" },
    { name: "Kecantikan", icon: "💇", slug: "kecantikan", type: "service" },
  ];

  return (
    <main>
      {/* HERO SECTION */}
      <section style={{ paddingTop: 64, paddingBottom: 72, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, var(--white) 0%, var(--surface-2) 100%)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }} className="hero-grid">
            <div>
              <div className="label-eyebrow" style={{ marginBottom: 16 }}>
                Katalog Warga Kelurahan Banjarsari
              </div>
              <h1 className="display" style={{
                fontSize: "clamp(36px, 5vw, 56px)", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em",
                color: "var(--primary)"
              }}>
                Apa lu mau, <span style={{ color: "var(--primary)", borderBottom: "3px solid var(--secondary)" }}>tetangga ada.</span>
              </h1>
              <p style={{ fontSize: 18, color: "var(--dark)", opacity: 0.8, maxWidth: 540, lineHeight: 1.6, margin: "0 0 32px" }}>
                Temukan {products.length + services.length} produk unggulan dan layanan jasa terpercaya dari {businesses.length} pelaku UMKM mandiri di lingkungan Kelurahan Banjarsari. Belanja dekat, hemat ongkir, majukan tetangga.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/katalog?type=product" className="btn btn-primary btn-lg">
                  Jelajahi Produk UMKM <Icons.ArrowRight />
                </Link>
                <Link href="/katalog?type=service" className="btn btn-secondary btn-lg">
                  Cari Layanan Jasa
                </Link>
              </div>

              {/* STATS */}
              <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>{businesses.length}</div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>UMKM Aktif</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>{products.length}</div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>Produk Warga</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>{services.length}</div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>Layanan Jasa</div>
                </div>
              </div>
            </div>

            {/* Decorative Card Collage */}
            <div style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "4/5", borderRadius: "var(--radius-xl)", overflow: "hidden",
                background: "var(--primary)", position: "relative",
                boxShadow: "var(--shadow-lg)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 32
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: `repeating-linear-gradient(135deg, transparent 0 28px, rgba(255,255,255,0.03) 28px 56px)`,
                }}></div>
                <div style={{
                  position: "absolute", top: 24, left: 24, right: 24,
                  fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--secondary)",
                  letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", justifyContent: "space-between",
                }}>
                  <span>★ KARYA WARGA</span>
                  <span>Banjarsari ’26</span>
                </div>

                <h3 className="display" style={{ color: "var(--white)", fontSize: 22, fontStyle: "italic", fontWeight: 500, lineHeight: 1.2, margin: 0 }}>
                  Menghubungkan UMKM dan mempermudah transaksi tetangga
                </h3>
              </div>

              {/* Floating trending item card */}
              <div style={{
                position: "absolute", right: -16, bottom: 100, width: 260,
                background: "var(--surface)", borderRadius: 14, padding: 18,
                boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)",
              }}>
                <div className="label-eyebrow" style={{ marginBottom: 6, color: "var(--primary)" }}>Terpopuler Hari Ini</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--dark)" }}>Batik Sari Asih</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>
                    Kain Motif Tulis
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                    <Icons.Flame style={{ color: "var(--accent-y)" }} /> 487 klik
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SECTION */}
      <section className="section-tight" style={{ borderBottom: "1px solid var(--line)", background: "var(--white)" }}>
        <div className="container">
          <div className="label-eyebrow" style={{ marginBottom: 16 }}>Kategori Pilihan</div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {quickCategories.map((c) => (
              <Link
                key={c.name}
                href={`/katalog?type=${c.type}&category=${c.slug}`}
                style={{
                  background: "var(--surface)", border: "1px solid var(--line)",
                  borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                  minWidth: 240, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s"
                }}
                className="card"
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "var(--surface-2)",
                  display: "grid", placeItems: "center", fontSize: 22,
                }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--primary)" }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--primary)", opacity: 0.6, marginTop: 2 }}>
                    Jelajahi &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PBI-05 & PBI-06: SECTION MOST FAVORITE (Yang lagi naik) */}
      <section className="section fl-fav-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Paling Sering Dilihat Warga</h2>
              <p>Produk dan layanan jasa yang paling populer diakses warga Banjarsari.</p>
            </div>
          </div>
          
          <div className="fl-fav-grid">
            {/* Column 1: Product Rankings (PBI-05) */}
            <div className="fl-fav-col">
              <div className="fl-fav-col-header product">
                ★ Terpopuler · Produk
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.from({ length: 4 }).map((_, index) => {
                  const product = topProducts[index];
                  if (product) {
                    return (
                      <RankRow
                        key={product.id}
                        rank={index + 1}
                        item={product}
                        type="product"
                        businessName={getBusinessName(product.businessId)}
                      />
                    );
                  }
                  return (
                    <a
                      key={`promo-p-${index}`}
                      href="https://wa.me/628123456789?text=Halo%20Karang%20Taruna%20Banjarsari,%20saya%20ingin%20mendaftarkan%20produk%20UMKM%20saya%20ke%20katalog..."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fl-rank-row promo-card"
                    >
                      <div className="fl-rank-num promo-plus">+</div>
                      <div className="fl-rank-thumb">
                        <div className="fl-rank-placeholder">
                          <span>📦</span>
                        </div>
                      </div>
                      <div className="fl-rank-info">
                        <h4 className="fl-rank-title">Punya Produk UMKM?</h4>
                        <p className="fl-rank-business">Daftarkan gratis lewat Karang Taruna</p>
                      </div>
                      <div className="fl-rank-stats">
                        <div className="fl-rank-clicks promo-label">Daftar</div>
                        <div className="fl-rank-label">WA</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Service Rankings (PBI-06) */}
            <div className="fl-fav-col">
              <div className="fl-fav-col-header service">
                ★ Terpopuler · Jasa
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.from({ length: 4 }).map((_, index) => {
                  const service = topServices[index];
                  if (service) {
                    return (
                      <RankRow
                        key={service.id}
                        rank={index + 1}
                        item={service}
                        type="service"
                        businessName={getBusinessName(service.businessId)}
                      />
                    );
                  }
                  return (
                    <a
                      key={`promo-s-${index}`}
                      href="https://wa.me/628123456789?text=Halo%20Karang%20Taruna%20Banjarsari,%20saya%20ingin%20mendaftarkan%20layanan%20jasa%20saya%20ke%20katalog..."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fl-rank-row promo-card"
                    >
                      <div className="fl-rank-num promo-plus">+</div>
                      <div className="fl-rank-thumb">
                        <div className="fl-rank-placeholder">
                          <span>🔧</span>
                        </div>
                      </div>
                      <div className="fl-rank-info">
                        <h4 className="fl-rank-title">Punya Layanan Jasa?</h4>
                        <p className="fl-rank-business">Promosikan keahlian Anda di sini</p>
                      </div>
                      <div className="fl-rank-stats">
                        <div className="fl-rank-clicks promo-label">Daftar</div>
                        <div className="fl-rank-label">WA</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PBI-01: SECTION PRODUK UMKM */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Produk Unggulan UMKM</h2>
              <p>Mulai dari kuliner lezat hingga kerajinan seni tradisional karya warga Banjarsari.</p>
            </div>
            <Link href="/katalog?type=product" className="more">
              Lihat Semua Produk <Icons.ArrowRight />
            </Link>
          </div>

          <div className="grid grid-products">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                businessName={getBusinessName(product.businessId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PBI-02: SECTION LAYANAN JASA */}
      <section className="section" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Layanan Jasa Warga</h2>
              <p>Temukan penyedia jasa terpercaya untuk membantu kebutuhan teknis dan harian Anda.</p>
            </div>
            <Link href="/katalog?type=service" className="more">
              Lihat Semua Layanan Jasa <Icons.ArrowRight />
            </Link>
          </div>

          <div className="grid grid-products">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                businessName={getBusinessName(service.businessId)}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 880px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </main>
  );
}
