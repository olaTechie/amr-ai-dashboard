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
