"use client";

import { routing } from "@/i18n/routing";

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const request = () =>
    fetch(input, {
      ...init,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...init.headers },
    });

  let response = await request();
  if (response.status === 401 && !input.includes("/api/auth/")) {
    const refresh = await fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" });
    if (refresh.ok) response = await request();
    else {
      const locale = window.location.pathname.split("/")[1];
      const safeLocale = routing.locales.includes(locale as (typeof routing.locales)[number])
        ? locale
        : routing.defaultLocale;
      window.location.replace(new URL(`/${safeLocale}/login`, window.location.origin).toString());
      throw new ApiError("La sesión ha expirado", 401);
    }
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : "No se pudo completar la solicitud";
    throw new ApiError(message, response.status);
  }
  return body as T;
}
