'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icons } from './Icons';
import { getProducts, getServices, getBusinesses } from '@/lib/firestore/data-loader';
import type { Product, Service, Business } from '@/lib/firestore/types';

export default function LiveSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [businessesList, setBusinessesList] = useState<Business[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-load or fetch data on first focus / type
  const loadSearchData = async () => {
    if (dataLoaded || loading) return;
    setLoading(true);
    try {
      const [p, s, b] = await Promise.all([
        getProducts(),
        getServices(),
        getBusinesses(),
      ]);
      setProductsList(p);
      setServicesList(s);
      setBusinessesList(b);
      setDataLoaded(true);
    } catch (err) {
      console.error('Failed to load search data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    loadSearchData();
    if (query.trim().length > 0) setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!dataLoaded) loadSearchData();
    setIsOpen(val.trim().length > 0);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Results
  const trimmedQuery = query.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!trimmedQuery) return [];
    return productsList
      .filter(
        (p) =>
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.category.toLowerCase().includes(trimmedQuery) ||
          p.description.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 3);
  }, [productsList, trimmedQuery]);

  const matchingServices = useMemo(() => {
    if (!trimmedQuery) return [];
    return servicesList
      .filter(
        (s) =>
          s.name.toLowerCase().includes(trimmedQuery) ||
          s.category.toLowerCase().includes(trimmedQuery) ||
          s.description.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 3);
  }, [servicesList, trimmedQuery]);

  const matchingBusinesses = useMemo(() => {
    if (!trimmedQuery) return [];
    return businessesList
      .filter(
        (b) =>
          b.name.toLowerCase().includes(trimmedQuery) ||
          b.owner.toLowerCase().includes(trimmedQuery) ||
          b.area.toLowerCase().includes(trimmedQuery) ||
          b.description.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 2);
  }, [businessesList, trimmedQuery]);

  const totalMatches =
    matchingProducts.length + matchingServices.length + matchingBusinesses.length;

  const handleSubmitSearch = (searchTerm?: string) => {
    const q = searchTerm || query;
    if (q.trim()) {
      setIsOpen(false);
      router.push(`/katalog?search=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div ref={containerRef} className="search-box" style={{ position: 'relative' }}>
      <Icons.Search style={{ flexShrink: 0, color: 'var(--text-muted)' }} />

      <input
        ref={inputRef}
        type="text"
        className="input"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder="Cari produk, jasa, atau toko UMKM..."
        aria-label="Pencarian"
        style={{ width: '100%' }}
      />

      {query && (
        <button
          onClick={() => {
            setQuery('');
            setIsOpen(false);
            inputRef.current?.focus();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Hapus pencarian"
        >
          <Icons.X style={{ width: 16, height: 16 }} />
        </button>
      )}

      {/* Live Search Results Dropdown */}
      {isOpen && trimmedQuery.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: 'clamp(320px, 90vw, 440px)',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'liveSearchIn 0.15s ease',
          }}
        >
          {loading && !dataLoaded ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Mencari di Desa Banjarsari...
            </div>
          ) : totalMatches > 0 ? (
            <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Section 1: Produk */}
              {matchingProducts.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--line)' }}>
                  <div
                    style={{
                      padding: '10px 16px 6px',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <span>🛍️ Produk UMKM</span>
                    <span style={{ color: 'var(--text-muted)' }}>{matchingProducts.length} hasil</span>
                  </div>
                  {matchingProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produk/${p.id}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        transition: 'background 0.12s',
                        borderBottom: '1px solid rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 'var(--radius)',
                          background: 'var(--bg)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {p.imageUrls && p.imageUrls[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.imageUrls[0]}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--dark)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {p.category}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0,
                        }}
                      >
                        {formatPrice(p.price)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Section 2: Layanan Jasa */}
              {matchingServices.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--line)' }}>
                  <div
                    style={{
                      padding: '10px 16px 6px',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <span>🔧 Layanan Jasa</span>
                    <span style={{ color: 'var(--text-muted)' }}>{matchingServices.length} hasil</span>
                  </div>
                  {matchingServices.map((s) => (
                    <Link
                      key={s.id}
                      href={`/layanan/${s.id}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        transition: 'background 0.12s',
                        borderBottom: '1px solid rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 'var(--radius)',
                          background: 'var(--secondary)',
                          color: 'var(--primary)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 14,
                        }}
                      >
                        {s.imageUrls && s.imageUrls[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={s.imageUrls[0]}
                            alt={s.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          '🔧'
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: 'var(--dark)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {s.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {s.category}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0,
                        }}
                      >
                        {s.priceRange || formatPrice(s.price)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Section 3: Toko / UMKM */}
              {matchingBusinesses.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--line)' }}>
                  <div
                    style={{
                      padding: '10px 16px 6px',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <span>🏬 Toko & UMKM</span>
                    <span style={{ color: 'var(--text-muted)' }}>{matchingBusinesses.length} hasil</span>
                  </div>
                  {matchingBusinesses.map((b) => (
                    <Link
                      key={b.id}
                      href={`/toko/${b.id}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        transition: 'background 0.12s',
                        borderBottom: '1px solid rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 'var(--radius)',
                          background: 'var(--primary)',
                          color: 'var(--white)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {b.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={b.imageUrl}
                            alt={b.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          b.name.charAt(0)
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: 'var(--dark)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {b.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Pemilik: {b.owner}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          background: 'var(--secondary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          flexShrink: 0,
                        }}
                      >
                        📍 {b.area}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All Results Action */}
              <button
                onClick={() => handleSubmitSearch()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--surface)',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
              >
                Lihat semua hasil untuk &quot;{query}&quot; <Icons.ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--dark)' }}>
                Tidak ada hasil untuk &quot;{query}&quot;
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Coba gunakan kata kunci produk atau jasa lain di Banjarsari
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes liveSearchIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
