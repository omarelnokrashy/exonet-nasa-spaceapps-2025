import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ShapExplanation({ shapValues = [] }) {
  if (!shapValues || shapValues.length === 0) return null;
  const chartData = shapValues.map((s) => ({ name: s.feature || s.featureName || "feat", contribution: s.contribution || s.value || 0 }));

  return (
    <div className="p-4 rounded-2xl bg-white/4 border border-white/6">
      <h4 className="text-white font-semibold">SHAP Feature Contributions</h4>
      <div className="mt-3 h-48">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 6, right: 8, left: 8, bottom: 6 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fill: "#e6eef8" }} />
            <Tooltip />
            <Bar dataKey="contribution" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-slate-300 text-sm">Positive contributions push prediction toward "Exoplanet". Negative reduce likelihood.</div>
    </div>
  );
}
