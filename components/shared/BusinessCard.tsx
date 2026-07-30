'use client';

import Link from 'next/link';
import type { Business } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Link href={`/toko/${business.id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb" style={{ aspectRatio: '16 / 9' }}>
        {business.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={business.imageUrl} alt={business.name} className="fl-card-img" />
        ) : (
          <div className="fl-card-placeholder">
            <span>{business.category || 'UMKM BANJARSARI'}</span>
          </div>
        )}

        {/* Hot / Verified Badge Top Left */}
        <div
          className="fl-card-hot-badge"
          style={{
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <Icons.Check style={{ width: 10, height: 10 }} />
          TOKO TERVERIFIKASI
        </div>

        {/* Area Tag Top Right */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(5, 71, 43, 0.88)',
            backdropFilter: 'blur(4px)',
            color: 'var(--accent-y)',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 1,
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            letterSpacing: '0.04em',
          }}
        >
          <Icons.MapPin style={{ width: 10, height: 10 }} />
          {business.area}
        </div>
      </div>

      {/* Body */}
      <div className="fl-card-body" style={{ padding: '16px' }}>
        <div className="fl-card-brand">
          PEMILIK: {business.owner}
        </div>
        <div className="fl-card-name" style={{ fontSize: 16, fontWeight: 700, margin: '2px 0 6px', color: 'var(--dark)' }}>
          {business.name}
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            margin: '0 0 14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {business.description}
        </p>

        {/* Footer Meta & Action */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icons.MapPin style={{ width: 12, height: 12, color: 'var(--primary)' }} />
            Desa Banjarsari
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Lihat Profil Toko <Icons.ArrowRight style={{ width: 14, height: 14 }} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
