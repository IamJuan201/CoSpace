"use client";

import type { FormEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api-fetch";
import Button from "@/components/ui/Button";

interface SpaceItem {
  id: string;
  name: string;
  description: string;
  type: "DESK" | "MEETING_ROOM" | "CABIN";
  pricePerHour: number;
  imageUrl: string | null;
  isActive: boolean;
}

const emptyForm = { name: "", description: "", type: "DESK", pricePerHour: "5", imageUrl: "" };

export default function AdminSpaces(): ReactElement {
  const t = useTranslations("Admin");
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(): Promise<void> {
    try { setSpaces(await apiFetch<SpaceItem[]>("/api/spaces?includeInactive=true")); }
    catch (cause) { setError(cause instanceof Error ? cause.message : t("error")); }
  }
  useEffect(() => {
    void apiFetch<SpaceItem[]>("/api/spaces?includeInactive=true")
      .then(setSpaces)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : t("error")));
  }, [t]);

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = { ...form, pricePerHour: Number(form.pricePerHour), imageUrl: form.imageUrl || null };
    try {
      await apiFetch(editing ? `/api/spaces/${editing}` : "/api/spaces", {
        method: editing ? "PATCH" : "POST", body: JSON.stringify(payload),
      });
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : t("error")); }
    finally { setBusy(false); }
  }

  function edit(space: SpaceItem): void {
    setEditing(space.id);
    setForm({ name: space.name, description: space.description, type: space.type, pricePerHour: String(space.pricePerHour), imageUrl: space.imageUrl ?? "" });
  }

  async function toggleActive(space: SpaceItem): Promise<void> {
    try {
      await apiFetch(
        space.isActive ? `/api/spaces/${space.id}/deactivate` : `/api/spaces/${space.id}`,
        space.isActive ? { method: "PATCH" } : { method: "PATCH", body: JSON.stringify({ isActive: true }) },
      );
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : t("error")); }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-(--ink)">{t("title")}</h1>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={save} className="mb-8 grid gap-3 rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm sm:grid-cols-2">
        <input aria-label={t("name")} placeholder={t("name")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3 outline-none focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" />
        <select aria-label={t("type")} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })} className="rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3"><option value="DESK">{t("desk")}</option><option value="MEETING_ROOM">{t("meetingRoom")}</option><option value="CABIN">{t("cabin")}</option></select>
        <textarea aria-label={t("description")} placeholder={t("description")} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3 sm:col-span-2" />
        <input aria-label={t("price")} type="number" min="0.01" step="0.01" required value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} className="rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3" />
        <input aria-label={t("imageUrl")} type="url" placeholder={t("imageUrl")} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3" />
        <div className="flex gap-2 sm:col-span-2"><Button disabled={busy}>{editing ? t("update") : t("create")}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>{t("cancelEdit")}</Button>}</div>
      </form>
      <div className="grid gap-3">{spaces.map((space) => <article key={space.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e5eeff] bg-white p-4"><div><h2 className="font-semibold text-(--ink)">{space.name}</h2><p className="text-sm text-(--muted)">{space.type} · {space.pricePerHour} USD · {space.isActive ? t("active") : t("inactive")}</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => edit(space)}>{t("edit")}</Button><Button variant="secondary" onClick={() => void toggleActive(space)}>{space.isActive ? t("deactivate") : t("reactivate")}</Button></div></article>)}</div>
    </section>
  );
}
