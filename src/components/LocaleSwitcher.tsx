"use client";

import type { ReactElement } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher(): ReactElement {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex shrink-0 gap-0.5">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={locale === currentLocale}
          onClick={() => router.replace(pathname, { locale })}
          className="rounded-md px-1.5 py-1 text-[11px] font-semibold text-(--muted) transition-colors aria-pressed:bg-(--surface) aria-pressed:text-(--ink) aria-pressed:shadow-sm sm:px-2 sm:text-xs"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
