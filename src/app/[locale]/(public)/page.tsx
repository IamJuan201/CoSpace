import Image from "next/image";
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
      <section className="relative isolate overflow-hidden bg-(--canvas)">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 -z-10 h-[520px] w-[520px] rounded-full bg-(--surface-sage) opacity-70 blur-3xl" />
        <div className="mx-auto grid max-w-360 items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[.94fr_1.06fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-(--line) bg-(--surface)/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-(--ink) sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-(--accent)" />{t("eyebrow")}
            </span>
            <h1 className="max-w-[720px] text-[42px] font-semibold leading-[1.04] tracking-[-0.055em] text-(--ink) sm:text-6xl lg:text-[68px]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-(--muted) sm:text-lg sm:leading-8">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/spaces" className={`${buttonClasses("primary")} rounded-full! bg-(--accent-action)! px-6! py-3.5! text-sm! shadow-[0_8px_20px_rgba(168,71,37,.17)]`}>
                {t("cta")} <span aria-hidden="true" className="ml-2 text-lg leading-none">↗</span>
              </Link>
              <span className="text-sm font-medium text-(--muted)">{t("heroNote")}</span>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-(--line) pt-5">
              <HeroMetric value="07–21" label={t("hoursLabel")} />
              <HeroMetric value="01—04h" label={t("durationLabel")} />
              <HeroMetric value="3" label={t("optionsLabel")} />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[720px] lg:ml-auto">
            <div className="relative aspect-[1.04/1] overflow-hidden rounded-[28px] bg-(--surface-muted) shadow-[0_28px_70px_rgba(23,37,31,.18)] sm:aspect-[1.15/1] lg:aspect-[.98/1]">
              <Image
                src="https://images.pexels.com/photos/26966416/pexels-photo-26966416.jpeg?auto=compress&cs=tinysrgb&w=1800"
                alt={t("photoAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142019]/55 via-transparent to-[#142019]/5" />
              <div className="absolute left-5 top-5 rounded-full border border-(--line) bg-(--surface-floating)/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-(--ink) shadow-sm backdrop-blur sm:left-7 sm:top-7">
                {t("imageBadge")}
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-(--surface-floating)/95 p-5 shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-auto sm:w-[360px] sm:p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--accent-deep)">{t("cardEyebrow")}</span>
                <p className="mt-2 text-xl font-semibold leading-tight tracking-[-0.03em] text-(--ink) sm:text-2xl">{t("cardTitle")}</p>
                <div className="mt-4 flex items-center justify-between border-t border-(--line) pt-3 text-xs text-(--muted)">
                  <span>{t("cardCaption")}</span><span aria-hidden="true" className="text-base text-(--accent-deep)">↗</span>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -bottom-5 -right-3 -z-10 h-32 w-32 rounded-full border border-(--line) sm:-right-6 sm:h-40 sm:w-40" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-(--accent-deep)">{t("sectionEyebrow")}</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.045em] text-(--ink) sm:text-4xl">{t("typesTitle")}</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-(--muted)">{t("sectionSubtitle")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.values(SpaceType).map((type, index) => (
            <article key={type} className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-[22px] border border-(--line) bg-(--surface) p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,37,31,.09)] sm:p-7">
              <div className="flex items-start justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-(--surface-sage) text-(--ink)" : "bg-(--surface-terra) text-(--accent-deep)"}`}>
                  <SpaceIcon type={type} />
                </span>
                <span className="text-xs font-semibold tracking-[0.14em] text-(--muted)">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-(--ink)">{tTypes(type)}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-(--muted)">{t(`typeDescriptions.${type}`)}</p>
              <Link href="/spaces" aria-label={`${t("exploreType")} ${tTypes(type)}`} className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-(--accent-deep)">
                {t("exploreType")} <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-16 overflow-hidden rounded-[28px] bg-[#17251f] text-[#f7f5ef] sm:mx-6 sm:mb-20 lg:mx-auto lg:mb-24 lg:max-w-[calc(1440px-80px)]">
        <div className="relative flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-32 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#e5a184]">{t("closingEyebrow")}</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{t("closingTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">{t("closingSubtitle")}</p>
          </div>
          <Link href="/spaces" className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-[#f1e5d8] px-6 py-3.5 text-sm font-semibold text-[#17251f] transition-colors hover:bg-white">
            {t("cta")} <span aria-hidden="true" className="ml-2 text-lg leading-none">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }): ReactElement {
  return (
    <div className="pr-3 sm:pr-5">
      <span className="block text-lg font-semibold tracking-tight text-(--ink) sm:text-xl">{value}</span>
      <span className="mt-1 block text-[10px] leading-4 text-(--muted) sm:text-xs">{label}</span>
    </div>
  );
}

function SpaceIcon({ type }: { type: SpaceType }): ReactElement {
  if (type === SpaceType.MEETING_ROOM) {
    return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M4 8h16v10H4zM8 8V5h8v3M7 18v2m10-2v2M2 12h2m16 0h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (type === SpaceType.CABIN) {
    return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M5 20V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M3 20h18M9 20v-5a3 3 0 0 1 6 0v5M8 9h.01M16 9h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M4 19h16M6 19v-7h12v7M8 12V8h8v4M10 8V5h4v3M8 15h.01M16 15h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
