import React from "react";
import { Download } from "lucide-react";

export default function BatchProcessor({ fileRef, onCsvParsed, rowsCount, runBatch, exportCsv, loading }) {
  return (
    <>
      <h3 className="font-semibold">Batch Processing</h3>
      <div className="mt-2 text-sm text-slate-300">Upload CSV of observations, run bulk predictions, and export results.</div>

      <div className="mt-3 flex flex-col gap-2">
        <input ref={fileRef} type="file" accept=".csv" onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          // let parent handle parsing (this input duplicates DataInput's parsing for convenience)
          const reader = new FileReader();
          reader.onload = function () {
            try {
              // use PapaParse from parent if available; fallback simple parse
              const text = reader.result;
              // quick CSV parse — better to hand to Papa in parent
              const lines = text.split(/\r?\n/).filter(Boolean);
              if (lines.length < 2) {
                onCsvParsed([]);
                return;
              }
              const headers = lines[0].split(",").map(h => h.trim());
              const rows = lines.slice(1).map(line => {
                const vals = line.split(",").map(v => v.trim());
                return headers.reduce((acc, h, i) => { acc[h] = vals[i] ?? ""; return acc; }, {});
              });
              onCsvParsed(rows);
            } catch (err) {
              console.error(err);
              onCsvParsed([]);
            }
          };
          reader.readAsText(file);
        }} className="text-sm" />
        <div className="flex gap-2">
          <button onClick={runBatch} disabled={loading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
            {loading ? "Processing..." : "Run Batch"}
          </button>
          <button onClick={exportCsv} className="py-2 px-3 rounded-lg bg-white/6 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-300">{rowsCount} rows ready</div>
      </div>
    </>
  );
}
