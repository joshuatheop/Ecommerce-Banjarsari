import Link from "next/link";
import Thumb from "../ui/Thumb";
import { Icons } from "./Icons";
import { Product } from "../../lib/firestore/types";

interface ProductCardProps {
  product: Product;
  businessName: string;
}

export const formatRupiah = (n: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export default function ProductCard({ product, businessName }: ProductCardProps) {
  return (
    <Link href={`/produk/${product.id}`} className="card product-card">
      <Thumb color={product.thumbColor || "#05472B"} label={product.name.slice(0, 3)} />
      <span className="badge">Produk</span>
      
      <div className="body">
        <div className="cat-label">{product.category}</div>
        <h3>{product.name}</h3>
        <div className="owner">
          oleh <span style={{ color: "var(--primary)", fontWeight: 600 }}>{businessName}</span>
        </div>
        
        <div className="price-row">
          <span className="price">
            {formatRupiah(product.price)}
          </span>
          <span className="clicks">
            <Icons.Eye />
            {product.clickCount} klik
          </span>
        </div>
      </div>
    </Link>
  );
}
