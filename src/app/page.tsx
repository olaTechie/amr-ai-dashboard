"use client";
import { useEffect, useState } from "react";
import { loadStudies, countBy, uniqueCountries, countArrayField, toSorted } from "@/lib/data";
import type { Study } from "@/lib/types";
import StatCounter from "@/components/StatCounter";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import Link from "next/link";
import { Globe, Cpu, Bug, BarChart3, TrendingUp, Table, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { COLORS } from "@/lib/theme";

const NAV_TILES = [
  { href: "/geographic", icon: Globe, label: "Geographic", desc: "World map & regions" },
  { href: "/ai-landscape", icon: Cpu, label: "AI Landscape", desc: "Tasks, models, data" },
  { href: "/pathogens", icon: Bug, label: "Pathogens", desc: "Species & resistance" },
  { href: "/performance", icon: BarChart3, label: "Performance", desc: "AUROC & maturity" },
  { href: "/trends", icon: TrendingUp, label: "Trends", desc: "Publication timeline" },
  { href: "/explorer", icon: Table, label: "Study Explorer", desc: "Search all studies" },
  { href: "/about", icon: Info, label: "About", desc: "Methodology & citation" },
];

const MATURITY_LABELS = ["L1 Proof", "L2 Internal", "L3 External", "L4 Prospective", "L5 CDS", "L6 Routine"];

export default function HomePage() {
  const [studies, setStudies] = useState<Study[]>([]);

  useEffect(() => {
    loadStudies().then(setStudies);
  }, []);

  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const nCountries = uniqueCountries(studies);
  const taskCounts = countBy(studies, s => s.ai_task);
  const nTasks = Object.keys(taskCounts).length;
  const topTask = toSorted(taskCounts, 1)[0];
  const pathogenCounts = countArrayField(studies, "pathogens");
  const topPathogen = toSorted(pathogenCounts, 1)[0];
  const modelCounts = countArrayField(studies, "models");
  const topModel = toSorted(modelCounts, 1)[0];
  const aurocStudies = studies.filter(s => s.auroc != null);
  const medianAuroc = aurocStudies.length > 0
    ? aurocStudies.map(s => s.auroc!).sort((a, b) => a - b)[Math.floor(aurocStudies.length / 2)]
    : null;

  // Maturity data
  const maturityCounts = [0, 0, 0, 0, 0, 0];
  studies.forEach(s => {
    if (s.maturity_level && s.maturity_level >= 1 && s.maturity_level <= 6) maturityCounts[s.maturity_level - 1]++;
  });
  const maturityData = MATURITY_LABELS.map((label, i) => ({ label, count: maturityCounts[i] }));

  return (
    <div>
      {/* HERO */}
      <div className="bg-gradient-to-br from-[#0a1628] via-navy to-dark-blue py-16 px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(68,114,196,0.15),transparent_60%)]" />
        <div className="relative">
          <div className="text-[10px] tracking-[4px] uppercase text-med-blue mb-2">Scoping Review 2026</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Application of Artificial Intelligence<br />in Antimicrobial Resistance Research
          </h1>
          <p className="text-xs text-white/50 mt-3">Arksey &amp; O&apos;Malley Framework &bull; PRISMA-ScR</p>

          <div className="flex justify-center gap-12 mt-10">
            <StatCounter value={studies.length} label="Studies Included" color="white" />
            <div className="w-px bg-white/15" />
            <StatCounter value={nCountries} label="Countries" color="#009688" />
            <div className="w-px bg-white/15" />
            <StatCounter value={nTasks} label="AI Task Categories" color="#4472C4" />
            <div className="w-px bg-white/15" />
            <StatCounter value={6} label="Maturity Levels" color="#FF8F00" />
          </div>
        </div>
      </div>

      {/* KEY INSIGHT */}
      <KeyInsight>
        79% of AI/ML tools for AMR remain at proof-of-concept or internal validation stage — only 6 studies have reached clinical deployment.
      </KeyInsight>

      {/* MATURITY CHART */}
      <div className="px-10 mb-8">
        <ChartSection figure="Figure 1" title="Distribution of Clinical Maturity Levels" caption={`Source: Dual-reviewer extraction, n=${studies.length} included studies`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maturityData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {maturityData.map((_, i) => <Cell key={i} fill={COLORS.maturity[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>

      {/* GLASS CARDS */}
      <div className="px-10 mb-10">
        <div className="grid grid-cols-4 gap-5">
          <GlassCard label="Top Pathogen" value={topPathogen?.name || "\u2014"} detail={`${topPathogen?.value || 0} studies`} delay={0} />
          <GlassCard label="Top AI Task" value={topTask?.name || "\u2014"} detail={`${topTask?.value || 0} studies`} delay={0.1} />
          <GlassCard label="Median AUROC" value={medianAuroc?.toFixed(2) || "\u2014"} detail={`Across ${aurocStudies.length} reporting studies`} delay={0.2} />
          <GlassCard label="Most Common Model" value={topModel?.name || "\u2014"} detail={`Used in ${topModel?.value || 0} studies`} delay={0.3} />
        </div>
      </div>

      {/* PRISMA FLOW */}
      <ScrollReveal>
        <div className="px-10 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-xs font-semibold text-navy mb-4">PRISMA-ScR Study Flow</div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="bg-navy text-white px-4 py-2 rounded-lg font-bold">272<br/><span className="font-normal text-[10px]">Screened</span></div>
              <div className="text-gray-300">&rarr;</div>
              <div className="bg-teal text-white px-4 py-2 rounded-lg font-bold">252<br/><span className="font-normal text-[10px]">Included</span></div>
              <div className="text-gray-300">+</div>
              <div className="bg-danger text-white px-4 py-2 rounded-lg font-bold">20<br/><span className="font-normal text-[10px]">Excluded</span></div>
            </div>
            <div className="text-[10px] text-gray-400 mt-3">4 missing PDFs &bull; 31 reclassified after scope broadening</div>
          </div>
        </div>
      </ScrollReveal>

      {/* NAVIGATION TILES */}
      <div className="px-10 pb-16">
        <ScrollReveal>
          <div className="text-center text-xs font-bold text-navy uppercase tracking-[2px] mb-6">Explore the Data</div>
        </ScrollReveal>
        <div className="grid grid-cols-4 gap-4">
          {NAV_TILES.map(({ href, icon: Icon, label, desc }, i) => (
            <ScrollReveal key={href} delay={i * 0.05}>
              <Link href={href} className="block bg-white border border-gray-200 rounded-xl p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <Icon size={28} className="mx-auto text-med-blue mb-2" />
                <div className="text-sm font-bold text-navy">{label}</div>
                <div className="text-[10px] text-gray-400">{desc}</div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
