import Link from "next/link";
import { getProducts, getServices, getBusinesses, getCategories } from "@/lib/firestore/data-loader";
import ProductCard from "@/components/shared/ProductCard";
import ServiceCard from "@/components/shared/ServiceCard";
import MostFavoriteSection from "@/components/shared/MostFavoriteSection";
import RankRow from "@/components/shared/RankRow";
import { Icons } from "@/components/shared/Icons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [rawProducts, rawServices, rawBusinesses, rawCategories] = await Promise.all([
    getProducts(),
    getServices(),
    getBusinesses(),
    getCategories(),
  ]);

  // Guard: ensure arrays even if Firebase returns undefined unexpectedly
  const products = rawProducts ?? [];
  const services = rawServices ?? [];
  const businesses = rawBusinesses ?? [];
  const categories = rawCategories ?? [];

  // Map business_id to business_name for quick lookups
  const businessMap = new Map(businesses.map((b) => [b.business_id, b.business_name]));
  const getBusinessName = (id: string) => businessMap.get(id) || "UMKM Banjarsari";

  // Featured items (default first items)
  const featuredProducts = products.slice(0, 4);
  const featuredServices = services.slice(0, 4);

  // Sort and slice top items by name (PBI-05 and PBI-06)
  const topProducts = [...products]
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .slice(0, 4);

  const topServices = [...services]
    .sort((a, b) => a.service_name.localeCompare(b.service_name))
    .slice(0, 4);

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

            {/* Hero Right Column: Unified Centered Showcase */}
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{
                borderRadius: "var(--radius-xl)", overflow: "hidden",
                background: "linear-gradient(145deg, #013020 0%, #05472B 60%, #032b1b 100%)",
                position: "relative",
                boxShadow: "0 24px 50px rgba(1, 48, 32, 0.18)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
                padding: "32px 24px", textAlign: "center", minHeight: 460,
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                {/* Background ambient lighting */}
                <div style={{
                  position: "absolute", top: "-15%", right: "-10%", width: 260, height: 260,
                  background: "radial-gradient(circle, rgba(0,192,163,0.25) 0%, rgba(0,0,0,0) 70%)",
                  filter: "blur(30px)", pointerEvents: "none"
                }}></div>
                <div style={{
                  position: "absolute", bottom: "-15%", left: "-10%", width: 260, height: 260,
                  background: "radial-gradient(circle, rgba(205,255,0,0.15) 0%, rgba(0,0,0,0) 70%)",
                  filter: "blur(30px)", pointerEvents: "none"
                }}></div>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px', opacity: 0.5, pointerEvents: "none"
                }}></div>

                {/* Top Badge: Centered */}
                <div style={{
                  position: "relative", zIndex: 2, width: "100%",
                  display: "flex", justifyContent: "center", alignItems: "center", gap: 8
                }}>
                  <div style={{
                    background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(8px)",
                    borderRadius: 999, padding: "6px 16px", border: "1px solid rgba(255, 255, 255, 0.15)",
                    display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700,
                    color: "var(--secondary)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em"
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C0A3", display: "inline-block", boxShadow: "0 0 10px #00C0A3" }}></span>
                    KATALOG WARGA BANJARSARI &apos;26
                  </div>
                </div>

                {/* CENTER FEATURED CARD (Batik Sari Asih) - Centered */}
                <div style={{
                  position: "relative", zIndex: 2, width: "100%", maxWidth: 330,
                  margin: "24px 0",
                  background: "rgba(255, 255, 255, 0.96)", backdropFilter: "blur(16px)",
                  borderRadius: 20, padding: "20px 22px", textAlign: "center",
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.22)",
                  border: "1.5px solid rgba(255, 255, 255, 0.3)"
                }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      background: "rgba(5, 71, 43, 0.08)", color: "var(--primary)",
                      fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 6,
                      fontFamily: "var(--font-mono)", textTransform: "uppercase"
                    }}>
                      🔥 TERPOPULER HARI INI
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e11d48", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      ❤️ {products[0]?.like_count ?? 42}
                    </span>
                  </div>

                  <h4 style={{
                    fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 800,
                    margin: "0 0 4px", color: "var(--primary)", textAlign: "center", lineHeight: 1.2
                  }}>
                    {businesses[0]?.business_name ?? 'Batik Sari Asih'}
                  </h4>

                  <p style={{
                    fontSize: 13, color: "var(--text-secondary)", margin: "0 0 14px",
                    textAlign: "center", fontWeight: 500
                  }}>
                    {products[0]?.product_name ?? 'Kain Batik Tulis Motif Parang'}
                  </p>

                  <Link
                    href={products[0] ? `/produk/${products[0].product_id}` : '/katalog'}
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "var(--primary)", color: "var(--white)",
                      fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 10,
                      width: "100%", textDecoration: "none", boxShadow: "0 4px 12px rgba(5, 71, 43, 0.2)"
                    }}
                  >
                    Lihat Detail Produk <Icons.ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>

                {/* BOTTOM SLOGAN - Centered */}
                <div style={{
                  position: "relative", zIndex: 2, width: "100%",
                  background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(10px)",
                  borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255, 255, 255, 0.12)",
                  textAlign: "center"
                }}>
                  <h3 style={{
                    color: "var(--white)", fontSize: 15, fontWeight: 600,
                    lineHeight: 1.4, margin: 0, fontStyle: "italic"
                  }}>
                    &ldquo;Menghubungkan UMKM dan mempermudah transaksi tetangga&rdquo;
                  </h3>
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
            {categories.map((c) => {
              const catType = (c.category_type || "PRODUCT").toLowerCase() === "service" ? "service" : "product";
              return (
                <Link
                  key={c.category_id}
                  href={`/katalog?type=${catType}&category=${c.category_id}`}
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
                  }}>{c.icon || "📁"}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--primary)" }}>{c.category_name}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--primary)", opacity: 0.6, marginTop: 2 }}>
                      Jelajahi &rarr;
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PBI-05 & PBI-06: SECTION MOST FAVORITE (Yang lagi naik & disukai) */}
      <MostFavoriteSection
        products={products}
        services={services}
        businesses={businesses}
      />

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
                key={product.product_id}
                product={product}
                businessName={getBusinessName(product.business_id)}
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
                key={service.service_id}
                service={service}
                businessName={getBusinessName(service.business_id)}
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
