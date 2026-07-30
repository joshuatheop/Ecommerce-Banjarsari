'use client';

import { Icons } from './Icons';
import { sanitizeCoordinates } from '@/lib/firestore/data-loader';

interface EmbeddedMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
  address: string;
  height?: number | string;
}

export default function EmbeddedMap({
  latitude: rawLatitude,
  longitude: rawLongitude,
  businessName,
  address,
  height = 320,
}: EmbeddedMapProps) {
  const { latitude, longitude } = sanitizeCoordinates(rawLatitude, rawLongitude, businessName);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Map Frame Container */}
      <div style={{ position: 'relative', width: '100%', height }}>
        <iframe
          title={`Peta Lokasi ${businessName}`}
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Badge Overlay: Title & Coordinates */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(5, 71, 43, 0.9)',
            color: 'var(--white)',
            padding: '6px 12px',
            borderRadius: 'var(--radius)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Icons.MapPin style={{ color: 'var(--accent-y)', width: 14, height: 14 }} />
          Peta Lokasi Presisi (Google Maps)
        </div>

        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255, 255, 255, 0.92)',
            color: 'var(--dark, #013020)',
            padding: '5px 10px',
            borderRadius: 'var(--radius)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            border: '1px solid var(--line)',
            backdropFilter: 'blur(4px)',
          }}
        >
          Lat: {latitude.toFixed(4)}°, Lng: {longitude.toFixed(4)}°
        </div>
      </div>

      {/* Footer Info & Action */}
      <div style={{ padding: '16px 20px', background: 'var(--surface-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius)',
              background: 'var(--secondary)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Icons.MapPin style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Alamat UMKM
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginTop: 2 }}>
              {address}
            </div>
          </div>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
        >
          <Icons.ExternalLink style={{ width: 16, height: 16 }} /> Petunjuk Arah Google Maps
        </a>
      </div>
    </div>
  );
}
