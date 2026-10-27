import type { ReactElement } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpaceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import SpaceCard from "@/components/spaces/SpaceCard";
import { getActiveSpaces } from "@/lib/spaces";

interface SpacesCatalogProps {
  locale: string;
}

export default async function SpacesCatalog({ locale }: SpacesCatalogProps): Promise<ReactElement> {
  setRequestLocale(locale);
  const t = await getTranslations("Spaces");
  const spaces = await getActiveSpaces();
  const timezone = process.env.BUSINESS_TIMEZONE?.trim() || "America/Bogota";
  const [deskCount, meetingRoomCount, cabinCount] = await Promise.all(
    Object.values(SpaceType).map((type) => prisma.space.count({ where: { type, isActive: true } })),
  );
  const total = deskCount + meetingRoomCount + cabinCount;

  return (
    <section className="min-h-[65vh] bg-(--canvas) pb-20">
      <section className="mx-auto w-full max-w-360 px-4 pb-7 pt-10 sm:px-6 lg:px-10 lg:pt-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--accent-soft) px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-(--accent-deep)">
              <span className="h-2 w-2 rounded-full bg-(--accent)" />{t("live")}
            </span>
            <h1 className="max-w-3xl text-[34px] font-bold leading-[1.13] tracking-[-0.035em] text-(--ink) sm:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted) sm:text-lg">{t("heroSubtitle")}</p>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(11,28,48,0.06)] sm:gap-6 sm:px-5">
            <Metric value={String(deskCount)} label={t("desksAvailable")} />
            <Metric value={String(meetingRoomCount)} label={t("roomsReady")} />
            <Metric value="07–21h" label={t("workingHours")} accent />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10">
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#141b2e] p-5 text-white shadow-sm sm:p-6">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffdbce] text-lg font-bold text-[#571a00]">i</span>
              <div>
                <h2 className="font-semibold tracking-tight">{t("rulesTitle")}</h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-[#dae2fd] sm:text-sm">
                  <span>{t("ruleDuration")}</span><span className="hidden text-white/30 sm:block">•</span>
                  <span>{t("ruleHours")}</span><span className="hidden text-white/30 sm:block">•</span>
                  <span>{t("ruleCancellation")}</span>
                </div>
              </div>
            </div>
            <span className="self-start rounded bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#dae2fd] sm:self-center">{t("checkin")}</span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-(--ink)">{t("listed")}</h2>
            <span className="rounded-full bg-[#dce9ff] px-2.5 py-1 text-xs font-medium text-[#45464d]">{t("availableCount", { count: total })}</span>
          </div>
          <p className="text-xs text-(--muted) sm:text-sm">{t("timezoneLabel")} <span className="font-semibold text-(--ink)">{timezone}</span></p>
        </div>
        {spaces.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center text-(--muted)">{t("empty")}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">{spaces.map((space) => <SpaceCard key={space.id} space={space} />)}</div>
        )}
      </section>
    </section>
  );
}

function Metric({ value, label, accent = false }: { value: string; label: string; accent?: boolean }): ReactElement {
  return <div className="min-w-0 text-center sm:text-left"><span className={`block text-xl font-bold ${accent ? "text-(--accent-deep)" : "text-(--ink)"}`}>{value}</span><span className="block whitespace-nowrap text-[11px] text-(--muted) sm:text-xs">{label}</span></div>;
}
