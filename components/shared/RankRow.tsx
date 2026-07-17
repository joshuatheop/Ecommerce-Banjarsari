'use client';

import Link from 'next/link';
import type { Product, Service } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface RankRowProps {
  rank: number;
  item: Product | Service;
  type: 'product' | 'service';
  businessName: string;
}

export default function RankRow({ rank, item, type, businessName }: RankRowProps) {
  const href = type === 'product' ? `/produk/${item.id}` : `/layanan/${item.id}`;
  const firstImage = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;

  return (
    <Link href={href} className="fl-rank-row">
      <div className={`fl-rank-num rank-${rank}`}>
        {rank}
      </div>

      <div className="fl-rank-thumb">
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstImage} alt={item.name} className="fl-rank-img" />
        ) : (
          <div className="fl-rank-placeholder">
            <span>{item.category ? item.category.substring(0, 2) : 'Pal'}</span>
          </div>
        )}
      </div>

      <div className="fl-rank-info">
        <h4 className="fl-rank-title">{item.name}</h4>
        <p className="fl-rank-business">{businessName}</p>
      </div>

      <div className="fl-rank-stats">
        <div className="fl-rank-clicks">
          <Icons.Flame style={{ color: 'var(--accent-y)', width: 12, height: 12 }} />
          <span>{item.clickCount.toLocaleString('id-ID')}</span>
        </div>
        <div className="fl-rank-label">klik</div>
      </div>
    </Link>
  );
}
