import React, { useEffect, useRef, useState } from "react";
import { Globe, Upload, Settings2 } from "lucide-react";
import ModelSelector from "./components/ModelSelector";
import DataInput from "./components/DataInput";
import BatchProcessor from "./components/BatchProcessor";
import PredictionDashboard from "./components/PredictionDashboard";
import MetricsPanel from "./components/MetricsPanel";

export default function App() {
  // central state
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [csvRows, setCsvRows] = useState([]);
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [shapValues, setShapValues] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

useEffect(() => {
  async function fetchModels() {
    try {
      const res = await fetch("http://localhost:3001/models");
      const data = await res.json();
      console.log("Fetched models:", data); // Debug log

      setModels(data);
      setSelectedModel(data[0]); // or your preferred default
      // Optionally fetch metrics for the first model
      // setMetrics(await fetchMetrics(data[0].id));
    } catch (err) {
      console.error("Failed to fetch models:", err);
    }
  }
  fetchModels();
}, []);

  // CSV handler (wired from DataInput or BatchProcessor)
  function handleCsvUpload(rows) {
    setCsvRows(rows);
  }

  function onChangeField(key, val) {
    setFormData((s) => ({ ...s, [key]: val }));
  }

 // filepath: c:\WebSite deployment-2\exoclass\src\App.jsx
async function runPrediction() {
  if (!selectedModel) return;
  setLoading(true);
  setPrediction(null);
  try {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelId: selectedModel.id,
        data: formData,
      }),
    });
    const result = await res.json();
    setPrediction(result);
    setShapValues(result.shapValues); // if your API returns SHAP values
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

async function runBatchPrediction() {
  if (!selectedModel || csvRows.length === 0) return;
  setLoading(true);
  setBatchResults([]);
  try {
    const res = await fetch("http://localhost:5000/batch_predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelId: selectedModel.id,
        inputs: csvRows,
      }),
    });
    const results = await res.json();
    setBatchResults(results);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  function exportBatchCSV() {
    // produce CSV from batchResults
    const headers = new Set();
    batchResults.forEach((r) => Object.keys(r.input).forEach((k) => headers.add(k)));
    const headerArr = [...headers, "predicted", "probability"];
    const csv = [
      headerArr.join(","),
      ...batchResults.map((r) => {
        const row = headerArr.map((h) => {
          if (h === "predicted") return r.label;
          if (h === "probability") return r.prob.toFixed(4);
          return JSON.stringify(r.input[h] ?? "");
        });
        return row.join(",");
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exoclass_batch_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function mockShap(input) {
    const keys = Object.keys(input).slice(0, 6);
    return keys.map((k) => ({ feature: k, contribution: Number(((Math.random() - 0.5) * 0.6).toFixed(3)) }));
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-slate-900 via-emerald-900/10 to-black text-white relative">
      <div className="cosmic-bg" aria-hidden />
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-2xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">ExoClass</h1>
              <div className="text-sm text-slate-300">NASA-inspired exoplanet classification — deploy, explain, and iterate</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg flex items-center gap-2">
              <Upload className="w-4 h-4" /> Deploy
            </button>
            <button className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Settings
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-4">
            <div className="p-4 rounded-2xl glass border border-white/6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Model Selection Hub</h2>
                <div className="text-sm text-slate-300">{models.length} models</div>
              </div>

              <div className="mt-4 space-y-3">
                <ModelSelector models={models} selected={selectedModel} onSelect={setSelectedModel} />
              </div>
    
            </div>

            <div className="mt-6 p-4 rounded-2xl glass border border-white/6">
              <BatchProcessor
                fileRef={fileRef}
                onCsvParsed={handleCsvUpload}
                rowsCount={csvRows.length}
                runBatch={runBatchPrediction}
                exportCsv={exportBatchCSV}
                loading={loading}
              />
            </div>
          </section>

          <section className="col-span-5">
            <div className="p-4 rounded-2xl glass border border-white/6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Dual Input — CSV or Manual</h2>
                <div className="text-sm">Selected: <strong>{selectedModel?.name}</strong></div>
              </div>

              <DataInput
                onFieldChange={onChangeField}
                onCsvParsed={handleCsvUpload}
                runPrediction={runPrediction}
                loading={loading}
                fileRef={fileRef}
              />

              <div className="mt-4">
                <PredictionDashboard prediction={prediction} shapValues={shapValues} />
              </div>
            </div>

            <div className="mt-6">
              <MetricsPanel metrics={metrics} />
            </div>
          </section>

          <aside className="col-span-3">
            <div className="p-4 rounded-2xl glass border border-white/6 mb-4">
              <h3 className="font-semibold">Recent Predictions</h3>
              <div className="mt-3 space-y-2 max-h-56 overflow-auto">
                {batchResults.slice(0, 7).map((r) => (
                  <div key={r.id} className="p-2 rounded-lg bg-white/4 flex items-center justify-between">
                    <div className="text-sm">
                      <strong>{r.label}</strong>
                      <div className="text-xs text-slate-300">{Object.values(r.input).slice(0, 2).join(", ")}</div>
                    </div>
                    <div className="text-xs">{(r.prob * 100).toFixed(1)}%</div>
                  </div>
                ))}
                {batchResults.length === 0 && <div className="text-slate-300 text-sm">No recent batch results</div>}
              </div>
            </div>

            <div className="p-4 rounded-2xl glass border border-white/6">
              <h3 className="font-semibold">Model Explorer</h3>
              <div className="mt-2 text-sm text-slate-300">Quickly inspect model versions, input schema, and explainability support.</div>
              <div className="mt-3 grid gap-2">
                <div className="p-2 rounded-lg bg-white/4">Schema: flux, period, duration, depth, snr</div>
                <div className="p-2 rounded-lg bg-white/4">SHAP: enabled</div>
                <div className="p-2 rounded-lg bg-white/4">Latency: 40–120ms (est)</div>
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-8 text-sm text-slate-400">Built with ♥ for exoplanet hunters — wireframes & demo code. Replace demo endpoints with real model API for production.</footer>
      </div>
    </div>
  );
}
