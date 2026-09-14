"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import ChartSection from "@/components/ChartSection";
import DonutChart from "@/components/charts/DonutChart";
import KeyInsight from "@/components/KeyInsight";
import ScrollReveal from "@/components/ScrollReveal";
import { loadStudies, percentage, yesNoUnknown } from "@/lib/data";
import { COLORS } from "@/lib/theme";
import type { Study } from "@/lib/types";

const MATURITY_LABELS = ["L1 Proof", "L2 Internal", "L3 External", "L4 Prospective", "L5 CDS", "L6 Routine"];

export default function PerformancePage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const maturityData = MATURITY_LABELS.map((label, index) => ({
    label,
    count: studies.filter(study => study.maturity_level === index + 1).length,
  }));
  const maturityKnown = studies.filter(study => study.maturity_level != null).length;
  const early = studies.filter(study => study.maturity_level != null && study.maturity_level <= 2).length;
  const scatterData = studies
    .filter(study => study.auroc != null && study.year != null)
    .map(study => ({ year: study.year!, auroc: study.auroc!, name: `${study.first_author || study.study_id} (${study.year})` }));
  const topStudies = studies
    .filter(study => study.auroc != null)
    .sort((a, b) => (b.auroc || 0) - (a.auroc || 0))
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">Performance & maturity</h1>
        <p className="mt-1 text-xs text-gray-500">Reported discrimination, validation design and translational maturity.</p>
      </div>

      <KeyInsight>
        {percentage(early, maturityKnown)}% of the {maturityKnown} maturity-classified studies remain at levels 1–2; only {studies.filter(study => (study.maturity_level || 0) >= 5).length} reached CDS integration or routine use.
      </KeyInsight>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 16" title="Clinical maturity pipeline" caption={`Denominator: ${maturityKnown} classified studies.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maturityData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {maturityData.map((_, index) => <Cell key={index} fill={COLORS.maturity[index]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
        <ChartSection figure="Figure 17" title="AUROC by publication year" caption={`Each point is one of ${scatterData.length} studies with a parseable extracted AUROC.`}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 4, right: 16 }}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} name="Year" />
              <YAxis dataKey="auroc" tick={{ fontSize: 10 }} name="AUROC" domain={[0.4, 1]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatterData} fill="#4472C4" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 18" title="External validation reporting"><DonutChart data={yesNoUnknown(studies, "external_validation")} /></ChartSection>
        <ChartSection figure="Figure 19" title="Prospective evaluation reporting"><DonutChart data={yesNoUnknown(studies, "prospective")} /></ChartSection>
      </div>

      <ScrollReveal>
        <section className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-200 px-5 py-4 text-xs font-semibold text-navy">Table 1 · Highest extracted AUROC values</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-xs">
              <thead><tr className="bg-navy text-white">
                <th className="px-3 py-2 text-left">Study</th><th className="px-3 py-2 text-left">Author</th><th className="px-3 py-2 text-left">Year</th><th className="px-3 py-2 text-left">Pathogen</th><th className="px-3 py-2 text-left">Best model</th><th className="px-3 py-2 text-left">AUROC</th>
              </tr></thead>
              <tbody>{topStudies.map((study, index) => (
                <tr key={study.study_id} className={`${index % 2 ? "bg-zebra" : "bg-white"} border-b border-gray-100`}>
                  <td className="px-3 py-2 font-semibold text-navy">{study.study_id}</td><td className="px-3 py-2">{study.first_author || "—"}</td><td className="px-3 py-2">{study.year || "—"}</td><td className="px-3 py-2">{study.pathogens.join(", ") || study.pathogens_reported || "—"}</td><td className="max-w-xs px-3 py-2">{study.best_model || "—"}</td><td className="px-3 py-2 font-bold text-teal">{study.auroc?.toFixed(3)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
