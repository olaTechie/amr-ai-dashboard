"use client";

import { useEffect, useState } from "react";
import ChartSection from "@/components/ChartSection";
import DonutChart from "@/components/charts/DonutChart";
import HorizontalBar from "@/components/charts/HorizontalBar";
import KeyInsight from "@/components/KeyInsight";
import { countArrayField, countBy, loadStudies, percentage, toSorted } from "@/lib/data";
import type { Study } from "@/lib/types";

export default function AiLandscapePage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const applicationCounts = toSorted(countArrayField(studies, "ai_application_types"), 10);
  const modelCounts = toSorted(countArrayField(studies, "models"), 10);
  const dataTypeCounts = toSorted(countArrayField(studies, "data_types"), 10);
  const validationCounts = toSorted(countBy(studies, study => study.validation), 10, false);
  const codeYes = studies.filter(study => study.code_available === true).length;
  const dataYes = studies.filter(study => study.data_available === true).length;

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">AI/ML landscape</h1>
        <p className="mt-1 text-xs text-gray-500">Application types, model families, data modalities and validation strategies.</p>
      </div>

      <KeyInsight>
        {applicationCounts[0]?.name || "The leading application"} is the most frequently extracted AI application ({applicationCounts[0]?.value || 0} studies); external validation remains documented in {studies.filter(study => study.external_validation === true).length} studies.
      </KeyInsight>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 7" title="AI application types"><HorizontalBar data={applicationCounts} color="#1B3A5C" /></ChartSection>
        <ChartSection figure="Figure 8" title="Detected model families" caption="Model families are standardised from the extracted model descriptions; one study may contribute to multiple families."><HorizontalBar data={modelCounts} color="#4472C4" /></ChartSection>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 9" title="Data modalities"><DonutChart data={dataTypeCounts} /></ChartSection>
        <ChartSection figure="Figure 10" title="Validation strategy"><HorizontalBar data={validationCounts} color="#2F5496" /></ChartSection>
      </div>
      <ChartSection figure="Figure 11" title="Open research assets">
        <div className="grid h-full grid-cols-1 place-items-center gap-6 sm:grid-cols-2">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-teal">{percentage(codeYes, studies.length)}%</div>
            <div className="mt-2 text-xs text-gray-500">Code reported as shared ({codeYes}/{studies.length})</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-med-blue">{percentage(dataYes, studies.length)}%</div>
            <div className="mt-2 text-xs text-gray-500">Data reported as shared ({dataYes}/{studies.length})</div>
          </div>
        </div>
      </ChartSection>
    </div>
  );
}
