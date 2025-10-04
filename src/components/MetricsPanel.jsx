import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;
  const accPct = Math.round(metrics.accuracy * 1000) / 10;
  const conf = metrics.confusion || [[0, 0], [0, 0]];

  return (
    <div className="p-4 rounded-2xl bg-white/4 border border-white/6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold">Model Metrics</h4>
          <div className="text-3xl font-bold mt-2">{accPct}%</div>
          <div className="text-sm text-slate-300 mt-1">Overall Accuracy</div>
        </div>
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={[{ name: "acc", value: metrics.accuracy * 100 }]}>
              <Line dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <h5 className="text-white/80 font-medium">Confusion Matrix</h5>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="p-3 rounded-lg bg-white/3">True Positives: <strong>{conf[1][1]}</strong></div>
          <div className="p-3 rounded-lg bg-white/3">False Positives: <strong>{conf[0][1]}</strong></div>
          <div className="p-3 rounded-lg bg-white/3">False Negatives: <strong>{conf[1][0]}</strong></div>
          <div className="p-3 rounded-lg bg-white/3">True Negatives: <strong>{conf[0][0]}</strong></div>
        </div>
      </div>
    </div>
  );
}
