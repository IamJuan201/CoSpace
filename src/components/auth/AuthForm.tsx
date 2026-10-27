"use client";

import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api-fetch";
import Button from "@/components/ui/Button";

interface AuthFormProps {
  mode: "login" | "register";
}

interface AuthResponse {
  user: { role: "USER" | "ADMIN" };
}

export default function AuthForm({ mode }: AuthFormProps): ReactElement {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await apiFetch<AuthResponse>(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({
          ...(isRegister ? { name: data.get("name") } : {}),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      router.replace(response.user.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("genericError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {isRegister && (
        <label className="block space-y-1 text-sm font-medium text-zinc-700">
          {t("name")}
          <input name="name" autoComplete="name" required className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" />
        </label>
      )}
      <label className="block space-y-1 text-sm font-medium text-zinc-700">
        {t("email")}
        <input name="email" type="email" autoComplete="email" required className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" />
      </label>
      <label className="block space-y-1 text-sm font-medium text-zinc-700">
        {t("password")}
        <input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} required className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-3 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-[#ffdbce]" />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full rounded-xl! bg-(--accent-deep)! py-3! hover:bg-(--accent)!">{busy ? t("submitting") : t(isRegister ? "register" : "login")}</Button>
    </form>
  );
}
