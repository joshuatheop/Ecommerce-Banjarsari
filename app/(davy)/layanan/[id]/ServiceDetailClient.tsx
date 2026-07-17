'use client';

import { useState, useEffect } from 'react';
import type { Service, Business } from '@/lib/firestore/types';
import { incrementServiceClicks } from '@/lib/firestore/data-loader';
import { trackClickEvent } from '@/lib/firestore/analytics';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

interface ServiceDetailClientProps {
  service: Service;
  business: Business | null;
}

export default function ServiceDetailClient({ service, business }: ServiceDetailClientProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Auto-increment page views as analytics event
  useEffect(() => {
    if (service.id) {
      incrementServiceClicks(service.id);
      trackClickEvent('view_item', {
        itemName: service.name,
        businessName: business?.name || 'UMKM Banjarsari',
      });
    }
  }, [service.id, service.name, business?.name]);

  const images = service.imageUrls && service.imageUrls.length > 0
    ? service.imageUrls
    : ['https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80'];

  const handleWhatsAppRedirect = async () => {
    if (!business?.whatsapp) return;

    // Log event and increment count
    await trackClickEvent('click_wa', {
      itemName: service.name,
      businessName: business.name,
      waNumber: business.whatsapp,
    });
    await incrementServiceClicks(service.id);

    // Format WhatsApp text & redirect
    const cleanNum = business.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo Ibu/Bapak dari *${business.name}*, saya tertarik dengan layanan jasa *${service.name}* (${service.priceRange || 'Harga Nego'}) yang terdaftar di Katalog Banjarsari. Apakah tersedia untuk dipesan?`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  const handleMarketplaceRedirect = async () => {
    if (!service.Marketplace_URL) return;

    // Log event and increment count
    await trackClickEvent('click_marketplace', {
      itemName: service.name,
      businessName: business?.name || 'UMKM Banjarsari',
      marketplaceUrl: service.Marketplace_URL,
    });
    await incrementServiceClicks(service.id);

    // Redirect
    window.open(service.Marketplace_URL, '_blank');
  };

  const handleSocialRedirect = async () => {
    if (!business?.socialMediaUrl) return;

    // Log event (PBI-13: Redirect ke Sosmed)
    const socialName = business.instagram ? `@${business.instagram}` : (business.facebook || 'Sosmed Toko');
    await trackClickEvent('salin_link', {
      itemName: service.name,
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
          <Link href="/katalog?type=service" style={{ textDecoration: 'underline' }}>Katalog Jasa</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-muted)' }}>{service.name}</span>
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
                <div style={{ fontSize: 64, marginBottom: 12 }}>🔧</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)' }}>
                  Jasa · {service.category}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Service Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div className="label-eyebrow" style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                Layanan Jasa Warga Banjarsari
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2, color: 'var(--primary)' }}>
                {service.name}
              </h1>

              {/* Service Badges (PBI-12 Availability, Type, Negotiability) */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>

                {/* Service Type Badge */}
                <span style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: service.Service_Type === 'Panggilan' ? 'var(--surface-3)' : 'var(--surface-2)',
                  color: 'var(--primary)',
                  border: '1px solid var(--line-strong)'
                }}>
                  📍 Layanan: {service.Service_Type || 'Panggilan'}
                </span>

                {/* Availability Badge */}
                <span style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: service.Availability_Type === 'Tersedia' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(235, 87, 87, 0.15)',
                  color: service.Availability_Type === 'Tersedia' ? '#1faa54' : '#eb5757',
                  border: '1px solid currentColor'
                }}>
                  ⚡ Status: {service.Availability_Type || 'Tersedia'}
                </span>

                {/* Negotiable Badge */}
                <span style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: service.Is_Negotiable ? 'rgba(205, 255, 0, 0.15)' : 'rgba(1, 48, 32, 0.05)',
                  color: service.Is_Negotiable ? 'var(--primary)' : 'var(--text-muted)',
                  border: '1px solid var(--line-strong)'
                }}>
                  {service.Is_Negotiable ? '🤝 Bisa Nego' : '🏷️ Harga Pas'}
                </span>

              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
                  {service.priceRange || `Rp ${service.price.toLocaleString('id-ID')}`}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 999 }}>
                  <Icons.Flame style={{ color: 'var(--accent-y)' }} />
                  {service.clickCount + 1} Klik diakses
                </div>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: 0 }} />

            {/* Description */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Deskripsi Layanan
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line', opacity: 0.9 }}>
                {service.description}
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
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PENYEDIA JASA</div>
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
              <div style={{ display: 'grid', gridTemplateColumns: service.Marketplace_URL ? '1fr 1fr' : '1fr', gap: 12 }}>

                {/* WA button */}
                {business?.whatsapp && (
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="btn btn-wa btn-lg"
                    style={{ width: '100%', height: 48 }}
                  >
                    <Icons.Whatsapp /> Hubungi Jasa / Nego
                  </button>
                )}

                {/* Marketplace button */}
                {service.Marketplace_URL && (
                  <button
                    onClick={handleMarketplaceRedirect}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', height: 48, background: 'var(--aqua)', borderColor: 'var(--aqua)' }}
                  >
                    <Icons.ShoppingBag /> Pesan Jasa (Marketplace)
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
