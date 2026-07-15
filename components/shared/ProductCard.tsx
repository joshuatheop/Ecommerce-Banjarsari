import Link from 'next/link';
import type { ProdukItem } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ProductCardProps {
  product: ProdukItem;
  businessName: string;
  categoryName?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const ProductCard = ({ product, businessName, categoryName }: ProductCardProps) => {
  const displayCategory = categoryName || product.category_id;

  return (
    <Link href={`/produk/${product.product_id}`} className="card product-card">
      {/* Thumbnail */}
      <div className="thumb">
        {product.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail_url}
            alt={product.product_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <div className="thumb-placeholder">
            <span>{displayCategory}</span>
          </div>
        )}
        <div className="badge">{displayCategory}</div>
        <div className="fav" aria-label="Favorit">♡</div>
      </div>

      {/* Body */}
      <div className="body">
        <div className="cat-label">{displayCategory}</div>
        <h3>{product.product_name}</h3>
        <div className="owner">oleh {businessName}</div>

        <div className="price-row">
          <div className="price">{formatPrice(product.product_price)}</div>
          {product.whatsapp_number && (
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

export default ProductCard;
