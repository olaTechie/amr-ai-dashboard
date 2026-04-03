import type { Study } from "./types";

let _cache: Study[] | null = null;

export async function loadStudies(): Promise<Study[]> {
  if (_cache) return _cache;
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/amr-ai-dashboard") ? "/amr-ai-dashboard" : "";
  const res = await fetch(`${base}/data/amr_ai_coded.json`);
  _cache = await res.json();
  return _cache!;
}

export function countBy<T>(items: T[], keyFn: (item: T) => string | null): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (key) counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function countArrayField(studies: Study[], field: keyof Study): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of studies) {
    const arr = s[field];
    if (Array.isArray(arr)) {
      for (const val of arr) {
        if (val) counts[val] = (counts[val] || 0) + 1;
      }
    }
  }
  return counts;
}

const NOISE_LABELS = new Set([
  "unknown", "nr", "not reported", "not specified", "n/a", "na", "none",
  "null", "other", "unspecified", "mixed", "",
]);

export function toSorted(
  counts: Record<string, number>,
  limit?: number,
  filterNoise = true
): { name: string; value: number }[] {
  let arr = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  if (filterNoise) {
    arr = arr.filter(d => !NOISE_LABELS.has(d.name.toLowerCase().trim()));
  }
  return limit ? arr.slice(0, limit) : arr;
}

export function uniqueCountries(studies: Study[]): number {
  return new Set(studies.map(s => s.country).filter(Boolean)).size;
}

/**
 * Normalise verbose ai_task values to clean categories.
 * Many values in the JSON are full sentences — map them to standard labels.
 */
const AI_TASK_RULES: [RegExp, string][] = [
  [/resistance.predict|predict.*resist|amr.*predict|phenotype.*predict|susceptib.*predict|predict.*susceptib/i, "Resistance Prediction"],
  [/drug.discover|antibiotic.discover|compound.screen|virtual.screen|qsar/i, "Drug Discovery"],
  [/amp.design|antimicrobial.peptide|peptide.design|peptide.generat/i, "AMP Design"],
  [/treatment.outcome|treatment.fail|prognos|unfavorable.*treat/i, "Treatment Outcome"],
  [/diagnos|detect.*resist|identif.*resist|screen/i, "Diagnosis / Detection"],
  [/species.id|pathogen.id|organism.id|differentiat.*species/i, "Species ID"],
  [/surveil|epidemiol|trend|forecast|outbreak/i, "Surveillance"],
  [/dos(?:e|ing)|pharmacokinet|pk.pd/i, "Dosing Optimisation"],
  [/risk.predict|risk.factor|risk.stratif|risk.assess|bsi.*predict|infection.*predict|coloniz/i, "Risk Prediction"],
  [/arg.*annot|gene.*annot|resistome|arg.*detect/i, "ARG Annotation"],
  [/image.analy|radiograph|chest.x.ray|cxr|microscop/i, "Imaging / Radiology"],
  [/nlp|text.min|natural.language|information.extract/i, "NLP / Text Mining"],
  [/classif/i, "Classification"],
  [/benchmark|evaluat.*tool|compar.*method/i, "Benchmarking"],
];

export function normaliseAiTask(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  // Already clean?
  if (lower === "resistance-prediction") return "Resistance Prediction";
  if (lower === "drug-discovery") return "Drug Discovery";
  if (lower === "amp-design") return "AMP Design";
  if (lower === "treatment-outcome") return "Treatment Outcome";
  if (lower === "diagnosis") return "Diagnosis / Detection";
  if (lower === "surveillance") return "Surveillance";
  if (lower === "species-id") return "Species ID";
  if (lower === "dosing") return "Dosing Optimisation";
  if (lower === "risk-stratification") return "Risk Prediction";
  if (lower === "ast-automation") return "AST Automation";
  if (lower === "arg-annotation") return "ARG Annotation";
  if (lower === "other") return null; // filter out

  for (const [pattern, label] of AI_TASK_RULES) {
    if (pattern.test(lower)) return label;
  }
  // If > 40 chars, it's a verbose description — skip
  if (raw.length > 40) return null;
  return raw;
}
