import Link from 'next/link';
import type { Service } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ServiceCardProps {
  service: Service;
  businessName: string;
}

const ServiceCard = ({ service, businessName }: ServiceCardProps) => {
  return (
    <Link href={`/layanan/${service.id}`} className="card product-card">
      {/* Thumbnail */}
      <div className="thumb">
        {service.imageUrls && service.imageUrls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <div className="thumb-placeholder">
            <span>{service.category}</span>
          </div>
        )}
        <div className="badge" style={{ background: 'var(--secondary)', color: 'var(--dark)' }}>
          Jasa
        </div>
      </div>

      {/* Body */}
      <div className="body">
        <div className="cat-label">{service.category}</div>
        <h3>{service.name}</h3>
        <div className="owner">oleh {businessName}</div>

        <div className="price-row">
          <div className="price" style={{ fontSize: 14 }}>{service.priceRange || `Rp ${service.price.toLocaleString('id-ID')}`}</div>
          <div className="clicks">
            <Icons.Flame style={{ color: 'var(--accent-y)' }} />
            {service.clickCount.toLocaleString('id-ID')} klik
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
