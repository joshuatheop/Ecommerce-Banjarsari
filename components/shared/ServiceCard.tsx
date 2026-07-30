'use client';

import Link from 'next/link';
import type { Service, ServiceItem } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ServiceCardProps {
  service: Service | ServiceItem | any;
  businessName: string;
  businessArea?: string;
  categoryName?: string;
}

const formatPrice = (price: number) => {
  if (!price) return 'Rp 0';
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
};

const ServiceCard = ({ service, businessName, businessArea, categoryName }: ServiceCardProps) => {
  const sId = service.id || service.service_id || '';
  const sName = service.name || service.service_name || '';
  const sPriceDisplay = service.priceRange || (typeof getServicePriceDisplay === 'function' && service.price_type ? getServicePriceDisplay(service) : formatPrice(service.price || 0));
  const sCategory = categoryName || service.category || service.category_id || '';
  const sClicks = service.clickCount ?? 0;

  const imageUrl = (service.imageUrls && service.imageUrls[0]) || (service.Gallery_Images && service.Gallery_Images[0]) || service.thumbnail_url;

  return (
    <Link href={`/layanan/${sId}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt={sName} className="fl-card-img" />
        ) : (
          <div className="fl-card-placeholder">
            <span>{sCategory}</span>
          </div>
        )}
        <button
          className="fl-card-fav"
          aria-label="Favorit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="fl-card-service-badge">JASA</div>
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div className="fl-card-brand">{businessName}</div>
        <div className="fl-card-name">{sName}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{sCategory}</span>
          {businessArea && (
            <span className="fl-card-area" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
              <Icons.MapPin style={{ width: 11, height: 11 }} /> {businessArea}
            </span>
          )}
        </div>
        <div className="fl-card-price">{sPriceDisplay}</div>
        <div className="fl-card-clicks" suppressHydrationWarning>
          <Icons.Flame style={{ color: '#CDFF00', width: 11, height: 11 }} />
          {sClicks.toLocaleString('id-ID')} klik
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
