"use client";
import { useEffect, useState } from "react";
import { loadStudies, countBy, countArrayField, toSorted, normaliseAiTask } from "@/lib/data";
import type { Study } from "@/lib/types";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";

export default function AiLandscapePage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const taskCounts = toSorted(countBy(studies, s => normaliseAiTask(s.ai_task)), 10);
  const modelCounts = toSorted(countArrayField(studies, "models"), 10);
  const dataTypeCounts = toSorted(countArrayField(studies, "data_types"), 8);
  const validationCounts = toSorted(countBy(studies, s => s.validation), 10);
  const codeYes = studies.filter(s => s.code_available === true).length;
  const dataYes = studies.filter(s => s.data_available === true).length;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">AI/ML Landscape</h1>
      <p className="text-xs text-gray-400 mb-6">AI task types, ML algorithms, data modalities, and validation approaches</p>

      <KeyInsight>
        Resistance prediction dominates ({taskCounts[0]?.value || 0} studies), but drug discovery and AMP design are rapidly growing AI applications in AMR research.
      </KeyInsight>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartSection figure="Figure 7" title="AI Task Distribution (Top 10)" caption="Excluding unknown/not specified">
          <HorizontalBar data={taskCounts} color="#1B3A5C" />
        </ChartSection>
        <ChartSection figure="Figure 8" title="Most Common ML Models (Top 10)">
          <HorizontalBar data={modelCounts} color="#4472C4" />
        </ChartSection>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartSection figure="Figure 9" title="Data Type Breakdown">
          <DonutChart data={dataTypeCounts} />
        </ChartSection>
        <ChartSection figure="Figure 10" title="Validation Approach (Top 10)">
          <HorizontalBar data={validationCounts} color="#2F5496" />
        </ChartSection>
      </div>

      <ChartSection figure="Figure 11" title="Code & Data Availability">
        <div className="flex items-center justify-center gap-16 h-full">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-teal">{Math.round(codeYes / studies.length * 100)}%</div>
            <div className="text-xs text-gray-500 mt-1">Code shared ({codeYes}/{studies.length})</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-med-blue">{Math.round(dataYes / studies.length * 100)}%</div>
            <div className="text-xs text-gray-500 mt-1">Data shared ({dataYes}/{studies.length})</div>
          </div>
        </div>
      </ChartSection>
    </div>
  );
}
