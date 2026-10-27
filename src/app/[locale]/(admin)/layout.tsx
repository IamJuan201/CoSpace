import type { ReactElement, ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AdminLayout({ children }: { children: ReactNode }): ReactElement {
  return <><Navbar /><main className="flex-1">{children}</main><Footer /></>;
}
