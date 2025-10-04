import React from "react";
import Papa from "papaparse";

export default function DataInput({ onFieldChange, onCsvParsed, runPrediction, loading, fileRef }) {
  function parseFile(file) {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onCsvParsed(results.data);
      },
      error: (err) => console.error("CSV parse error", err),
    });
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div>
        <h4 className="text-sm font-medium">Manual Entry</h4>
        <div className="mt-2 space-y-2">
          {[
"pl_radeerr2",
"sy_vmag",
"sy_pnum",
"dec",
"soltype",
"sy_kmag",
"sy_disterr1",
"sy_disterr2",
"default_flag",
"disc_year",
"sy_gaiamag",
"disposition"
]
.map((k) => (
            <div key={k} className="flex items-center gap-2">
              <input
                placeholder={k}
                onChange={(e) => onFieldChange(k, e.target.value)}
                className="text-black border rounded px-2 py-1"
                aria-label={k}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <button onClick={runPrediction} disabled={loading} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              {loading ? "Running..." : "Predict"}
            </button>
            <button onClick={() => { /* clear handled by parent if needed */ }} className="py-2 px-3 rounded-lg bg-white/6">
              Clear
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">CSV Upload</h4>
        <div className="mt-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={(e) => parseFile(e.target.files[0])}
            className="w-full p-2 rounded-lg bg-white/6"
            aria-label="CSV upload"
          />
          <div className="text-xs text-slate-300 mt-2">Tip: CSV should contain headers matching model input features.</div>
        </div>
      </div>
    </div>
  );
}
