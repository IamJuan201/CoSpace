import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getActiveSpaceById } from "@/lib/spaces";
import { getCurrentUser } from "@/lib/current-user";
import SpaceImage from "@/components/spaces/SpaceImage";
import BookingForm from "@/components/spaces/BookingForm";

interface SpaceDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SpaceDetailPage({
  params,
}: SpaceDetailPageProps): Promise<ReactElement> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const space = await getActiveSpaceById(id);
  if (!space) notFound();
  const currentUser = await getCurrentUser();

  const t = await getTranslations("Spaces");
  const tTypes = await getTranslations("SpaceTypes");
  const format = await getFormatter();

  const price = format.number(space.pricePerHour, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link href="/spaces" className="text-sm font-semibold text-(--accent-deep) hover:underline">
        ← {t("back")}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <SpaceImage
          src={space.imageUrl}
          alt={space.name}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-4/3 rounded-xl"
          priority
        />

        <div className="flex flex-col gap-4 rounded-2xl border border-[#e5eeff] bg-white p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {tTypes(space.type)}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-(--ink)">{space.name}</h1>
          <p className="leading-7 text-(--muted)">{space.description}</p>
          <p className="text-2xl font-bold text-(--ink)">
            {price} <span className="text-base font-normal text-zinc-500">{t("perHour")}</span>
          </p>
          <BookingForm spaceId={space.id} isAuthenticated={Boolean(currentUser)} />
        </div>
      </div>
    </section>
  );
}
