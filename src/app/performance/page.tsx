"use client";
import { useEffect, useState } from "react";
import { loadStudies } from "@/lib/data";
import type { Study } from "@/lib/types";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import ScrollReveal from "@/components/ScrollReveal";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { COLORS } from "@/lib/theme";

const MATURITY_LABELS = ["L1 Proof", "L2 Internal", "L3 External", "L4 Prospective", "L5 CDS", "L6 Routine"];

export default function PerformancePage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const maturityCounts = [0, 0, 0, 0, 0, 0];
  studies.forEach(s => { if (s.maturity_level && s.maturity_level >= 1 && s.maturity_level <= 6) maturityCounts[s.maturity_level - 1]++; });
  const maturityData = MATURITY_LABELS.map((label, i) => ({ label, count: maturityCounts[i] }));

  const scatterData = studies
    .filter(s => s.auroc != null && s.year != null)
    .map(s => ({ year: s.year!, auroc: s.auroc!, name: `${s.first_author} (${s.year})` }));

  const topStudies = studies
    .filter(s => s.auroc != null)
    .sort((a, b) => (b.auroc || 0) - (a.auroc || 0))
    .slice(0, 10);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">Performance & Maturity</h1>
      <p className="text-xs text-gray-400 mb-6">Model performance metrics, clinical maturity levels, and top-performing studies</p>

      <KeyInsight>
        79% of tools remain at early maturity (levels 1-2), indicating a significant translational gap between AI development and clinical deployment in AMR.
      </KeyInsight>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartSection figure="Figure 15" title="Clinical Maturity Pipeline">
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
        <ChartSection figure="Figure 16" title="AUROC x Publication Year" caption={`n=${scatterData.length} studies reporting AUROC`}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} name="Year" />
              <YAxis dataKey="auroc" tick={{ fontSize: 10 }} name="AUROC" domain={[0.4, 1]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatterData} fill="#4472C4" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>

      <ScrollReveal>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-navy mb-3">Table 1. Top 10 Highest-AUROC Studies</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Author</th>
                <th className="px-3 py-2 text-left">Year</th>
                <th className="px-3 py-2 text-left">Pathogen</th>
                <th className="px-3 py-2 text-left">Best Model</th>
                <th className="px-3 py-2 text-left">AUROC</th>
              </tr>
            </thead>
            <tbody>
              {topStudies.map((s, i) => (
                <tr key={s.study_id} className={i % 2 === 0 ? "bg-white" : "bg-zebra"}>
                  <td className="px-3 py-2 font-bold text-navy">{s.study_id}</td>
                  <td className="px-3 py-2">{s.first_author}</td>
                  <td className="px-3 py-2">{s.year}</td>
                  <td className="px-3 py-2">{(s.pathogens || []).join(", ") || "\u2014"}</td>
                  <td className="px-3 py-2">{s.best_model || "\u2014"}</td>
                  <td className="px-3 py-2 font-bold text-teal">{s.auroc?.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
