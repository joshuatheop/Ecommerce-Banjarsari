'use client';

import { useState } from 'react';
import type { Business, Product, Service } from '@/lib/firestore/types';
import EmbeddedMap from '@/components/shared/EmbeddedMap';
import ShareModal from '@/components/shared/ShareModal';
import ProductCard from '@/components/shared/ProductCard';
import ServiceCard from '@/components/shared/ServiceCard';
import { Icons } from '@/components/shared/Icons';
import ReviewSection from '@/components/shared/ReviewSection';
import Link from 'next/link';

import { sanitizeCoordinates } from '@/lib/firestore/data-loader';

interface BusinessProfileClientProps {
  business: Business;
  products: Product[];
  services: Service[];
}

export default function BusinessProfileClient({
  business,
  products,
  services,
}: BusinessProfileClientProps) {
  const [tab, setTab] = useState<'products' | 'services'>(
    products.length > 0 ? 'products' : 'services'
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const totalClicks = [...products, ...services].reduce(
    (sum, item) => sum + (item.clickCount || 0),
    0
  );

  const handleWaContact = () => {
    if (!business.whatsapp) return;
    const cleanNum = business.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo Ibu/Bapak dari *${business.name}*, saya mengetahui toko/usaha Anda dari platform Katalog PALUGADA Banjarsari.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  const rawLat = business.latitude ?? business.Latitude_Coordinate;
  const rawLng = business.longitude ?? business.Longitude_Coordinate;
  const { latitude, longitude } = sanitizeCoordinates(rawLat, rawLng, business.id || business.name);

  return (
    <div style={{ background: 'var(--bg)', paddingBottom: 80, minHeight: '100vh' }}>
      {/* Cover Header Banner */}
      <div
        style={{
          minHeight: 200,
          background: 'linear-gradient(135deg, var(--color-dark, #013020) 0%, var(--color-primary, #05472B) 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: 64,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(135deg, transparent 0 32px, rgba(205, 255, 0, 0.05) 32px 64px)',
          }}
        />
        <div className="container" style={{ position: 'relative', paddingTop: 20, zIndex: 1 }}>
          {/* Breadcrumb Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/" style={{ textDecoration: 'underline', color: 'var(--secondary, #AADCAB)' }}>
              Beranda
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/</span>
            <Link href="/toko" style={{ textDecoration: 'underline', color: 'var(--secondary, #AADCAB)' }}>
              Profil UMKM
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/</span>
            <span style={{ color: 'var(--accent-y, #CDFF00)', fontWeight: 600 }}>{business.name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ marginTop: -52, position: 'relative', zIndex: 2 }}>
        {/* Profile Card Header */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-xl)',
            padding: 28,
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 24,
            alignItems: 'center',
          }}
          className="biz-head-grid"
        >
          {/* Avatar / Logo */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: 'var(--primary)',
              color: 'var(--white)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 36,
              border: '4px solid var(--surface)',
              boxShadow: 'var(--shadow)',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {business.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={business.imageUrl}
                alt={business.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              business.name.charAt(0)
            )}
          </div>

          {/* Title & Meta Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {business.category && (
                <span
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--primary)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    border: '1px solid var(--line)',
                  }}
                >
                  {business.category}
                </span>
              )}
              <span
                style={{
                  background: 'var(--secondary)',
                  color: 'var(--dark)',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Icons.MapPin style={{ width: 12, height: 12 }} /> {business.area}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3.5vw, 32px)',
                fontWeight: 700,
                margin: '0 0 4px',
                color: 'var(--primary)',
                lineHeight: 1.2,
              }}
            >
              {business.name}
            </h1>

            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Pemilik Usaha: <strong style={{ color: 'var(--dark)' }}>{business.owner}</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {business.whatsapp && (
              <button
                onClick={handleWaContact}
                className="btn btn-wa"
                style={{ height: 44, padding: '0 20px', fontWeight: 600 }}
              >
                <Icons.Whatsapp style={{ width: 18, height: 18 }} /> Hubungi Penjual
              </button>
            )}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="btn btn-secondary"
              style={{ height: 44, padding: '0 16px' }}
              title="Bagikan Profil UMKM"
            >
              <Icons.Share style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            margin: '24px 0',
          }}
          className="biz-stats-grid"
        >
          <MiniStat label="Total Produk" value={products.length} />
          <MiniStat label="Total Jasa" value={services.length} />
          <MiniStat label="Total Dilihat" value={`${totalClicks}x`} />
          <MiniStat label="Status UMKM" value={business.status === 'aktif' ? 'Verified ✓' : 'Non-Aktif'} />
        </div>

        {/* Main Content Layout Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}
          className="biz-main-grid"
        >
          {/* Left Column: About & Catalog Showcase */}
          <div>
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 24,
                border: '1px solid var(--line)',
                marginBottom: 24,
                boxShadow: 'var(--shadow)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: 10,
                }}
              >
                Tentang Usaha / UMKM
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-primary)', margin: 0, opacity: 0.9 }}>
                {business.description || 'Pelaku UMKM lokal terpercaya dari Kelurahan Banjarsari.'}
              </p>
            </div>

            {/* Catalog Tabs Selector */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                borderBottom: '2px solid var(--line)',
                marginBottom: 20,
              }}
            >
              {products.length > 0 && (
                <button
                  onClick={() => setTab('products')}
                  style={{
                    padding: '12px 20px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 15,
                    border: 'none',
                    background: 'transparent',
                    borderBottom: tab === 'products' ? '3px solid var(--primary)' : '3px solid transparent',
                    color: tab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Produk UMKM ({products.length})
                </button>
              )}

              {services.length > 0 && (
                <button
                  onClick={() => setTab('services')}
                  style={{
                    padding: '12px 20px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 15,
                    border: 'none',
                    background: 'transparent',
                    borderBottom: tab === 'services' ? '3px solid var(--primary)' : '3px solid transparent',
                    color: tab === 'services' ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Layanan Jasa ({services.length})
                </button>
              )}
            </div>

            {/* Catalog Grid */}
            {tab === 'products' ? (
              products.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 20,
                  }}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} businessName={business.name} />
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Belum ada produk yang didaftarkan.
                </p>
              )
            ) : services.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 20,
                }}
              >
                {services.map((s) => (
                  <ServiceCard key={s.id} service={s} businessName={business.name} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Belum ada layanan jasa yang didaftarkan.
              </p>
            )}
          </div>

          {/* Right Column: Embedded Map & Contact Links */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Embedded Google Maps */}
            <EmbeddedMap
              latitude={latitude}
              longitude={longitude}
              businessName={business.name}
              address={business.address}
              height={260}
            />

            {/* Social Media & Contact Card */}
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 20,
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                Sosial Media & Kontak
              </h4>

              {business.instagram && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius)',
                      background: '#fff0f5',
                      color: '#e1306c',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icons.Instagram style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      INSTAGRAM
                    </div>
                    <a
                      href={`https://instagram.com/${business.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}
                    >
                      @{business.instagram}
                    </a>
                  </div>
                </div>
              )}

              {business.facebook && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius)',
                      background: '#e7f3ff',
                      color: '#1877f2',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icons.Facebook style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      FACEBOOK
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>
                      {business.facebook}
                    </div>
                  </div>
                </div>
              )}

              {business.whatsapp && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius)',
                      background: '#e6f9ed',
                      color: '#25d366',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icons.Whatsapp style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      WHATSAPP
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>
                      +{business.whatsapp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Rating & Review Section */}
        <ReviewSection
          targetId={business.id}
          targetType="business"
          targetName={business.name}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        title={`Bagikan Profil ${business.name}`}
        itemName={business.name}
        businessName={business.name}
        priceFormatted="Terjangkau"
        itemType="toko"
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <style>{`
        @media (max-width: 880px) {
          .biz-head-grid { grid-template-columns: 1fr !important; text-align: center; }
          .biz-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .biz-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--primary)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
