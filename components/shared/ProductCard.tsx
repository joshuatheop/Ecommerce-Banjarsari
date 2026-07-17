'use client';

import Link from 'next/link';
import type { ProdukItem } from '@/lib/firestore/types';
import { Icons } from './Icons';

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
    <Link href={`/produk/${product.id}`} className="fl-card">
      {/* Thumbnail */}
      <div className="fl-card-thumb">
        <div className="fl-card-placeholder">
          <span>{product.category}</span>
        </div>
        <button className="fl-card-fav" aria-label="Favorit" onClick={(e) => e.preventDefault()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {product.clickCount > 300 && (
          <div className="fl-card-hot-badge">
            <Icons.Flame style={{ width: 10, height: 10 }} />
            Terpopuler
          </div>
        )}
      </div>

      {/* Body */}
      <div className="fl-card-body">
        <div className="fl-card-brand">{businessName}</div>
        <div className="fl-card-name">{product.name}</div>
        <div className="fl-card-meta">
          <span className="fl-card-cat">{product.category}</span>
        </div>
        <div className="fl-card-price">{formatPrice(product.price)}</div>
        <div className="fl-card-clicks" suppressHydrationWarning>
          <Icons.Flame style={{ color: '#CDFF00', width: 11, height: 11 }} />
          {product.clickCount.toLocaleString('id-ID')} klik
        </div>
      </div>

    </Link>
  );
};

export default ProductCard;
