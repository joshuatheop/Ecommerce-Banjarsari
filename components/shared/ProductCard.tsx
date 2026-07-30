'use client';

import Link from 'next/link';
import type { Product, ProdukItem } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ProductCardProps {
  product: Product | ProdukItem | any;
  businessName: string;
  businessArea?: string;
  categoryName?: string;
}

const formatPrice = (price: number) => {
  if (!price) return 'Rp 0';
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
};

const ProductCard = ({ product, businessName, businessArea, categoryName }: ProductCardProps) => {
  const pId = product.id || product.product_id || '';
  const pName = product.name || product.product_name || '';
  const pPrice = product.price ?? product.product_price ?? 0;
  const pCategory = categoryName || product.category || product.category_id || '';
  const pClicks = product.clickCount ?? 0;

  const imageUrl = (product.imageUrls && product.imageUrls[0]) || (product.Gallery_Images && product.Gallery_Images[0]) || product.thumbnail_url;

  return (
    <Link href={`/produk/${pId}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt={pName} className="fl-card-img" />
        ) : (
          <div className="fl-card-placeholder">
            <span>{pCategory}</span>
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
        {pClicks > 300 && (
          <div className="fl-card-hot-badge">
            <Icons.Flame style={{ width: 10, height: 10 }} />
            Terpopuler
          </div>
        )}
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div className="fl-card-brand">{businessName}</div>
        <div className="fl-card-name">{pName}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{pCategory}</span>
          {businessArea && (
            <span className="fl-card-area" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
              <Icons.MapPin style={{ width: 11, height: 11 }} /> {businessArea}
            </span>
          )}
        </div>
        <div className="fl-card-price">{formatPrice(pPrice)}</div>
        <div className="fl-card-clicks" suppressHydrationWarning>
          <Icons.Flame style={{ color: '#CDFF00', width: 11, height: 11 }} />
          {pClicks.toLocaleString('id-ID')} klik
        </div>
        <div className="fl-card-price">{formatPrice(product.product_price)}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
