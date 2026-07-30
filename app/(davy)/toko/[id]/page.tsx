import { getBusiness, getProductsByBusiness, getServicesByBusiness } from "@/lib/firestore/data-loader";
import BusinessProfileClient from "./BusinessProfileClient";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache for 60s

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const business = await getBusiness(resolvedParams.id);

  if (!business) {
    notFound();
  }

  const products = await getProductsByBusiness(business.id);
  const services = await getServicesByBusiness(business.id);

  return (
    <BusinessProfileClient
      business={business}
      products={products}
      services={services}
    />
  );
}
