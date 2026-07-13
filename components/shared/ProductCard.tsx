import Link from 'next/link';
import type { Product } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ProductCardProps {
  product: Product;
  businessName: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const ProductCard = ({ product, businessName }: ProductCardProps) => {
  return (
    <Link href={`/produk/${product.id}`} className="card product-card">
      {/* Thumbnail */}
      <div className="thumb">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <div className="thumb-placeholder">
            <span>{product.category}</span>
          </div>
        )}
        <div className="badge">{product.category}</div>
        <div className="fav" aria-label="Favorit">♡</div>
      </div>

      {/* Body */}
      <div className="body">
        <div className="cat-label">{product.category}</div>
        <h3>{product.name}</h3>
        <div className="owner">oleh {businessName}</div>

        <div className="price-row">
          <div className="price">{formatPrice(product.price)}</div>
          <div className="clicks">
            <Icons.Flame style={{ color: 'var(--accent-y)' }} />
            {product.clickCount.toLocaleString('id-ID')} klik
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
