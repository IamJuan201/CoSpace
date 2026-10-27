import type { ReactElement, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Brand from "@/components/layout/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function AuthLayout({ children }: { children: ReactNode }): ReactElement {
  return <div className="flex min-h-full flex-1 flex-col bg-(--canvas)"><header className="flex h-16 items-center justify-between border-b border-[#e5eeff] bg-white px-5 sm:px-10"><Brand /><LocaleSwitcher /></header><main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12"><div className="rounded-2xl border border-[#e5eeff] bg-white p-6 shadow-[0_8px_32px_rgba(11,28,48,0.07)] sm:p-10">{children}</div><p className="mt-6 text-center text-xs text-(--muted)"><Link href="/" className="hover:text-(--accent-deep)">CoSpace</Link></p></main></div>;
}
