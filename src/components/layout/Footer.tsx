import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import Brand from "./Brand";

export default function Footer(): ReactElement {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-[#e5eeff] bg-[#eff4ff]">
      <div className="mx-auto grid max-w-360 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-10 lg:py-12">
        <div><Brand /><p className="mt-4 max-w-xs text-sm leading-6 text-(--muted)">{t("description")}</p></div>
        <FooterColumn title={t("platform")} items={[t("workspaces"), t("bookings"), t("hourlyRates")]} />
        <FooterColumn title={t("community")} items={[t("guidelines"), t("events"), t("locations")]} />
        <div><h2 className="mb-3 text-sm font-bold text-(--ink)">{t("support")}</h2><p className="text-sm leading-6 text-(--muted)">{t("supportHours")}</p><a className="mt-3 inline-block text-sm font-semibold text-(--accent-deep)" href="mailto:soporte@cospace.io">soporte@cospace.io</a></div>
        <div className="flex flex-col gap-3 border-t border-[#dce9ff] pt-5 text-xs text-(--muted) sm:flex-row sm:items-center sm:justify-between md:col-span-4"><span>{t("rights", { year: String(new Date().getFullYear()) })}</span><div className="flex gap-5"><span>{t("privacy")}</span><span>{t("terms")}</span><span>{t("security")}</span></div></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }): ReactElement {
  return <div><h2 className="mb-3 text-sm font-bold text-(--ink)">{title}</h2><ul className="space-y-2 text-sm text-(--muted)">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}