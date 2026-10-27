import type { ReactElement } from "react";
import { Space } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button-styles";
import SpaceImage from "./SpaceImage";

interface SpaceCardProps {
  space: Space;
}

export default function SpaceCard({ space }: SpaceCardProps): ReactElement {
  const t = useTranslations("Spaces");
  const tTypes = useTranslations("SpaceTypes");
  const format = useFormatter();

  const price = format.number(space.pricePerHour, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-[0_1px_3px_rgba(11,28,48,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(11,28,48,0.1)]">
      <div className="relative">
        <SpaceImage
          src={space.imageUrl}
          alt={space.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-5/3 transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {space.isActive && <span className="absolute left-3 top-3 rounded-full bg-[#ffffffed] px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm">● {t("available")}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--accent-deep)">
          {tTypes(space.type)}
        </span>
        <h3 className="text-lg font-bold tracking-tight text-(--ink)">{space.name}</h3>
        <p className="line-clamp-2 min-h-10 flex-1 text-sm leading-5 text-(--muted)">{space.description}</p>
        <div className="mt-2 flex items-end justify-between gap-3 border-t border-[#eff4ff] pt-4">
          <p className="font-bold text-(--ink)">
            <span className="text-xl">{price}</span> <span className="text-xs font-normal text-(--muted)">{t("perHour")}</span>
          </p>
          <Link href={`/spaces/${space.id}`} className={`${buttonClasses("primary")} rounded-lg! bg-(--accent-deep)! px-4! py-2.5! hover:bg-(--accent)!`}>
            {t("bookNow")} <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}