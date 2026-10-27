import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";

export default function Brand(): ReactElement {
  return (
    <Link href="/" aria-label="CoSpace inicio" className="inline-flex items-center gap-2.5 text-(--ink)">
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--ink) text-sm font-bold text-white">C</span>
      <span className="text-[21px] font-bold tracking-[-0.04em]">CoSpace</span>
    </Link>
  );
}
