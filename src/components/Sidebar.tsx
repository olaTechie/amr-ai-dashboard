"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bug, Cpu, Globe, Home, Info, Scale, Table, TrendingUp } from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/geographic", label: "Geographic", icon: Globe },
  { href: "/ai-landscape", label: "AI Landscape", icon: Cpu },
  { href: "/pathogens", label: "Pathogens", icon: Bug },
  { href: "/performance", label: "Performance", icon: BarChart3 },
  { href: "/reporting", label: "Reporting & Equity", icon: Scale },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/explorer", label: "Study Explorer", icon: Table },
  { href: "/about", label: "About", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const basePath = process.env.NODE_ENV === "production" ? "/amr-ai-dashboard" : "";

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col bg-[#0a1628] text-white lg:h-screen lg:w-60">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 lg:block lg:py-5">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[2px] text-blue-300">Scoping review</div>
          <div className="mt-1 text-sm font-bold leading-tight">AI in AMR Research</div>
        </div>
        <div className="text-[9px] text-white/40 lg:hidden">346 studies</div>
      </div>
      <nav aria-label="Dashboard sections" className="flex flex-1 overflow-x-auto py-2 lg:block lg:overflow-visible lg:py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const fullHref = `${basePath}${href}`;
          const active = pathname === fullHref || pathname === href ||
            (href !== "/" && (pathname.startsWith(fullHref) || pathname.startsWith(href)));
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-[11px] transition-colors lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-2.5 ${
                active
                  ? "border-teal bg-white/10 font-semibold text-white"
                  : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 p-5 text-[9px] leading-relaxed text-white/35 lg:block">
        346 validated studies<br />215 extraction fields<br />2000–2026
      </div>
    </aside>
  );
}
