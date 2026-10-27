import type { ReactElement } from "react";
import { SpaceType } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button-styles";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tTypes = await getTranslations("SpaceTypes");

  return (
    <>
      <section className="bg-(--canvas)">
        <div className="mx-auto flex max-w-360 flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <span className="rounded-full bg-(--accent-soft) px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-(--accent-deep)">CoSpace · {t("typesTitle")}</span>
          <h1 className="max-w-3xl text-[38px] font-bold leading-[1.12] tracking-[-0.035em] text-(--ink) sm:text-6xl">{t("title")}</h1>
          <p className="max-w-2xl text-lg leading-7 text-(--muted)">{t("subtitle")}</p>
          <Link href="/spaces" className={`${buttonClasses("primary")} rounded-xl! px-6! py-3! text-base`}>
            {t("cta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-16 sm:px-6 lg:px-10">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-(--ink)">{t("typesTitle")}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {Object.values(SpaceType).map((type) => (
            <div key={type} className="rounded-2xl border border-[#e5eeff] bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-(--ink)">{tTypes(type)}</h3>
              <p className="text-sm leading-6 text-(--muted)">{t(`typeDescriptions.${type}`)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}