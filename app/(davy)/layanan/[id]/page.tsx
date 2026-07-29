import { getService, getBusiness } from "@/lib/firestore/data-loader";
import ServiceDetailClient from "./ServiceDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeoMeta, autoGenerateSeo } from "@/lib/firestore/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);
  if (!service) return {};

  const business = await getBusiness(service.business_id);
  const seo = await getSeoMeta('service', id);
  const fallback = autoGenerateSeo(
    service.service_name,
    service.service_description ?? null,
    business?.business_name ?? null
  );

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://umkm-banjarsari.com';

  return {
    title:       seo?.title       || fallback.title,
    description: seo?.description || fallback.description,
    openGraph: {
      title:       seo?.ogTitle       || seo?.title       || fallback.title,
      description: seo?.ogDescription || seo?.description || fallback.description,
      url:         `${BASE_URL}/layanan/${id}`,
      type:        'website',
      siteName:    'UMKM Banjarsari',
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.id);

  if (!service) {
    notFound();
  }

  const business = await getBusiness(service.business_id);

  return <ServiceDetailClient service={service} business={business} />;
}
