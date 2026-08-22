import Link from "next/link";
import Image from "next/image";
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

  // Hero showcase item: produk dengan klik terbanyak (most clicked product)
  const heroProduct = [...products].sort((a, b) => {
    const clicksA = a.clickCount ?? 0;
    const clicksB = b.clickCount ?? 0;
    if (clicksB !== clicksA) return clicksB - clicksA;
    const likesA = a.like_count ?? 0;
    const likesB = b.like_count ?? 0;
    if (likesB !== likesA) return likesB - likesA;
    return a.product_name.localeCompare(b.product_name);
  })[0] ?? products[0];

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
      <section style={{ paddingTop: "clamp(32px, 5vw, 64px)", paddingBottom: "clamp(40px, 6vw, 72px)", position: "relative", overflow: "hidden", background: "var(--white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }} className="hero-grid">
            <div>
              <div className="label-eyebrow" style={{ marginBottom: 16 }}>
                Katalog Warga Kelurahan Banjarsari
              </div>
              <h1 className="display" style={{
                fontSize: "clamp(28px, 5vw, 56px)", margin: "0 0 20px", lineHeight: 1.15, letterSpacing: "-0.02em",
                color: "var(--primary)"
              }}>
                Apa lu mau, <span style={{ color: "var(--primary)", borderBottom: "3px solid var(--secondary)" }}>tetangga ada.</span>
              </h1>
              <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--dark)", opacity: 0.8, maxWidth: 540, lineHeight: 1.6, margin: "0 0 32px" }}>
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

              {/* STATS: Tanpa background, rata kiri di desktop, ke tengah di mobile */}
              <div className="hero-stats" style={{
                display: "flex",
                gap: "clamp(24px, 4vw, 44px)",
                marginTop: "clamp(24px, 4vw, 40px)",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
              }}>
                <div className="hero-stat-item" style={{ minWidth: 80 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 34px)", fontWeight: 700, color: "var(--primary)", lineHeight: 1.1 }}>{businesses.length}</div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginTop: 4 }}>UMKM Aktif</div>
                </div>
                <div className="hero-stat-item" style={{ minWidth: 80 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 34px)", fontWeight: 700, color: "var(--primary)", lineHeight: 1.1 }}>{products.length}</div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginTop: 4 }}>Produk Warga</div>
                </div>
                <div className="hero-stat-item" style={{ minWidth: 80 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 34px)", fontWeight: 700, color: "var(--primary)", lineHeight: 1.1 }}>{services.length}</div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginTop: 4 }}>Layanan Jasa</div>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Full Image Cover + Floating Trending Card */}
            <div style={{ position: "relative", width: "100%" }}>
              <div className="hero-showcase-card" style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                background: "linear-gradient(135deg, #013020 0%, #05472B 60%, #032b1b 100%)",
                position: "relative",
                boxShadow: "0 24px 50px rgba(1, 48, 32, 0.22)",
                minHeight: "clamp(380px, 48vh, 480px)",
                aspectRatio: "4/5",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                {/* Full Cover Product Image if available */}
                {heroProduct?.thumbnail_url ? (
                  <Image
                    src={heroProduct.thumbnail_url}
                    alt={heroProduct.product_name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    style={{ objectFit: "cover", zIndex: 1 }}
                    priority
                  />
                ) : (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `repeating-linear-gradient(135deg, transparent 0 28px, rgba(255,252,244,0.06) 28px 56px)`,
                    zIndex: 1
                  }} />
                )}

                {/* Elegant dark overlay gradient */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(1, 30, 18, 0.95) 0%, rgba(1, 48, 32, 0.4) 45%, rgba(1, 48, 32, 0.55) 100%)",
                  zIndex: 2,
                  pointerEvents: "none"
                }} />

                {/* Top Bar Header */}
                <div style={{
                  position: "relative",
                  zIndex: 3,
                  padding: "24px 24px 0",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "rgba(255, 252, 244, 0.85)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  <span>BANJARSARI &apos;26</span>
                </div>

                {/* Bottom Content Area: Slogan/Quote & Floating Card */}
                <div className="hero-showcase-bottom" style={{
                  position: "relative",
                  zIndex: 3,
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 13,
                }}>
                  {/* Slogan on the bottom-left (sejajar dengan bagian bawah card info produk) */}
                  <div className="hero-showcase-quote" style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 2.2vw, 20px)",
                    fontWeight: 500,
                    color: "var(--white)",
                    fontStyle: "italic",
                    lineHeight: 1.25,
                    maxWidth: 280,
                    paddingBottom: 2,
                    marginBottom: 0,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}>
                    Menghubungkan UMKM dan mempermudah transaksi tetangga
                  </div>

                  {/* Floating Trending Card on the bottom-right (Sudut Kanan Card) */}
                  {heroProduct && (
                    <Link
                      href={`/produk/${heroProduct.product_id}`}
                      className="hero-floating-card"
                      style={{
                        background: "var(--surface)",
                        borderRadius: 16,
                        padding: "14px 16px",
                        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.3)",
                        border: "1px solid var(--line)",
                        minWidth: 210,
                        maxWidth: 240,
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        display: "block",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      <div className="label-eyebrow" style={{ marginBottom: 4, fontSize: 10, letterSpacing: "0.08em" }}>
                        TRENDING HARI INI
                      </div>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--primary)",
                        marginBottom: 6,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {heroProduct.product_name}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={{
                          color: "var(--primary)",
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          fontWeight: 700,
                        }}>
                          Rp {heroProduct.product_price ? heroProduct.product_price.toLocaleString("id-ID") : "22.000"}
                        </span>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          fontFamily: "var(--font-mono)",
                          color: "#e11d48",
                          fontWeight: 600,
                        }}>
                          🔥 {heroProduct.clickCount || heroProduct.like_count || 312} klik
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SECTION */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", background: "var(--white)" }}>
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
      <section className="section" style={{ background: "var(--white)" }}>
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
        .hero-floating-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(0, 0, 0, 0.35) !important;
        }
        @media (max-width: 880px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-stats {
            justify-content: center !important;
            gap: 20px 36px !important;
            margin-top: 24px !important;
          }
          .hero-stat-item {
            text-align: center !important;
          }
        }
        @media (max-width: 768px) {
          .hero-showcase-bottom {
            flex-direction: column !important;
            justify-content: flex-end !important;
            align-items: stretch !important;
            gap: 14px !important;
            padding: 16px !important;
          }
          .hero-showcase-quote {
            max-width: 100% !important;
            font-size: 18px !important;
            padding-bottom: 0 !important;
            margin-bottom: 2px !important;
          }
          .hero-floating-card {
            align-self: stretch !important;
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
