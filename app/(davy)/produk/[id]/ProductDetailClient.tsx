'use client';

import { useState, useEffect } from 'react';
import type { Product, Business } from '@/lib/firestore/types';
import { incrementProductClicks } from '@/lib/firestore/data-loader';
import { trackClickEvent } from '@/lib/firestore/analytics';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

interface ProductDetailClientProps {
  product: Product;
  business: Business | null;
}

export default function ProductDetailClient({ product, business }: ProductDetailClientProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Auto-increment page views as analytics event
  useEffect(() => {
    if (product.id) {
      incrementProductClicks(product.id);
      trackClickEvent('view_item', {
        itemName: product.name,
        businessName: business?.name || 'UMKM Banjarsari',
      });
    }
  }, [product.id, product.name, business?.name]);

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  const handleWhatsAppRedirect = async () => {
    if (!business?.whatsapp) return;

    // Log event and increment count
    await trackClickEvent('click_wa', {
      itemName: product.name,
      businessName: business.name,
      waNumber: business.whatsapp,
    });
    await incrementProductClicks(product.id);

    // Format WhatsApp text & redirect
    const cleanNum = business.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo Ibu/Bapak dari *${business.name}*, saya tertarik dengan produk *${product.name}* (harga: ${formatPrice(product.price)}) yang terdaftar di Katalog Banjarsari. Apakah produk ini tersedia?`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  const handleMarketplaceRedirect = async () => {
    if (!product.Marketplace_URL) return;

    // Log event and increment count
    await trackClickEvent('click_marketplace', {
      itemName: product.name,
      businessName: business?.name || 'UMKM Banjarsari',
      marketplaceUrl: product.Marketplace_URL,
    });
    await incrementProductClicks(product.id);

    // Redirect
    window.open(product.Marketplace_URL, '_blank');
  };

  const handleSocialRedirect = async () => {
    if (!business?.socialMediaUrl) return;

    // Log event (PBI-13: Redirect ke Sosmed)
    const socialName = business.instagram ? `@${business.instagram}` : (business.facebook || 'Sosmed Toko');
    await trackClickEvent('salin_link', {
      itemName: product.name,
      businessName: business.name,
      socialMedia: socialName,
    });

    // Redirect
    window.open(business.socialMediaUrl, '_blank');
  };

  return (
    <div style={{ background: 'var(--bg)', padding: '40px 0 80px' }}>
      <div className="container">

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)' }}>
          <Link href="/" style={{ textDecoration: 'underline' }}>Beranda</Link>
          <span>/</span>
          <Link href="/katalog?type=product" style={{ textDecoration: 'underline' }}>Katalog Produk</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-muted)' }}>{product.name}</span>
        </nav>

        {/* Detail Container Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.1fr) 1fr',
          gap: 40,
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--line)'
        }} className="detail-grid">

          {/* LEFT COLUMN: Placeholder display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              aspectRatio: '4/3',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              background: 'repeating-linear-gradient(135deg, var(--surface-2) 0px, var(--surface-2) 15px, var(--surface-3) 15px 30px)',
              border: '1px solid var(--line-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '24px 32px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
                border: '1px solid var(--line)'
              }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>📦</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)' }}>
                  {product.category}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div className="label-eyebrow" style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                Produk UMKM Kelurahan Banjarsari
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2, color: 'var(--primary)' }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>
                  {formatPrice(product.price)}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 999 }}>
                  <Icons.Flame style={{ color: 'var(--accent-y)' }} />
                  {product.clickCount + 1} Klik diakses
                </div>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: 0 }} />

            {/* Description */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Deskripsi Produk
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line', opacity: 0.9 }}>
                {product.description}
              </p>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: 0 }} />

            {/* Business owner card */}
            {business && (
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                border: '1px solid var(--line)',
                display: 'flex',
                gap: 16,
                alignItems: 'center'
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 22,
                  fontWeight: 700
                }}>
                  {business.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PENJUAL UMKM</div>
                  <h4 style={{ margin: '2px 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                    {business.name}
                  </h4>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>Pemilik: <strong>{business.owner}</strong></span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icons.MapPin /> {business.area}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: product.Marketplace_URL ? '1fr 1fr' : '1fr', gap: 12 }}>

                {/* WA button */}
                {business?.whatsapp && (
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="btn btn-wa btn-lg"
                    style={{ width: '100%', height: 48 }}
                  >
                    <Icons.Whatsapp /> Tanya Penjual / Nego
                  </button>
                )}

                {/* Marketplace button */}
                {product.Marketplace_URL && (
                  <button
                    onClick={handleMarketplaceRedirect}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', height: 48, background: 'var(--aqua)', borderColor: 'var(--aqua)' }}
                  >
                    <Icons.ShoppingBag /> Beli di Marketplace
                  </button>
                )}

              </div>

              {/* Social Media Redirect (PBI-13) */}
              {business?.socialMediaUrl && (
                <button
                  onClick={handleSocialRedirect}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Icons.Instagram /> Kunjungi Sosial Media Penjual ({business.instagram ? `@${business.instagram}` : 'Sosmed'})
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
