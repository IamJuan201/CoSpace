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
    const startTime = new Date(String(data.get("startTime")));
    const endTime = new Date(String(data.get("endTime")));
    const durationHours = (endTime.getTime() - startTime.getTime()) / (60 * 60 * 1000);

    if (
      startTime.getMinutes() !== 0 ||
      !Number.isInteger(durationHours) ||
      durationHours < 1 ||
      durationHours > 4
    ) {
      setError(t("invalidDuration"));
      return;
    }

    setBusy(true);
    setError("");
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          spaceId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("error"));
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-(--line) bg-(--surface-muted) p-4">
      <h2 className="font-semibold text-(--ink)">{t("title")}</h2>
      <p className="text-xs text-(--muted)">{t("timeRule")}</p>
      <label className="grid gap-1 text-sm text-(--muted)">{t("start")}<input name="startTime" type="datetime-local" step={3600} required className="rounded-xl border border-(--line) bg-(--surface) px-3 py-3 text-(--ink) outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent-soft)" /></label>
      <label className="grid gap-1 text-sm text-(--muted)">{t("end")}<input name="endTime" type="datetime-local" step={3600} required className="rounded-xl border border-(--line) bg-(--surface) px-3 py-3 text-(--ink) outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent-soft)" /></label>
      {error && <p role="alert" className="text-sm text-(--danger-ink)">{error}</p>}
      <Button disabled={busy}>{busy ? t("submitting") : t("submit")}</Button>
      {!isAuthenticated && <p className="text-center text-xs text-(--muted)">{t("loginPrompt")} <Link href="/login" className="font-semibold text-(--accent-deep) hover:underline">{tAuth("loginLink")}</Link></p>}
    </form>
  );
}
