'use client';

import { useState, useMemo } from 'react';
import type { Product, Service, Business, Category } from '@/lib/firestore/types';
import ProductCard from './ProductCard';
import ServiceCard from './ServiceCard';
import { Icons } from './Icons';

interface CatalogContainerProps {
  products: Product[];
  services: Service[];
  businesses: Business[];
  categories: Category[];
  areas: string[];
  initialType: 'product' | 'service';
  initialQuery: string;
  initialCategory: string;
}

const CatalogContainer = ({
  products,
  services,
  businesses,
  categories,
  areas,
  initialType,
  initialQuery,
  initialCategory,
}: CatalogContainerProps) => {
  const [type, setType] = useState<'product' | 'service'>(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeArea, setActiveArea] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  // Build business map
  const businessMap = useMemo(
    () => new Map(businesses.map((b) => [b.id, b.name])),
    [businesses]
  );
  const getBusinessName = (id: string) => businessMap.get(id) || 'UMKM Banjarsari';

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (searchQuery) list = list.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === 'popular') list.sort((a, b) => b.clickCount - a.clickCount);
    else if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  const filteredServices = useMemo(() => {
    let list = [...services];
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (searchQuery) list = list.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === 'popular') list.sort((a, b) => b.clickCount - a.clickCount);
    else if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else list.sort((a, b) => b.price - a.price);
    return list;
  }, [services, activeCategory, searchQuery, sortBy]);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.type === type || c.type === 'both'),
    [categories, type]
  );

  const currentItems = type === 'product' ? filteredProducts : filteredServices;
  const totalCount = currentItems.length;

  return (
    <main style={{ background: 'var(--bg)', minHeight: '60vh' }}>
      {/* Page Header */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--line)', padding: '32px 0 0' }}>
        <div className="container">
          <div className="label-eyebrow" style={{ marginBottom: 8 }}>Katalog UMKM</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>
            {type === 'product' ? 'Produk UMKM Banjarsari' : 'Layanan Jasa Banjarsari'}
          </h1>

          {/* Type Switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => { setType('product'); setActiveCategory(''); }}
              className={`chip ${type === 'product' ? 'active' : ''}`}
            >
              Produk UMKM ({products.length})
            </button>
            <button
              onClick={() => { setType('service'); setActiveCategory(''); }}
              className={`chip ${type === 'service' ? 'active' : ''}`}
            >
              Layanan Jasa ({services.length})
            </button>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('')}
              className={`chip ${activeCategory === '' ? 'tonal' : ''}`}
            >
              Semua
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.slug ? '' : c.slug)}
                className={`chip ${activeCategory === c.slug ? 'tonal' : ''}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>
            {/* Sidebar Filter */}
            <aside className="sidebar" style={{ position: 'sticky', top: 80 }}>
              <div className="filter-group">
                <h4>Cari</h4>
                <div style={{ position: 'relative' }}>
                  <Icons.Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="text"
                    placeholder="Nama produk..."
                    className="input"
                    style={{ paddingLeft: 38 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <h4>Urutkan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { value: 'popular', label: 'Paling Populer' },
                    { value: 'price-asc', label: 'Harga Terendah' },
                    { value: 'price-desc', label: 'Harga Tertinggi' },
                  ].map((opt) => (
                    <label key={opt.value} className="check-row">
                      <input
                        type="radio"
                        name="sortBy"
                        value={opt.value}
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value as typeof sortBy)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {areas.length > 0 && (
                <div className="filter-group">
                  <h4>Area</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="check-row">
                      <input type="radio" name="area" value="" checked={activeArea === ''} onChange={() => setActiveArea('')} />
                      Semua Area
                    </label>
                    {areas.map((area) => (
                      <label key={area} className="check-row">
                        <input type="radio" name="area" value={area} checked={activeArea === area} onChange={() => setActiveArea(area)} />
                        {area}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Product Grid */}
            <div>
              {/* Result count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', opacity: 0.7 }}>
                  Menampilkan <strong>{totalCount}</strong> hasil
                  {activeCategory ? ` · ${activeCategory}` : ''}
                  {searchQuery ? ` · "${searchQuery}"` : ''}
                </div>
                {(activeCategory || searchQuery) && (
                  <button
                    onClick={() => { setActiveCategory(''); setSearchQuery(''); }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Reset filter
                  </button>
                )}
              </div>

              {totalCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--primary)', opacity: 0.5 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>Tidak ada hasil ditemukan</div>
                </div>
              ) : (
                <div className="grid grid-products">
                  {type === 'product'
                    ? filteredProducts.map((p) => (
                        <ProductCard key={p.id} product={p} businessName={getBusinessName(p.businessId)} />
                      ))
                    : filteredServices.map((s) => (
                        <ServiceCard key={s.id} service={s} businessName={getBusinessName(s.businessId)} />
                      ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .catalog-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
};

export default CatalogContainer;
