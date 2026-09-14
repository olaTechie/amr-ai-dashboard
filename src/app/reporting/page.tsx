"use client";

import { useEffect, useState } from "react";
import ChartSection from "@/components/ChartSection";
import DonutChart from "@/components/charts/DonutChart";
import KeyInsight from "@/components/KeyInsight";
import { loadStudies, percentage, yesNoUnknown } from "@/lib/data";
import type { Study } from "@/lib/types";

const PANELS: { figure: string; title: string; key: keyof Study }[] = [
  { figure: "Figure 22", title: "Interpretability addressed", key: "interpretability_addressed" },
  { figure: "Figure 23", title: "Equity discussed", key: "equity_discussed" },
  { figure: "Figure 24", title: "Algorithmic bias tested", key: "bias_tested" },
  { figure: "Figure 25", title: "Subgroup analysis reported", key: "subgroup_analysis" },
  { figure: "Figure 26", title: "Calibration assessed", key: "calibration_assessed" },
  { figure: "Figure 27", title: "Generalisability discussed", key: "generalisability_discussed" },
];

export default function ReportingPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const equityYes = studies.filter(study => study.equity_discussed === true).length;
  const biasYes = studies.filter(study => study.bias_tested === true).length;

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">Reporting, transparency & equity</h1>
        <p className="mt-1 text-xs text-gray-500">Extracted indicators of responsible model development and reporting quality.</p>
      </div>

      <KeyInsight>
        Equity was explicitly discussed in {equityYes} studies ({percentage(equityYes, studies.length)}%), while algorithmic bias testing was reported in {biasYes} ({percentage(biasYes, studies.length)}%). “Not reported” is retained as a distinct category.
      </KeyInsight>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {PANELS.map(panel => (
          <ChartSection key={panel.key} figure={panel.figure} title={panel.title}>
            <DonutChart data={yesNoUnknown(studies, panel.key)} />
          </ChartSection>
        ))}
      </div>
    </div>
  );
}
