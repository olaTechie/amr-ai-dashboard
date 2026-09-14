"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Bug, Cpu, FileSearch, Globe, Scale, Table, TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartSection from "@/components/ChartSection";
import GlassCard from "@/components/GlassCard";
import KeyInsight from "@/components/KeyInsight";
import StatCounter from "@/components/StatCounter";
import { countArrayField, loadDataset, percentage, toSorted, uniqueCountries } from "@/lib/data";
import { COLORS } from "@/lib/theme";
import type { Dataset } from "@/lib/types";

const NAV_TILES = [
  { href: "/geographic", icon: Globe, label: "Geographic", desc: "Countries, regions and settings" },
  { href: "/ai-landscape", icon: Cpu, label: "AI Landscape", desc: "Applications, models and data" },
  { href: "/pathogens", icon: Bug, label: "Pathogens", desc: "Organisms and resistance" },
  { href: "/performance", icon: BarChart3, label: "Performance", desc: "Validation, AUROC and maturity" },
  { href: "/reporting", icon: Scale, label: "Reporting & Equity", desc: "Transparency, bias and access" },
  { href: "/trends", icon: TrendingUp, label: "Trends", desc: "Publication timeline" },
  { href: "/explorer", icon: Table, label: "Study Explorer", desc: "Search all extracted fields" },
];

const MATURITY_LABELS = ["L1 Proof", "L2 Internal", "L3 External", "L4 Prospective", "L5 CDS", "L6 Routine"];

export default function HomePage() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDataset().then(setDataset).catch(reason => setError(String(reason)));
  }, []);

  if (error) return <div className="p-10 text-danger">{error}</div>;
  if (!dataset) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading extracted data…</div>;

  const { studies, metadata } = dataset;
  const applicationCounts = toSorted(countArrayField(studies, "ai_application_types"), 1);
  const pathogenCounts = toSorted(countArrayField(studies, "pathogens"), 1);
  const modelCounts = toSorted(countArrayField(studies, "models"), 1);
  const aurocStudies = studies.filter(study => study.auroc != null);
  const sortedAuroc = aurocStudies.map(study => study.auroc!).sort((a, b) => a - b);
  const medianAuroc = sortedAuroc.length ? sortedAuroc[Math.floor(sortedAuroc.length / 2)] : null;
  const maturityCounts = MATURITY_LABELS.map((label, index) => ({
    label,
    count: studies.filter(study => study.maturity_level === index + 1).length,
  }));
  const maturityKnown = studies.filter(study => study.maturity_level != null).length;
  const earlyMaturity = studies.filter(study => study.maturity_level != null && study.maturity_level <= 2).length;

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-r from-[#0a1628] via-navy to-dark-blue px-6 py-9 text-white md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(0,150,136,0.16),transparent_38%)]" />
        <div className="relative max-w-6xl">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-blue-300">PRISMA-ScR evidence map</div>
          <h1 className="max-w-4xl text-2xl font-extrabold leading-tight md:text-3xl">Artificial Intelligence in Antimicrobial Resistance Research</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/65">Explore the validated study-level extraction across geography, methods, pathogens, performance, clinical maturity and reporting practice.</p>
          <div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            <StatCounter value={studies.length} label="Included studies" color="white" />
            <StatCounter value={metadata.source_field_count} label="Extracted fields" color="#8DDDD4" />
            <StatCounter value={uniqueCountries(studies)} label="Reported countries" color="#9FC2FF" />
            <StatCounter value={aurocStudies.length} label="Studies with AUROC" color="#FFD180" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <KeyInsight>
          Among {maturityKnown} studies with a maturity classification, {percentage(earlyMaturity, maturityKnown)}% remain at proof-of-concept or internal-validation stages.
        </KeyInsight>

        <div className="mb-8">
          <ChartSection figure="Figure 1" title="Clinical maturity across included studies" caption={`Denominator: ${maturityKnown} studies with a reported maturity classification.`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maturityCounts} layout="vertical" margin={{ left: 8, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {maturityCounts.map((_, index) => <Cell key={index} fill={COLORS.maturity[index]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GlassCard label="Most frequent pathogen" value={pathogenCounts[0]?.name || "Not reported"} detail={`${pathogenCounts[0]?.value || 0} studies`} />
          <GlassCard label="Leading AI application" value={applicationCounts[0]?.name || "Not reported"} detail={`${applicationCounts[0]?.value || 0} studies`} delay={0.05} />
          <GlassCard label="Median extracted AUROC" value={medianAuroc?.toFixed(2) || "Not available"} detail={`${aurocStudies.length} reporting studies`} delay={0.1} />
          <GlassCard label="Most detected model family" value={modelCounts[0]?.name || "Not reported"} detail={`${modelCounts[0]?.value || 0} studies`} delay={0.15} />
        </div>

        <section aria-labelledby="explore-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domains</div>
              <h2 id="explore-heading" className="mt-1 text-xl font-extrabold text-navy">Explore the review</h2>
            </div>
            <Link href="/explorer" className="inline-flex items-center gap-2 text-xs font-semibold text-med-blue hover:underline">
              <FileSearch size={15} /> Open all studies
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {NAV_TILES.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href} className="group border-t-2 border-transparent bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:border-med-blue hover:shadow-md">
                <Icon size={20} className="mb-4 text-med-blue" />
                <div className="text-sm font-bold text-navy group-hover:text-dark-blue">{label}</div>
                <div className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
