'use client';

import Link from 'next/link';
import type { ServiceItem } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';
import { useFavorites } from '@/context/FavoritesContext';

interface ServiceCardProps {
  service: ServiceItem;
  businessName: string;
  categoryName?: string;
}

const ServiceCard = ({ service, businessName, categoryName }: ServiceCardProps) => {
  const displayCategory = categoryName || service.category_id;
  const priceDisplay = getServicePriceDisplay(service);
  const { isServiceFavorited, toggleServiceFav, getLikes } = useFavorites();

  const isFav = isServiceFavorited(service.service_id);
  const currentLikes = getLikes(service.service_id, service.like_count ?? 0);

  const handleFavClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleServiceFav(service.service_id, service.like_count ?? 0);
  };

  return (
    <Link href={`/layanan/${service.service_id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        {service.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.thumbnail_url} alt={service.service_name} className="fl-card-img" />
        ) : (
          <div className="fl-card-placeholder">
            <span>{displayCategory}</span>
          </div>
        )}
        <div className="fl-card-service-badge">JASA</div>
        <button
          className={`fl-card-fav ${isFav ? 'active' : ''}`}
          aria-label={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          aria-pressed={isFav}
          onClick={handleFavClick}
          style={{
            color: isFav ? '#e11d48' : 'currentColor',
            background: isFav ? 'rgba(225, 29, 72, 0.15)' : undefined,
            borderColor: isFav ? '#e11d48' : undefined,
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isFav ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isFav ? '#e11d48' : 'none'}
            stroke={isFav ? '#e11d48' : 'currentColor'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="fl-card-brand">{businessName}</div>
          {currentLikes > 0 && (
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#e11d48', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              ❤️ {currentLikes}
            </span>
          )}
        </div>
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
