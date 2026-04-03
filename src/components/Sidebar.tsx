"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Globe, Cpu, Bug, BarChart3, TrendingUp, Table, Info } from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/geographic", label: "Geographic", icon: Globe },
  { href: "/ai-landscape", label: "AI Landscape", icon: Cpu },
  { href: "/pathogens", label: "Pathogens", icon: Bug },
  { href: "/performance", label: "Performance", icon: BarChart3 },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/explorer", label: "Study Explorer", icon: Table },
  { href: "/about", label: "About", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const basePath = process.env.NODE_ENV === "production" ? "/amr-ai-dashboard" : "";

  return (
    <aside className="w-56 bg-gradient-to-b from-[#0a1628] to-navy text-white flex flex-col shrink-0 min-h-screen sticky top-0">
      <div className="p-5 border-b border-white/10">
        <div className="text-[10px] uppercase tracking-[2px] text-med-blue font-bold">Scoping Review</div>
        <div className="text-sm font-bold mt-1 leading-tight">AI in AMR<br/>Research</div>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const fullHref = `${basePath}${href}`;
          const active = pathname === fullHref || pathname === href ||
            (href !== "/" && (pathname.startsWith(fullHref) || pathname.startsWith(href)));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 text-xs transition-all ${
                active
                  ? "bg-white/10 text-white border-l-2 border-med-blue font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-5 border-t border-white/10 text-[9px] text-white/30">
        252 studies &bull; 2000&ndash;2026<br />
        Arksey &amp; O&apos;Malley Framework
      </div>
    </aside>
  );
}
