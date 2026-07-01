"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import ServiceCard from "./ServiceCard";
import { Icons } from "./Icons";
import { Product, Service, Category, Business } from "../../lib/firestore/types";

interface CatalogContainerProps {
  products: Product[];
  services: Service[];
  businesses: Business[];
  categories: Category[];
  areas: string[];
  initialType?: "product" | "service";
  initialQuery?: string;
  initialCategory?: string;
}

export default function CatalogContainer({
  products,
  services,
  businesses,
  categories,
  areas,
  initialType = "product",
  initialQuery = "",
  initialCategory = "",
}: CatalogContainerProps) {
  // State variables for search & filtering
  const [type, setType] = useState<"product" | "service">(initialType);
  const [q, setQ] = useState<string>(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all"); // 'all', 'lt50', '50-100', 'gt100'
  const [sortBy, setSortBy] = useState<string>("newest"); // 'newest', 'most_viewed'
  const [hasMarketplace, setHasMarketplace] = useState<boolean>(false);
  const [availability, setAvailability] = useState<string>("all"); // 'all', 'Setiap Hari', 'Janjian'
  const [isNegotiable, setIsNegotiable] = useState<boolean>(false);
  const [hasPortfolio, setHasPortfolio] = useState<boolean>(false);

  // Map business details for lookup
  const businessMap = useMemo(() => new Map(businesses.map((b) => [b.id, b])), [businesses]);
  const getBusiness = (id: string) => businessMap.get(id);

  // Perform filtering (PBI-03 and PBI-04)
  const filteredItems = useMemo(() => {
    let pool: Array<(Product & { _biz?: Business }) | (Service & { _biz?: Business })> = 
      type === "product" ? [...products] : [...services];
    
    // Inject business for area filtering
    pool = pool.map((item) => ({
      ...item,
      _biz: getBusiness(item.businessId),
    }));

    // PBI-03: Search query filter
    if (q.trim()) {
      const queryLower = q.toLowerCase();
      pool = pool.filter((item) => {
        const itemMatch = item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower);
        const businessMatch = item._biz?.name.toLowerCase().includes(queryLower) || false;
        const categoryMatch = item.category.toLowerCase().includes(queryLower);
        return itemMatch || businessMatch || categoryMatch;
      });
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      pool = pool.filter((item) => selectedCategories.includes(item.category.toLowerCase()));
    }

    // Area/Dusun Filter
    if (selectedAreas.length > 0) {
      pool = pool.filter((item) => item._biz?.area && selectedAreas.includes(item._biz.area));
    }

    // Price and specific filters
    if (type === "product") {
      const prodPool = pool as Product[];
      let filteredProds = prodPool;
      
      if (priceRange === "lt50") {
        filteredProds = filteredProds.filter((item) => item.price < 50000);
      } else if (priceRange === "50-100") {
        filteredProds = filteredProds.filter((item) => item.price >= 50000 && item.price <= 100000);
      } else if (priceRange === "gt100") {
        filteredProds = filteredProds.filter((item) => item.price > 100000);
      }

      if (hasMarketplace) {
        filteredProds = filteredProds.filter((item) => item.hasMarketplace);
      }
      pool = filteredProds;
    } else {
      const servPool = pool as Service[];
      let filteredServs = servPool;

      if (availability !== "all") {
        filteredServs = filteredServs.filter((item) => item.availability === availability);
      }

      if (isNegotiable) {
        filteredServs = filteredServs.filter((item) => item.isNegotiable);
      }

      if (hasPortfolio) {
        filteredServs = filteredServs.filter((item) => item.hasPortfolio);
      }
      pool = filteredServs;
    }

    // Sorting
    if (sortBy === "most_viewed") {
      pool.sort((a, b) => b.clickCount - a.clickCount);
    } else {
      // Default: newest (by mock ids or simulated latest)
      pool.sort((a, b) => b.id.localeCompare(a.id));
    }

    return pool;
  }, [type, q, selectedCategories, selectedAreas, priceRange, sortBy, hasMarketplace, availability, isNegotiable, hasPortfolio, products, services, businesses]);

  // Categories list for filtering based on selected type
  const currentCategories = useMemo(() => {
    return categories.filter((c) => c.type === type);
  }, [categories, type]);

  // Build active filters list for display & clearing
  const activeFilters = useMemo(() => {
    const filters: Array<{ id: string; label: string; clear: () => void }> = [];
    
    if (q) {
      filters.push({ id: "q", label: `Cari: "${q}"`, clear: () => setQ("") });
    }
    
    selectedCategories.forEach((catSlug) => {
      const catObj = categories.find((c) => c.slug === catSlug);
      filters.push({
        id: `cat-${catSlug}`,
        label: catObj?.name || catSlug,
        clear: () => setSelectedCategories((prev) => prev.filter((x) => x !== catSlug)),
      });
    });

    selectedAreas.forEach((area) => {
      filters.push({
        id: `area-${area}`,
        label: area,
        clear: () => setSelectedAreas((prev) => prev.filter((x) => x !== area)),
      });
    });

    if (priceRange !== "all") {
      const labels: Record<string, string> = {
        lt50: "Harga < 50rb",
        "50-100": "Harga 50-100rb",
        gt100: "Harga > 100rb",
      };
      filters.push({
        id: "price",
        label: labels[priceRange] || priceRange,
        clear: () => setPriceRange("all"),
      });
    }

    if (hasMarketplace && type === "product") {
      filters.push({
        id: "marketplace",
        label: "Ada Marketplace",
        clear: () => setHasMarketplace(false),
      });
    }

    if (type === "service") {
      if (availability !== "all") {
        filters.push({
          id: "availability",
          label: availability,
          clear: () => setAvailability("all"),
        });
      }
      if (isNegotiable) {
        filters.push({
          id: "negotiable",
          label: "Bisa Nego",
          clear: () => setIsNegotiable(false),
        });
      }
      if (hasPortfolio) {
        filters.push({
          id: "portfolio",
          label: "Ada Portofolio",
          clear: () => setHasPortfolio(false),
        });
      }
    }

    return filters;
  }, [q, selectedCategories, selectedAreas, priceRange, hasMarketplace, availability, isNegotiable, hasPortfolio, type, categories]);

  const clearAllFilters = () => {
    setQ("");
    setSelectedCategories([]);
    setSelectedAreas([]);
    setPriceRange("all");
    setHasMarketplace(false);
    setAvailability("all");
    setIsNegotiable(false);
    setHasPortfolio(false);
  };

  // Helper to format feedback string (PBI-03 visual feedback)
  const getVisualFeedbackText = () => {
    let typeName = type === "product" ? "Produk" : "Jasa";
    let catSuffix = "";
    if (selectedCategories.length === 1) {
      const catObj = categories.find((c) => c.slug === selectedCategories[0]);
      if (catObj) catSuffix = ` ${catObj.name}`;
    }
    return `Menampilkan ${filteredItems.length} ${typeName}${catSuffix}`;
  };

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Beranda</Link>
        <span className="sep">›</span>
        <span>Katalog {type === "product" ? "Produk" : "Jasa"}</span>
      </div>

      {/* Header and Type Toggles */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <div>
          <h1 className="display" style={{ fontSize: 36, margin: 0, color: "var(--primary)" }}>
            {type === "product" ? "Produk UMKM Banjarsari" : "Layanan Jasa Banjarsari"}
          </h1>
          {/* PBI-03: Visual feedback text */}
          <p style={{ color: "var(--primary)", opacity: 0.8, margin: "6px 0 0", fontSize: 15 }}>
            {getVisualFeedbackText()} {q && <span>untuk pencarian &ldquo;{q}&rdquo;</span>}
          </p>
        </div>

        {/* Tipe Item toggle (PBI-04) */}
        <div style={{ display: "flex", gap: 4, background: "var(--surface-2)", padding: 4, borderRadius: 999 }}>
          <button
            onClick={() => {
              setType("product");
              clearAllFilters();
            }}
            className="btn btn-sm"
            style={{
              borderRadius: 999,
              background: type === "product" ? "var(--surface)" : "transparent",
              color: "var(--primary)",
              boxShadow: type === "product" ? "var(--shadow-sm)" : "none",
              fontWeight: type === "product" ? 700 : 500,
            }}
          >
            Produk ({products.length})
          </button>
          <button
            onClick={() => {
              setType("service");
              clearAllFilters();
            }}
            className="btn btn-sm"
            style={{
              borderRadius: 999,
              background: type === "service" ? "var(--surface)" : "transparent",
              color: "var(--primary)",
              boxShadow: type === "service" ? "var(--shadow-sm)" : "none",
              fontWeight: type === "service" ? 700 : 500,
            }}
          >
            Jasa ({services.length})
          </button>
        </div>
      </div>

      {/* Search Input Bar (PBI-03) */}
      <div className="search-box" style={{ maxWidth: "100%", marginBottom: 24 }}>
        <Icons.Search />
        <input
          className="input"
          type="text"
          placeholder="Cari nama produk, jasa, kategori, atau nama toko UMKM…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ height: 48, borderRadius: 12 }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32 }} className="cat-grid">
        {/* PBI-04: Sidebar filters */}
        <aside className="sidebar" style={{ height: "fit-content", position: "sticky", top: 100 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.Filter /> Filter
            </h4>
            {activeFilters.length > 0 && (
              <button 
                onClick={clearAllFilters} 
                style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700, textDecoration: "underline" }}
              >
                Hapus semua
              </button>
            )}
          </div>

          {/* Kategori Filter */}
          <div className="filter-group">
            <h4>Kategori</h4>
            {currentCategories.map((c) => (
              <label key={c.id} className="check-row">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.slug)}
                  onChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(c.slug) ? prev.filter((x) => x !== c.slug) : [...prev, c.slug]
                    );
                  }}
                />
                <span style={{ fontSize: "14px" }}>
                  {c.icon} {c.name}
                </span>
                <span className="count">
                  {type === "product"
                    ? products.filter((p) => p.category === c.name).length
                    : services.filter((s) => s.category === c.name).length}
                </span>
              </label>
            ))}
          </div>

          {/* Area Dusun Filter */}
          <div className="filter-group">
            <h4>Dusun / Lokasi</h4>
            {areas.map((area) => (
              <label key={area} className="check-row">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => {
                    setSelectedAreas((prev) =>
                      prev.includes(area) ? prev.filter((x) => x !== area) : [...prev, area]
                    );
                  }}
                />
                <span>{area}</span>
              </label>
            ))}
          </div>

          {/* Filter Khusus Produk */}
          {type === "product" ? (
            <>
              <div className="filter-group">
                <h4>Rentang Harga</h4>
                {[
                  { value: "all", label: "Semua Harga" },
                  { value: "lt50", label: "Di bawah Rp 50.000" },
                  { value: "50-100", label: "Rp 50.000 - Rp 100.000" },
                  { value: "gt100", label: "Di atas Rp 100.000" },
                ].map((opt) => (
                  <label key={opt.value} className="check-row">
                    <input
                      type="radio"
                      name="price-range"
                      checked={priceRange === opt.value}
                      onChange={() => setPriceRange(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={hasMarketplace}
                    onChange={(e) => setHasMarketplace(e.target.checked)}
                  />
                  <span>Tersedia di Marketplace</span>
                </label>
              </div>
            </>
          ) : (
            // Filter Khusus Jasa
            <>
              <div className="filter-group">
                <h4>Ketersediaan</h4>
                {[
                  { value: "all", label: "Semua" },
                  { value: "Setiap Hari", label: "Setiap Hari" },
                  { value: "Janjian", label: "Perlu Janjian" },
                ].map((opt) => (
                  <label key={opt.value} className="check-row">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt.value}
                      onChange={() => setAvailability(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                  />
                  <span>Harga Bisa Nego</span>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={hasPortfolio}
                    onChange={(e) => setHasPortfolio(e.target.checked)}
                  />
                  <span>Memiliki Portofolio</span>
                </label>
              </div>
            </>
          )}
        </aside>

        {/* Main Grid View */}
        <div>
          {/* Active Chips & Sorters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {activeFilters.length === 0 ? (
                <span style={{ fontSize: 13, color: "var(--primary)", opacity: 0.6 }}>Tidak ada filter aktif</span>
              ) : (
                activeFilters.map((f) => (
                  <span key={f.id} className="pill-x">
                    {f.label}
                    <button onClick={f.clear}>&times;</button>
                  </span>
                ))
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--primary)", opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                Urutkan
              </span>
              <select
                className="select"
                style={{ width: "auto", height: 36, padding: "0 28px 0 12px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Terbaru</option>
                <option value="most_viewed">Paling Populer</option>
              </select>
            </div>
          </div>

          {/* Grid Render */}
          {filteredItems.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center", color: "var(--primary)", background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--primary)", fontWeight: 700, marginBottom: 8 }}>
                Tidak ada hasil yang cocok
              </div>
              <p style={{ opacity: 0.8 }}>Coba ubah kata kunci atau bersihkan filter di panel samping.</p>
              <button 
                onClick={clearAllFilters} 
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: 16 }}
              >
                Bersihkan Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-products" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {type === "product"
                ? (filteredItems as Array<Product & { _biz?: Business }>).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      businessName={item._biz?.name || "UMKM Banjarsari"}
                    />
                  ))
                : (filteredItems as Array<Service & { _biz?: Business }>).map((item) => (
                    <ServiceCard
                      key={item.id}
                      service={item}
                      businessName={item._biz?.name || "UMKM Banjarsari"}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .cat-grid > aside { position: relative !important; top: auto !important; margin-bottom: 24px; }
          .cat-grid .grid-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .cat-grid .grid-products { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
