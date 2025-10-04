import React from "react";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function ModelSelector({ models = [], selected, onSelect }) {
  return (
    <div className="space-y-3">
      {models.map((m) => {
        const active = selected && selected.id === m.id;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-2xl shadow-lg glass border border-white/6 cursor-pointer ${active ? "ring-2 ring-indigo-400/40" : ""}`}
            onClick={() => onSelect(m)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-white/80" />
                  <h3 className="text-white font-semibold">{m.name}</h3>
                </div>
                <p className="text-sm text-slate-300/80 mt-2">{m.desc}</p>
              </div>
              <div className="text-sm text-slate-300/70">{m.tags?.join(" • ")}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
