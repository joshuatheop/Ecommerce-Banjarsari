import { notFound } from 'next/navigation';
import { getBisnisById } from '@/lib/firestore/bisnis';
import { getProducts, getServices, getCategories } from '@/lib/firestore/data-loader';
import type { ProdukItem, ServiceItem } from '@/lib/firestore/types';
import BusinessDetailClient from './BusinessDetailClient';

export const dynamic = 'force-dynamic';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({ params }: BusinessPageProps) {
  const { id } = await params;
  const [business, allProducts, allServices, categories] = await Promise.all([
    getBisnisById(id),
    getProducts(),
    getServices(),
    getCategories(),
  ]);

  if (!business) {
    notFound();
  }

  const businessProducts = allProducts.filter((p: ProdukItem) => p.business_id === id);
  const businessServices = allServices.filter((s: ServiceItem) => s.business_id === id);

  return (
    <BusinessDetailClient
      business={business}
      products={businessProducts}
      services={businessServices}
      categories={categories}
    />
  );
}
