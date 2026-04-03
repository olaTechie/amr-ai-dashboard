"use client";
import { useEffect, useState } from "react";
import { loadStudies, countBy, countArrayField, toSorted } from "@/lib/data";
import type { Study } from "@/lib/types";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";

export default function PathogensPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const pathogenCounts = toSorted(countArrayField(studies, "pathogens"), 15);
  const gramCounts = toSorted(countBy(studies, s => s.pathogen_gram));
  const resistanceCounts = toSorted(countBy(studies, s => s.resistance_type));
  const drugClassCounts = toSorted(countArrayField(studies, "drug_classes"), 12);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">Pathogen & Resistance Analysis</h1>
      <p className="text-xs text-gray-400 mb-6">Target organisms, resistance phenotypes, and antibiotic classes</p>

      <KeyInsight>
        Mycobacterium tuberculosis and Staphylococcus aureus (MRSA) together account for the largest share of AI-AMR studies, reflecting global priority pathogens.
      </KeyInsight>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartSection figure="Figure 11" title="Top 15 Pathogens by Study Count">
          <HorizontalBar data={pathogenCounts} color="#009688" />
        </ChartSection>
        <ChartSection figure="Figure 12" title="Gram Classification">
          <DonutChart data={gramCounts} />
        </ChartSection>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <ChartSection figure="Figure 13" title="Resistance Type Distribution">
          <HorizontalBar data={resistanceCounts} color="#C00000" />
        </ChartSection>
        <ChartSection figure="Figure 14" title="Drug Classes Studied">
          <HorizontalBar data={drugClassCounts} color="#FF8F00" />
        </ChartSection>
      </div>
    </div>
  );
}
