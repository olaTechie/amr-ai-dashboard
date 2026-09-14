"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Search, X } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { loadStudies } from "@/lib/data";
import type { Study } from "@/lib/types";

const ALL = "__all__";

function unique(values: (string | number | null)[]) {
  return Array.from(new Set(values.filter((value): value is string | number => value !== null && value !== "")))
    .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

function doiUrl(doi: string) {
  return doi.startsWith("http") ? doi : `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`;
}

export default function ExplorerPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [sorting, setSorting] = useState<SortingState>([{ id: "year", desc: true }]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [application, setApplication] = useState(ALL);
  const [maturity, setMaturity] = useState(ALL);
  const [selected, setSelected] = useState<Study | null>(null);

  useEffect(() => { loadStudies().then(setStudies); }, []);

  const countries = useMemo(() => unique(studies.flatMap(study => study.countries_all)), [studies]);
  const years = useMemo(() => unique(studies.map(study => study.year)).reverse(), [studies]);
  const applications = useMemo(() => unique(studies.flatMap(study => study.ai_application_types)), [studies]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return studies.filter(study => {
      if (country !== ALL && !study.countries_all.includes(country)) return false;
      if (year !== ALL && String(study.year) !== year) return false;
      if (application !== ALL && !study.ai_application_types.includes(application)) return false;
      if (maturity !== ALL && String(study.maturity_level) !== maturity) return false;
      if (!needle) return true;
      const haystack = [
        study.study_id, study.first_author, study.title, study.journal, study.doi,
        ...study.countries_all, ...study.pathogens, study.pathogens_reported,
        ...study.ai_application_types, ...study.models, study.best_model,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [studies, query, country, year, application, maturity]);

  const columns = useMemo<ColumnDef<Study>[]>(() => [
    { accessorKey: "study_id", header: "Study", cell: ({ row }) => <button className="font-semibold text-med-blue hover:underline" onClick={() => setSelected(row.original)}>{row.original.study_id}</button> },
    { accessorKey: "first_author", header: "Author", cell: ({ getValue }) => (getValue() as string | null) || "—" },
    { accessorKey: "year", header: "Year", cell: ({ getValue }) => (getValue() as number | null) || "—" },
    { accessorKey: "country", header: "Country", cell: ({ row }) => row.original.countries_all.join(", ") || "—" },
    { id: "pathogen", header: "Pathogen", accessorFn: row => row.pathogens.join(", ") || row.pathogens_reported || "—" },
    { id: "application", header: "AI application", accessorFn: row => row.ai_application_types.join(", ") || "—" },
    { accessorKey: "best_model", header: "Best model", cell: ({ getValue }) => (getValue() as string | null) || "—" },
    { accessorKey: "auroc", header: "AUROC", cell: ({ getValue }) => { const value = getValue() as number | null; return value == null ? "—" : value.toFixed(2); } },
    { accessorKey: "maturity_level", header: "Maturity", cell: ({ getValue }) => { const value = getValue() as number | null; return value == null ? "—" : `L${value}`; } },
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  useEffect(() => { table.setPageIndex(0); }, [query, country, year, application, maturity, table]);

  const clearFilters = () => {
    setQuery(""); setCountry(ALL); setYear(ALL); setApplication(ALL); setMaturity(ALL);
  };

  return (
    <div className="mx-auto max-w-[1500px] p-5 md:p-10">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
        <div><div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Full evidence table</div><h1 className="mt-1 text-2xl font-extrabold text-navy">Study Explorer</h1><p className="mt-1 text-xs text-gray-500">Search summary fields, filter the corpus and inspect every populated extraction field.</p></div>
        <a href="../data/collated.csv" download className="inline-flex min-h-11 items-center justify-center gap-2 bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-dark-blue"><Download size={15} /> Download CSV</a>
      </div>

      <section aria-label="Study filters" className="mb-5 bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="relative xl:col-span-2"><span className="sr-only">Search studies</span><Search size={15} className="absolute left-3 top-3 text-gray-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Author, title, pathogen, model…" className="min-h-11 w-full border border-gray-300 py-2 pl-9 pr-3 text-xs" /></label>
          <label><span className="sr-only">Country</span><select value={country} onChange={event => setCountry(event.target.value)} className="min-h-11 w-full border border-gray-300 px-3 text-xs"><option value={ALL}>All countries</option>{countries.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Publication year</span><select value={year} onChange={event => setYear(event.target.value)} className="min-h-11 w-full border border-gray-300 px-3 text-xs"><option value={ALL}>All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">AI application</span><select value={application} onChange={event => setApplication(event.target.value)} className="min-h-11 w-full border border-gray-300 px-3 text-xs"><option value={ALL}>All AI applications</option>{applications.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Maturity</span><select value={maturity} onChange={event => setMaturity(event.target.value)} className="min-h-11 w-full border border-gray-300 px-3 text-xs"><option value={ALL}>All maturity levels</option>{[1,2,3,4,5,6].map(value => <option key={value} value={value}>Level {value}</option>)}</select></label>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500"><span><strong className="text-navy">{filtered.length}</strong> of {studies.length} studies</span><button onClick={clearFilters} className="inline-flex min-h-11 items-center gap-1 px-2 font-semibold text-med-blue hover:underline"><X size={13} /> Clear filters</button></div>
      </section>

      <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-[11px]">
            <thead>{table.getHeaderGroups().map(group => <tr key={group.id} className="bg-navy text-white">{group.headers.map(header => <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none px-3 py-3 text-left font-semibold hover:bg-dark-blue">{flexRender(header.column.columnDef.header, header.getContext())}{{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] || ""}</th>)}</tr>)}</thead>
            <tbody>{table.getRowModel().rows.map((row, index) => <tr key={row.id} className={`${index % 2 ? "bg-zebra" : "bg-white"} border-b border-gray-100 align-top hover:bg-blue-50`}>{row.getVisibleCells().map(cell => <td key={cell.id} className="max-w-[260px] px-3 py-2.5 leading-relaxed">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody>
          </table>
        </div>
        {!filtered.length && <div className="p-10 text-center text-sm text-gray-400">No studies match these filters.</div>}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <select aria-label="Rows per page" value={table.getState().pagination.pageSize} onChange={event => table.setPageSize(Number(event.target.value))} className="min-h-11 border border-gray-300 bg-white px-3">{[10,25,50,100].map(size => <option key={size} value={size}>{size} rows</option>)}</select>
        <div className="flex items-center gap-3"><button className="min-h-11 px-2 disabled:opacity-30" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>← Previous</button><span>Page {table.getPageCount() ? table.getState().pagination.pageIndex + 1 : 0} / {table.getPageCount()}</span><button className="min-h-11 px-2 disabled:opacity-30" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next →</button></div>
      </div>

      {selected && <div role="dialog" aria-modal="true" aria-label={`Extraction details for ${selected.study_id}`} className="fixed inset-0 z-50 flex justify-end bg-slate-950/45" onClick={() => setSelected(null)}>
        <article className="h-full w-full max-w-2xl overflow-y-auto bg-surface shadow-2xl" onClick={event => event.stopPropagation()}>
          <header className="sticky top-0 z-10 flex items-start justify-between gap-5 bg-navy p-5 text-white"><div><div className="text-[10px] uppercase tracking-widest text-blue-200">Study extraction</div><h2 className="mt-1 text-lg font-bold">{selected.title || selected.study_id}</h2><p className="mt-1 text-xs text-white/60">{selected.first_author || "Author not reported"} · {selected.year || "Year not reported"}</p></div><button aria-label="Close details" onClick={() => setSelected(null)} className="min-h-11 min-w-11 p-2"><X /></button></header>
          <div className="p-5">
            <div className="mb-5 flex flex-wrap gap-2 text-[10px]">{selected.doi && <a href={doiUrl(selected.doi)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-white px-3 py-2 font-semibold text-med-blue ring-1 ring-gray-200">DOI <ExternalLink size={11} /></a>}<span className="bg-white px-3 py-2 text-gray-500 ring-1 ring-gray-200">{Object.keys(selected.raw).length} populated fields</span></div>
            <dl className="divide-y divide-gray-200 bg-white ring-1 ring-gray-200">{Object.entries(selected.raw).map(([field, value]) => <div key={field} className="grid gap-1 p-4 sm:grid-cols-[190px_1fr] sm:gap-5"><dt className="text-[10px] font-bold uppercase tracking-wide text-med-blue">{field.replaceAll("_", " ")}</dt><dd className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-700">{value}</dd></div>)}</dl>
          </div>
        </article>
      </div>}
    </div>
  );
}
