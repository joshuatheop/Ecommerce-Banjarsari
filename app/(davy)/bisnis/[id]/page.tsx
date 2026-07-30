import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BisnisPageAlias({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/toko/${resolvedParams.id}`);
}
