"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import type { Role } from "@prisma/client";

interface AccountMenuProps {
  name: string;
  role: Role;
}

export default function AccountMenu({ name, role }: AccountMenuProps): ReactElement {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const initial = name.trim().charAt(0).toLocaleUpperCase() || "?";

  async function logout(): Promise<void> {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("Logout failed");
      setOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex max-w-52 items-center gap-2 rounded-full border border-[#e5eeff] bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-(--ink) transition hover:bg-[#eff4ff]"
      >
        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--ink) text-sm font-bold text-white">
          {initial}
        </span>
        <span className="truncate">{name}</span>
        <span aria-hidden="true" className="text-xs">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-[#e5eeff] bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-sm font-semibold text-(--ink)">{name}</p>
          <div className="my-1 border-t border-[#e5eeff]" />
          <Link
            role="menuitem"
            href={role === "ADMIN" ? "/admin" : "/dashboard"}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-(--muted) hover:bg-[#eff4ff] hover:text-(--ink)"
          >
            {role === "ADMIN" ? t("admin") : t("dashboard")}
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => void logout()}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-(--accent-deep) hover:bg-(--accent-soft) disabled:opacity-50"
          >
            {busy ? t("loggingOut") : t("logout")}
          </button>
          {error && <p role="alert" className="px-3 py-1 text-xs text-red-700">{t("logoutError")}</p>}
        </div>
      )}
    </div>
  );
}
