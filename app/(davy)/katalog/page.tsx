import { getProducts, getServices, getBusinesses, getCategories } from "@/lib/firestore/data-loader";
import { mockAreas } from "@/lib/firestore/mock-data";
import CatalogContainer from "@/components/shared/CatalogContainer";

export const revalidate = 60; // Cache for 60 seconds

interface PageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Resolve params
  const initialType = params.type === "service" ? "service" : "product";
  const initialCategory = params.category || "";
  const initialQuery = params.q || "";

  // Fetch data on server
  const [products, services, businesses, categories] = await Promise.all([
    getProducts(),
    getServices(),
    getBusinesses(),
    getCategories(),
  ]);

  return (
    <CatalogContainer
      products={products}
      services={services}
      businesses={businesses}
      categories={categories}
      areas={mockAreas}
      initialType={initialType}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  );
}