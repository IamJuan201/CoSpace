"use client";

import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";

type Theme = "light" | "dark";

const THEME_CHANGE_EVENT = "cospace-theme-change";

function subscribeToTheme(onStoreChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle(): ReactElement {
  const t = useTranslations("Nav");
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme(): void {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("cospace-theme", nextTheme);
    } catch {
      // Keep the selected theme active for this page even if storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      aria-pressed={isDark}
      title={isDark ? t("switchToLight") : t("switchToDark")}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--line) bg-(--surface) text-(--ink) transition hover:bg-(--sage) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:h-9 sm:w-9"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]" aria-hidden="true">
          <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2.5v2m0 15v2M4.1 4.1l1.4 1.4m13 13 1.4 1.4M2.5 12h2m15 0h2M4.1 19.9l1.4-1.4m13-13 1.4-1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]" aria-hidden="true">
          <path d="M20.2 15.4A8.6 8.6 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 4.5v3m-1.5-1.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
