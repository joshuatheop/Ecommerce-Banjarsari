import { getProduct, getBusiness } from "@/lib/firestore/data-loader";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeoMeta } from "@/lib/firestore/seo";
import { autoGenerateSeo } from "@/lib/firestore/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const business = await getBusiness(product.business_id);
  const seo = await getSeoMeta('product', id);
  const fallback = autoGenerateSeo(
    product.product_name,
    product.product_description ?? null,
    business?.business_name ?? null
  );

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://umkm-banjarsari.com';

  return {
    title:       seo?.title       || fallback.title,
    description: seo?.description || fallback.description,
    openGraph: {
      title:       seo?.ogTitle       || seo?.title       || fallback.title,
      description: seo?.ogDescription || seo?.description || fallback.description,
      url:         `${BASE_URL}/produk/${id}`,
      type:        'website',
      siteName:    'UMKM Banjarsari',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const business = await getBusiness(product.business_id);

  return <ProductDetailClient product={product} business={business} />;
}
