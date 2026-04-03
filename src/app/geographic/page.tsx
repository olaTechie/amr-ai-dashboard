"use client";
import { useEffect, useState } from "react";
import { loadStudies, countBy, toSorted } from "@/lib/data";
import type { Study } from "@/lib/types";
import KeyInsight from "@/components/KeyInsight";
import ChartSection from "@/components/ChartSection";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";

export default function GeographicPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;

  const countryCounts = toSorted(countBy(studies, s => s.country), 15);
  const regionCounts = toSorted(countBy(studies, s => s.who_region));
  const incomeCounts = toSorted(countBy(studies, s => s.income));
  const multicentre = studies.filter(s => s.multicentre === true).length;
  const singlecentre = studies.filter(s => s.multicentre === false).length;
  const centreData = [
    { name: "Multicentre", value: multicentre },
    { name: "Single-centre", value: singlecentre },
    { name: "NR", value: studies.length - multicentre - singlecentre },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">Geographic Analysis</h1>
      <p className="text-xs text-gray-400 mb-6">Distribution of studies across countries, WHO regions, and income levels</p>

      <KeyInsight>
        Studies span {new Set(studies.map(s => s.country).filter(Boolean)).size} countries across all 6 WHO regions, though China and the USA dominate the landscape.
      </KeyInsight>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartSection figure="Figure 2" title="Top 15 Countries by Study Count" caption="n = studies with country reported">
          <HorizontalBar data={countryCounts} color="#1B3A5C" />
        </ChartSection>
        <ChartSection figure="Figure 3" title="WHO Region Distribution">
          <DonutChart data={regionCounts} />
        </ChartSection>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <ChartSection figure="Figure 4" title="World Bank Income Classification">
          <HorizontalBar data={incomeCounts} color="#009688" />
        </ChartSection>
        <ChartSection figure="Figure 5" title="Single vs Multicentre Studies">
          <DonutChart data={centreData} />
        </ChartSection>
      </div>
    </div>
  );
}
