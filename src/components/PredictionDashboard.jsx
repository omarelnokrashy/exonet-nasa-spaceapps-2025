import React from "react";
import { Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import ShapExplanation from "./ShapExplanation";

export default function PredictionDashboard({ prediction, shapValues }) {
  if (!prediction) return null;
  
  // Handle case where probs might be undefined
  if (!prediction.probs) {
    return (
      <div className="p-4 rounded-2xl bg-white/5 border border-white/6 shadow-md">
        <div className="text-red-400">Error: Invalid prediction format</div>
        <div className="text-sm text-slate-400 mt-2">Expected prediction.probs but got: {JSON.stringify(prediction)}</div>
      </div>
    );
  }
  
  const probs = Object.entries(prediction.probs).map(([name, v]) => ({ name, value: Math.round(v * 100) }));

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-bold">Prediction</h4>
          <div className="text-slate-200/90 text-lg mt-1">
            {prediction.label} <span className="text-sm text-slate-400">({(prediction.confidence * 100).toFixed(1)}%)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 h-32">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={probs} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: "#e6eef8" }} />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3">
        <ShapExplanation shapValues={shapValues} />
      </div>
    </div>
  );
}
