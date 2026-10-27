import type { ReactElement } from "react";
import SpacesCatalog from "@/components/SpacesCatalog";

interface SpacesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SpacesPage({ params }: SpacesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  return <SpacesCatalog locale={locale} />;
}