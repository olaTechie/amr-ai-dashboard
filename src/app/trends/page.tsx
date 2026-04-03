"use client";
import { useEffect, useState } from "react";
import { loadStudies, countBy } from "@/lib/data";
import type { Study } from "@/lib/types";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function TrendsPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const yearCounts = Object.entries(countBy(studies, s => s.year ? String(s.year) : null))
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);

  // Cumulative
  let cum = 0;
  const cumData = yearCounts.map(d => { cum += d.count; return { year: d.year, total: cum }; });

  const earliest = yearCounts[0]?.year;
  const latest = yearCounts[yearCounts.length - 1]?.year;
  const medianIdx = Math.floor(studies.filter(s => s.year).length / 2);
  const sortedYears = studies.map(s => s.year).filter(Boolean).sort() as number[];
  const medianYear = sortedYears[medianIdx];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">Publication Trends</h1>
      <p className="text-xs text-gray-400 mb-6">Temporal patterns in AI-AMR research output</p>

      <KeyInsight>
        Publication volume has surged since 2020, with {yearCounts.filter(d => d.year >= 2024).reduce((s, d) => s + d.count, 0)} studies published in 2024-2026 alone — reflecting the explosive growth of AI applications in AMR.
      </KeyInsight>

      <div className="flex justify-center gap-12 mb-8">
        <div className="text-center"><div className="text-3xl font-extrabold text-navy">{earliest}</div><div className="text-[10px] text-gray-400">Earliest</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-med-blue">{medianYear}</div><div className="text-[10px] text-gray-400">Median</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-teal">{latest}</div><div className="text-[10px] text-gray-400">Latest</div></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartSection figure="Figure 17" title="Studies by Publication Year">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearCounts}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4472C4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection figure="Figure 18" title="Cumulative Studies Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumData}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="total" fill="#D6E4F0" stroke="#1B3A5C" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>
    </div>
  );
}
