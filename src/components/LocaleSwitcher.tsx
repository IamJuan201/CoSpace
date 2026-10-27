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
    <div className="flex gap-1">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={locale === currentLocale}
          onClick={() => router.replace(pathname, { locale })}
          className="rounded-md px-2 py-1 text-xs font-semibold text-(--muted) transition-colors aria-pressed:bg-white aria-pressed:text-(--ink) aria-pressed:shadow-sm"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}