"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api-fetch";
import LocalDateTime from "@/components/LocalDateTime";

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  space: { name: string; type: string };
}

export default function Dashboard(): ReactElement {
  const t = useTranslations("Dashboard");
  const format = useFormatter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(): Promise<void> {
    try {
      setBookings(await apiFetch<Booking[]>("/api/bookings"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("loadError"));
    }
  }

  useEffect(() => {
    void apiFetch<Booking[]>("/api/bookings")
      .then(setBookings)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : t("loadError")));
  }, [t]);

  async function cancel(id: string): Promise<void> {
    setBusyId(id);
    setError("");
    try {
      await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("loadError"));
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-(--ink)">{t("title")}</h1>
      {error && <p role="alert" className="mb-4 rounded-xl bg-(--danger-surface) p-3 text-sm text-(--danger-ink)">{error}</p>}
      {bookings.length === 0 ? <p className="text-(--muted)">{t("empty")}</p> : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--line) bg-(--surface) p-5 shadow-sm">
              <div>
                <h2 className="font-semibold text-(--ink)">{booking.space.name}</h2>
                <p className="text-sm text-(--muted)"><LocalDateTime value={booking.startTime} /> – <LocalDateTime value={booking.endTime} dateStyle="short" /></p>
                <p className="mt-1 text-sm text-(--muted)">{format.number(booking.totalPrice, { style: "currency", currency: "USD" })} · {t(`status.${booking.status}`)}</p>
              </div>
              {booking.status === "CONFIRMED" && <button type="button" disabled={busyId === booking.id} onClick={() => void cancel(booking.id)} className="rounded-lg border border-(--line) px-3 py-2 text-sm font-medium text-(--accent-deep) transition-colors hover:bg-(--accent-soft) disabled:opacity-50">{t("cancel")}</button>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
