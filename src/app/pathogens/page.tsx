"use client";

import { useEffect, useState } from "react";
import ChartSection from "@/components/ChartSection";
import DonutChart from "@/components/charts/DonutChart";
import HorizontalBar from "@/components/charts/HorizontalBar";
import KeyInsight from "@/components/KeyInsight";
import { countArrayField, countBy, loadStudies, toSorted } from "@/lib/data";
import type { Study } from "@/lib/types";

export default function PathogensPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const pathogenCounts = toSorted(countArrayField(studies, "pathogens"), 12);
  const classificationCounts = toSorted(countBy(studies, study => study.pathogen_classification), undefined, false);
  const drugClassCounts = toSorted(countArrayField(studies, "drug_classes"), 12);
  const taskCounts = toSorted(countArrayField(studies, "task_types"), 10);
  const pathogenReported = studies.filter(study => study.pathogens_reported).length;

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">Pathogens & resistance</h1>
        <p className="mt-1 text-xs text-gray-500">Target organisms, organism classes, antimicrobial groups and analytical tasks.</p>
      </div>

      <KeyInsight>
        Pathogens were explicitly extracted for {pathogenReported} of {studies.length} studies; {pathogenCounts[0]?.name || "no single pathogen"} is the most frequent standardised organism.
      </KeyInsight>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 12" title="Most frequently studied pathogens" caption="Names are standardised from the verbatim pathogen field; a study may contribute to more than one organism."><HorizontalBar data={pathogenCounts} color="#009688" /></ChartSection>
        <ChartSection figure="Figure 13" title="Pathogen classification"><DonutChart data={classificationCounts} /></ChartSection>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 14" title="Antimicrobial classes represented" caption="Standardised from drug-class and named-antibiotic fields."><HorizontalBar data={drugClassCounts} color="#FF8F00" /></ChartSection>
        <ChartSection figure="Figure 15" title="Analytical task types"><HorizontalBar data={taskCounts} color="#C00000" /></ChartSection>
      </div>
    </div>
  );
}
