import type { ReactElement } from "react";
import { setRequestLocale } from "next-intl/server";
import AdminSpaces from "@/components/admin/AdminSpaces";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminSpaces />;
}
