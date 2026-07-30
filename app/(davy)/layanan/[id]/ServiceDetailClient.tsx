'use client';

import { useEffect } from 'react';
import type { ServiceItem, Business } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';
import { incrementServiceClicks } from '@/lib/firestore/data-loader';
import { trackClickEvent } from '@/lib/firestore/analytics';
import { Icons } from '@/components/shared/Icons';
import ShareModal from '@/components/shared/ShareModal';
import ReviewSection from '@/components/shared/ReviewSection';
import Link from 'next/link';

interface ServiceDetailClientProps {
  service: ServiceItem;
  business: Business | null;
}

export default function ServiceDetailClient({ service, business }: ServiceDetailClientProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = (service.imageUrls && service.imageUrls.length > 0)
    ? service.imageUrls
    : (service.Gallery_Images && service.Gallery_Images.length > 0)
    ? service.Gallery_Images
    : [];

  // Auto-increment page views as analytics event
  useEffect(() => {
    if (service.service_id) {
      incrementServiceClicks(service.service_id);
      trackClickEvent('view_item', {
        itemName: service.service_name,
        businessName: business?.business_name || 'UMKM Banjarsari',
      });
    }
  }, [service.service_id, service.service_name, business?.business_name]);

  const handleWhatsAppRedirect = async () => {
    const waNumber = service.whatsapp_number || business?.business_phone;
    if (!waNumber) return;

    await trackClickEvent('click_wa', {
      itemName: service.service_name,
      businessName: business?.business_name || 'UMKM Banjarsari',
      waNumber,
    });
    await incrementServiceClicks(service.service_id);

    const cleanNum = business.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo Ibu/Bapak dari *${business?.business_name || 'UMKM Banjarsari'}*, saya tertarik dengan layanan jasa *${service.service_name}* (${priceDisplay}) yang terdaftar di Katalog Banjarsari. Apakah tersedia untuk dipesan?`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  const handleMarketplaceRedirect = async () => {
    const url = service.marketplace || business?.marketplace;
    if (!url) return;

    await trackClickEvent('click_marketplace', {
      itemName: service.service_name,
      businessName: business?.business_name || 'UMKM Banjarsari',
      marketplaceUrl: url,
    });
    await incrementServiceClicks(service.service_id);

    window.open(service.Marketplace_URL, '_blank');
  };

  const handleSocialRedirect = async () => {
    if (!business?.socialMediaUrl) return;

    const socialName = business.instagram ? `@${business.instagram}` : (business.facebook || 'Sosmed Toko');
    await trackClickEvent('salin_link', {
      itemName: service.name,
      businessName: business.name,
      socialMedia: socialName,
    });

    window.open(business.socialMediaUrl, '_blank');
  };

  return (
    <div style={{ background: 'var(--bg)', padding: '36px 0 80px', minHeight: '100vh' }}>
      <div className="container">

        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)' }}>
          <Link href="/" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Beranda</Link>
          <span>/</span>
          <Link href="/katalog?type=service" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Katalog Jasa</Link>
          <span>/</span>
          <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{service.name}</span>
        </nav>

        {/* Detail Container Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.1fr) 1fr',
            gap: 40,
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--line)',
          }}
          className="detail-grid"
        >

          {/* LEFT COLUMN: Image Showcase & Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)',
                border: '1px solid var(--line-strong)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {images.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={service.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    background: 'var(--surface)',
                    padding: '28px 36px',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow)',
                    textAlign: 'center',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 56 }}>🛠️</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--primary)',
                      background: 'var(--surface-2)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {service.category || 'LAYANAN JASA'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Desa Banjarsari, Garut
                  </div>
                </div>
              )}

              {/* Category Badge Top Left */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'var(--primary)',
                  color: 'var(--accent-y)',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                🛠️ {service.category || 'JASA WARGA'}
              </div>

              {/* Popularity Badge Top Right */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: 'rgba(5, 71, 43, 0.88)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <Icons.Flame style={{ color: 'var(--accent-y)', width: 13, height: 13 }} />
                {service.clickCount + 1} Klik
              </div>
            </div>

            {/* Thumbnail selector if multiple images exist */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid var(--primary)' : '1px solid var(--line)',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'var(--surface-2)',
                      flexShrink: 0,
                      opacity: activeImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Service Info & Dynamic Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  marginBottom: 6,
                }}
              >
                LAYANAN JASA • DESA BANJARSARI GARUT
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3.5vw, 34px)',
                  fontWeight: 800,
                  margin: '0 0 14px',
                  lineHeight: 1.2,
                  color: 'var(--dark)',
                }}
              >
                {service.name}
              </h1>

              {/* Price & Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 800,
                    color: 'var(--primary)',
                  }}
                >
                  {service.priceRange || `Rp ${service.price.toLocaleString('id-ID')}`}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    background: 'var(--secondary)',
                    color: 'var(--primary)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  <Icons.Flame style={{ width: 13, height: 13 }} />
                  Populer #{service.clickCount + 1}
                </div>
              </div>

            {/* Quick Spec Pills */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Icons.MapPin style={{ width: 13, height: 13, color: 'var(--primary)' }} />
                Area: {business?.area || 'Banjarsari'}
              </div>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Icons.Check style={{ width: 13, height: 13, color: 'var(--primary)' }} />
                Penyedia Jasa Terverifikasi
              </div>
            </div>

            {/* Description Box */}
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                border: '1px solid var(--line)',
                borderLeft: '4px solid var(--primary)',
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--primary)',
                  margin: '0 0 8px',
                }}
              >
                Deskripsi Layanan Jasa
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: 'var(--dark)',
                  whiteSpace: 'pre-line',
                  margin: 0,
                  opacity: 0.9,
                }}
              >
                {service.description}
              </p>
            </div>

            {/* Business owner card */}
            {business && (
              <div
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 20,
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--shadow)',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--primary)',
                      color: 'var(--white)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 22,
                      fontWeight: 700,
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {business.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={business.imageUrl} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      business.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                      }}
                    >
                      PENYEDIA RESMI JASA
                    </div>
                    <h4 style={{ margin: '2px 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--dark)' }}>
                      {business.name}
                    </h4>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--text-secondary)', alignItems: 'center' }}>
                      <span>Pemilik: <strong>{business.owner}</strong></span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Icons.MapPin style={{ width: 12, height: 12, color: 'var(--primary)' }} /> {business.area}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/toko/${business.id}`}
                  className="btn btn-primary"
                  style={{ fontSize: 12.5, fontWeight: 700, height: 38 }}
                >
                  Lihat Profil Toko <Icons.ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
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
                    style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 700 }}
                  >
                    <Icons.Whatsapp /> Hubungi Jasa / Nego via WA
                  </button>
                )}

                {/* Marketplace button */}
                {service.Marketplace_URL && (
                  <button
                    onClick={handleMarketplaceRedirect}
                    className="btn btn-primary btn-lg"
                    style={{
                      width: '100%',
                      height: 48,
                      fontSize: 14,
                      fontWeight: 700,
                      background: 'var(--aqua)',
                      borderColor: 'var(--aqua)',
                    }}
                  >
                    <Icons.ShoppingBag /> Pesan Jasa (Marketplace)
                  </button>
                )}
              </div>

              {/* Share & Social */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', height: 40, fontSize: 13 }}
                >
                  <Icons.Share style={{ width: 15, height: 15 }} /> Bagikan (Auto-Caption)
                </button>
                {business?.socialMediaUrl && (
                  <button
                    onClick={handleSocialRedirect}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--line)', height: 40, fontSize: 13 }}
                  >
                    <Icons.Instagram style={{ width: 15, height: 15 }} /> Sosmed Penjual
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* BOTTOM FULL-WIDTH MAP INSIDE THE SAME CONTAINER */}
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: 0 }} />

          <BusinessLocationMap
            latitude={business?.latitude ?? null}
            longitude={business?.longitude ?? null}
            businessName={business?.business_name}
            address={business?.business_address || business?.area_name}
          />

        </div>

        {/* Rating & Review Section */}
        <ReviewSection
          targetId={service.id}
          targetType="service"
          targetName={service.name}
        />

      </div>

      {/* Share Modal */}
      <ShareModal
        title="Bagikan Layanan Jasa Ini"
        itemName={service.name}
        businessName={business?.name || 'UMKM Banjarsari'}
        priceFormatted={service.priceRange || `Rp ${service.price.toLocaleString('id-ID')}`}
        itemType="layanan"
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
