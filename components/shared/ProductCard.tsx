'use client';

import Link from 'next/link';
import type { ProdukItem } from '@/lib/firestore/types';

interface ProductCardProps {
  product: ProdukItem;
  businessName: string;
  categoryName?: string;
}

const formatPrice = (price: number) => {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
};


const ProductCard = ({ product, businessName, categoryName }: ProductCardProps) => {
  const displayCategory = categoryName || product.category_id;

  return (
    <Link href={`/produk/${product.product_id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        {product.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnail_url} alt={product.product_name} className="fl-rank-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div className="fl-card-brand">{businessName}</div>
        <div className="fl-card-name">{product.product_name}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{displayCategory}</span>
        </div>
        <div className="fl-card-price">{formatPrice(product.product_price)}</div>
      </div>

    </Link>
  );
};

export default ProductCard;
