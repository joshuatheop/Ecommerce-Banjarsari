'use client';

import Link from 'next/link';
import type { ServiceItem } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';

interface ServiceCardProps {
  service: ServiceItem;
  businessName: string;
  categoryName?: string;
}


const ServiceCard = ({ service, businessName, categoryName }: ServiceCardProps) => {
  const displayCategory = categoryName || service.category_id;
  const priceDisplay = getServicePriceDisplay(service);

  return (
    <Link href={`/layanan/${service.service_id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        {service.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.thumbnail_url} alt={service.service_name} className="fl-rank-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="fl-card-placeholder">
            <span>{displayCategory.substring(0, 2)}</span>
          </div>
        )}
        <button className="fl-card-fav" aria-label="Favorit" onClick={(e) => e.preventDefault()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="fl-card-service-badge">JASA</div>
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div className="fl-card-brand">{businessName}</div>
        <div className="fl-card-name">{service.service_name}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{displayCategory}</span>
        </div>
        <div className="fl-card-price">{priceDisplay}</div>
      </div>

    </Link>
  );
};

export default ServiceCard;

