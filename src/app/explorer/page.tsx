"use client";
import { useEffect, useState, useMemo } from "react";
import { loadStudies } from "@/lib/data";
import type { Study } from "@/lib/types";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";

export default function ExplorerPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [sorting, setSorting] = useState<SortingState>([{ id: "study_id", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => { loadStudies().then(setStudies); }, []);

  const columns = useMemo<ColumnDef<Study>[]>(() => [
    { accessorKey: "study_id", header: "ID", size: 50 },
    { accessorKey: "first_author", header: "Author", size: 100 },
    { accessorKey: "year", header: "Year", size: 50 },
    { accessorKey: "country", header: "Country", size: 100 },
    { accessorKey: "pathogens", header: "Pathogen", cell: ({ getValue }) => { const v = getValue() as string[] | null; return v?.join(", ") || "\u2014"; }, size: 140 },
    { accessorKey: "ai_task", header: "AI Task", size: 130 },
    { accessorKey: "best_model", header: "Model", size: 80 },
    { accessorKey: "auroc", header: "AUROC", cell: ({ getValue }) => { const v = getValue() as number | null; return v != null ? <span className={v >= 0.9 ? "font-bold text-teal" : ""}>{v.toFixed(2)}</span> : "\u2014"; }, size: 60 },
    { accessorKey: "maturity_level", header: "Mat.", cell: ({ getValue }) => { const v = getValue() as number | null; return v ?? "\u2014"; }, size: 40 },
    { accessorKey: "validation", header: "Validation", size: 90 },
  ], []);

  const table = useReactTable({
    data: studies, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold text-navy mb-1">Study Explorer</h1>
      <p className="text-xs text-gray-400 mb-4">Search, filter, and browse all {studies.length} included studies</p>
      <input
        type="text" placeholder="Search by author, pathogen, country, model..."
        value={globalFilter} onChange={e => setGlobalFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-96 mb-4 focus:outline-none focus:ring-2 focus:ring-med-blue"
      />
      <span className="ml-4 text-xs text-gray-400">{table.getFilteredRowModel().rows.length} studies</span>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="bg-navy text-white">
                {hg.headers.map(h => (
                  <th key={h.id} className="px-3 py-2.5 text-left font-bold cursor-pointer hover:bg-dark-blue select-none" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: " \u2191", desc: " \u2193" }[h.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr key={row.id} className={`${i % 2 === 0 ? "bg-white" : "bg-zebra"} border-b border-gray-100 hover:bg-blue-50 transition-colors`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2">
                    {cell.column.id === "study_id" ? <span className="font-bold text-navy">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span> : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="hover:text-navy disabled:opacity-30">&larr; Prev</button>
        <span>Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="hover:text-navy disabled:opacity-30">Next &rarr;</button>
      </div>
    </div>
  );
}
