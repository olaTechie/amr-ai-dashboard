import type { Dataset, Study } from "./types";

let datasetCache: Dataset | null = null;

export async function loadDataset(): Promise<Dataset> {
  if (datasetCache) return datasetCache;
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/amr-ai-dashboard")
    ? "/amr-ai-dashboard"
    : "";
  const response = await fetch(`${base}/data/amr_ai_collated.json`);
  if (!response.ok) throw new Error(`Unable to load dashboard data (${response.status})`);
  datasetCache = await response.json() as Dataset;
  return datasetCache;
}

export async function loadStudies(): Promise<Study[]> {
  return (await loadDataset()).studies;
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
  for (const study of studies) {
    const values = study[field];
    if (Array.isArray(values)) {
      for (const value of values) {
        if (typeof value === "string" && value) counts[value] = (counts[value] || 0) + 1;
      }
    }
  }
  return counts;
}

const NOISE_LABELS = new Set([
  "unknown", "nr", "not reported", "not specified", "n/a", "na", "none",
  "null", "other", "unspecified", "mixed", "not applicable", "",
]);

export function toSorted(
  counts: Record<string, number>,
  limit?: number,
  filterNoise = true,
): { name: string; value: number }[] {
  let values = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  if (filterNoise) {
    values = values.filter(({ name }) => !NOISE_LABELS.has(name.toLowerCase().trim()));
  }
  return limit ? values.slice(0, limit) : values;
}

export function uniqueCountries(studies: Study[]): number {
  return new Set(studies.flatMap(study => study.countries_all)).size;
}

export function percentage(numerator: number, denominator: number): number {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

export function yesNoUnknown(studies: Study[], key: keyof Study) {
  const yes = studies.filter(study => study[key] === true).length;
  const no = studies.filter(study => study[key] === false).length;
  return [
    { name: "Yes", value: yes },
    { name: "No", value: no },
    { name: "Not reported", value: studies.length - yes - no },
  ];
}
