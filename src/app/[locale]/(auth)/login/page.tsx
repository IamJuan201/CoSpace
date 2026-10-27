import type { ReactElement } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");
  return <><span aria-hidden="true" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--ink) text-xl font-bold text-white">C</span><h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-(--ink)">{t("loginTitle")}</h1><p className="mb-7 text-center text-sm leading-6 text-(--muted)">{t("loginSubtitle")}</p><AuthForm mode="login" /><p className="mt-6 border-t border-[#e5eeff] pt-5 text-center text-sm text-(--muted)">{t("noAccount")} <Link href="/register" className="font-semibold text-(--accent-deep) hover:underline">{t("registerLink")}</Link></p></>;
}
