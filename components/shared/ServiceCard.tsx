'use client';

import Link from 'next/link';
import type { ServiceItem } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ServiceCardProps {
  service: ServiceItem;
  businessName: string;
  categoryName?: string;
}

const formatPrice = (price: number) => {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
};

const ServiceCard = ({ service, businessName }: ServiceCardProps) => {

  return (
    <Link href={`/layanan/${service.id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        <div className="fl-card-placeholder">
          <span>{service.category}</span>
        </div>
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
        <div className="fl-card-name">{service.name}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{service.category}</span>
        </div>
        <div className="fl-card-price">{service.priceRange || formatPrice(service.price)}</div>
        <div className="fl-card-clicks" suppressHydrationWarning>
          <Icons.Flame style={{ color: '#CDFF00', width: 11, height: 11 }} />
          {service.clickCount.toLocaleString('id-ID')} klik
        </div>
      </div>

    </Link>
  );
};

export default ServiceCard;

