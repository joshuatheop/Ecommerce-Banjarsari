import Link from 'next/link';
import type { ServiceItem } from '@/lib/firestore/types';
import { getServicePriceDisplay } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ServiceCardProps {
  service: ServiceItem;
  businessName: string;
  categoryName?: string;
}

const ServiceCard = ({ service, businessName, categoryName }: ServiceCardProps) => {
  const displayCategory = categoryName || service.category_id;
  const priceDisplay    = getServicePriceDisplay(service);

  return (
    <Link href={`/layanan/${service.service_id}`} className="card product-card">
      {/* Thumbnail */}
      <div className="thumb">
        <div className="thumb-placeholder">
          <span>{displayCategory}</span>
        </div>
        <div className="badge" style={{ background: 'var(--secondary)', color: 'var(--dark)' }}>
          Jasa
        </div>
      </div>

      {/* Body */}
      <div className="body">
        <div className="cat-label">{displayCategory}</div>
        <h3>{service.service_name}</h3>
        <div className="owner">oleh {businessName}</div>

        <div className="price-row">
          <div className="price" style={{ fontSize: 14 }}>{priceDisplay}</div>
          {service.whatsapp_number && (
            <div className="clicks">
              <Icons.Flame style={{ color: 'var(--accent-y)' }} />
              WA
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
