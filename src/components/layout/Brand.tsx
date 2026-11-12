import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";

export default function Brand(): ReactElement {
  return (
    <Link href="/" aria-label="CoSpace inicio" className="group inline-flex items-center gap-2.5 text-(--ink)">
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#17251f] shadow-sm transition-transform group-hover:-rotate-3">
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M8 24V10.5A2.5 2.5 0 0 1 10.5 8h11A2.5 2.5 0 0 1 24 10.5V24" stroke="#F7F5EF" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M13 24v-6a3 3 0 0 1 6 0v6" stroke="#D98763" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M6 24h20" stroke="#F7F5EF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[19px] font-bold tracking-[-0.045em] sm:text-[21px]">CoSpace<span className="text-(--accent)">.</span></span>
    </Link>
  );
}
