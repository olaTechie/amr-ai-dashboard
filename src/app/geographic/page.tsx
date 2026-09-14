"use client";

import { useEffect, useState } from "react";
import ChartSection from "@/components/ChartSection";
import DonutChart from "@/components/charts/DonutChart";
import HorizontalBar from "@/components/charts/HorizontalBar";
import WorldMap from "@/components/charts/WorldMap";
import KeyInsight from "@/components/KeyInsight";
import { countArrayField, countBy, loadStudies, toSorted, uniqueCountries } from "@/lib/data";
import type { Study } from "@/lib/types";

export default function GeographicPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  useEffect(() => { loadStudies().then(setStudies); }, []);
  if (!studies.length) return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;

  const countryRaw = countArrayField(studies, "countries_all");
  const countryCounts = toSorted(countryRaw, 15);
  const regionCounts = toSorted(countArrayField(studies, "who_regions"));
  const incomeCounts = toSorted(countBy(studies, study => study.income));
  const multicentre = studies.filter(study => study.multicentre === true).length;
  const singlecentre = studies.filter(study => study.multicentre === false).length;
  const centreData = [
    { name: "Multicentre", value: multicentre },
    { name: "Single-centre", value: singlecentre },
    { name: "Not reported", value: studies.length - multicentre - singlecentre },
  ];

  return (
    <div className="mx-auto max-w-7xl p-5 md:p-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Evidence domain</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">Geographic distribution</h1>
        <p className="mt-1 text-xs text-gray-500">Countries, WHO regions, income classifications and study-centre structure.</p>
      </div>

      <KeyInsight>
        Country was reported for {studies.filter(study => study.countries_all.length).length} of {studies.length} studies, spanning {uniqueCountries(studies)} distinct countries; {countryCounts[0]?.name || "no country"} appears most often.
      </KeyInsight>

      <div className="mb-6">
        <ChartSection figure="Figure 2" title="Global distribution of included studies" caption="Counts may exceed the study total because multicountry studies contribute to each reported country.">
          <WorldMap data={countryRaw} maxValue={countryCounts[0]?.value || 1} />
        </ChartSection>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 3" title="Top reported countries"><HorizontalBar data={countryCounts} color="#1B3A5C" /></ChartSection>
        <ChartSection figure="Figure 4" title="WHO region distribution"><DonutChart data={regionCounts} /></ChartSection>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartSection figure="Figure 5" title="World Bank income classification"><HorizontalBar data={incomeCounts} color="#009688" /></ChartSection>
        <ChartSection figure="Figure 6" title="Single- and multicentre reporting"><DonutChart data={centreData} /></ChartSection>
      </div>
    </div>
  );
}
