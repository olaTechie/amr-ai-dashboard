"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartSection from "@/components/ChartSection";
import KeyInsight from "@/components/KeyInsight";
import { countBy, loadStudies } from "@/lib/data";
import type { Study } from "@/lib/types";

export default function TrendsPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const yearCounts = Object.entries(countBy(studies, study => study.year ? String(study.year) : null))
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);
  let cumulative = 0;
  const cumulativeData = yearCounts.map(item => ({ year: item.year, total: cumulative += item.count }));
  const sortedYears = studies.map(study => study.year).filter((year): year is number => year != null).sort((a, b) => a - b);
  const recentCount = yearCounts.filter(item => item.year >= 2024).reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">Publication trends</h1>
        <p className="mt-1 text-xs text-gray-500">Growth of the AI–AMR evidence base over time.</p>
      </div>

      <KeyInsight>
        {recentCount} included studies were published from 2024 onward, showing the recent acceleration of AI applications in AMR research.
      </KeyInsight>

      <div className="mb-8 grid grid-cols-3 gap-3 bg-white p-5 text-center shadow-sm ring-1 ring-gray-200">
        <div><div className="text-2xl font-extrabold text-navy">{sortedYears[0]}</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Earliest</div></div>
        <div><div className="text-2xl font-extrabold text-med-blue">{sortedYears[Math.floor(sortedYears.length / 2)]}</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Median year</div></div>
        <div><div className="text-2xl font-extrabold text-teal">{sortedYears.at(-1)}</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Latest</div></div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 20" title="Included studies by publication year">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={yearCounts}><XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#4472C4" /></BarChart></ResponsiveContainer>
        </ChartSection>
        <ChartSection figure="Figure 21" title="Cumulative evidence base">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={cumulativeData}><XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="total" fill="#D6E4F0" stroke="#1B3A5C" strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </ChartSection>
      </div>
    </div>
  );
}
