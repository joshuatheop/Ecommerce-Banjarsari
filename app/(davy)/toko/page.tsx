import { getBusinesses } from "@/lib/firestore/data-loader";
import TokoDirectoryClient from "./TokoDirectoryClient";

export const revalidate = 60;

export default async function TokoDirectoryPage() {
  const businesses = await getBusinesses();

  return <TokoDirectoryClient businesses={businesses} />;
}
