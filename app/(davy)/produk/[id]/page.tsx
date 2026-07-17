import { getProduct, getBusiness } from "@/lib/firestore/data-loader";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache details for 60 seconds

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const business = await getBusiness(product.businessId);

  return <ProductDetailClient product={product} business={business} />;
}
