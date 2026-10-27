"use client";

import type { ReactElement } from "react";
import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";

interface LocalDateTimeProps {
  value: string | Date;
  dateStyle?: "short" | "medium" | "long";
  timeStyle?: "short" | "medium";
}

export default function LocalDateTime({ value, dateStyle = "medium", timeStyle = "short" }: LocalDateTimeProps): ReactElement {
  const locale = useLocale();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const date = value instanceof Date ? value : new Date(value);
  return <time dateTime={date.toISOString()}>{mounted ? new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(date) : "—"}</time>;
}
