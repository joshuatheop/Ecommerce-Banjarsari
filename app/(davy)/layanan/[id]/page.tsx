import { getService, getBusiness } from "@/lib/firestore/data-loader";
import ServiceDetailClient from "./ServiceDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache details for 60 seconds

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.id);

  if (!service) {
    notFound();
  }

  const business = await getBusiness(service.businessId);

  return <ServiceDetailClient service={service} business={business} />;
}
