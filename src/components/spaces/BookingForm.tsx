"use client";

import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api-fetch";
import Button from "@/components/ui/Button";

interface BookingFormProps {
  spaceId: string;
  isAuthenticated: boolean;
}

export default function BookingForm({ spaceId, isAuthenticated }: BookingFormProps): ReactElement {
  const t = useTranslations("Booking");
  const tAuth = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          spaceId,
          startTime: new Date(String(data.get("startTime"))).toISOString(),
          endTime: new Date(String(data.get("endTime"))).toISOString(),
        }),
      });
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("error"));
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="font-semibold text-zinc-900">{t("title")}</h2>
      <label className="grid gap-1 text-sm text-(--muted)">{t("start")}<input name="startTime" type="datetime-local" step={3600} required className="rounded-xl border border-[#c6c6cd] bg-white px-3 py-3 outline-none focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" /></label>
      <label className="grid gap-1 text-sm text-(--muted)">{t("end")}<input name="endTime" type="datetime-local" step={3600} required className="rounded-xl border border-[#c6c6cd] bg-white px-3 py-3 outline-none focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <Button disabled={busy} className="bg-(--accent-deep)! hover:bg-(--accent)!">{busy ? t("submitting") : t("submit")}</Button>
      {!isAuthenticated && <p className="text-center text-xs text-zinc-600">{t("loginPrompt")} <Link href="/login" className="font-semibold text-(--accent-deep) hover:underline">{tAuth("loginLink")}</Link></p>}
    </form>
  );
}
