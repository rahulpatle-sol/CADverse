"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CostEstimate, RateCard } from "@/lib/api";
import { colorForLayer } from "@/lib/colors";

interface CostBreakdownProps {
  costEstimate: CostEstimate;
  rateCard: RateCard | null;
  selectedLayer: string | null;
  onSelectLayer: (layerName: string | null) => void;
}

const MATERIAL_LABELS: Record<string, string> = {
  sandPerMeter: "Sand",
  cementBagsPerMeter: "Cement bags",
  aggregatePerMeter: "Aggregate",
  pipeLengthPerMeter: "Pipe length",
  cablePerMeter: "Cable length",
  cementBagsPerSqm: "Cement bags",
};

const MATERIAL_UNITS: Record<string, string> = {
  sandPerMeter: "m³",
  cementBagsPerMeter: "bags",
  aggregatePerMeter: "m³",
  pipeLengthPerMeter: "m",
  cablePerMeter: "m",
  cementBagsPerSqm: "bags",
};

function formatQty(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function CostBreakdown({ costEstimate, rateCard, selectedLayer, onSelectLayer }: CostBreakdownProps) {
  const { breakdown, materialTotals, unmatchedLayers, rateCardLastUpdated } = costEstimate;
  // layerName -> category the user manually picked for an unmatched layer
  const [manualMappings, setManualMappings] = useState<Record<string, string>>({});

  const manualItems = useMemo(() => {
    if (!rateCard) return [];
    return unmatchedLayers
      .filter((l) => manualMappings[l.layer])
      .map((l) => {
        const category = manualMappings[l.layer];
        const def = rateCard.rates[category];
        if (!def) return null;
        const quantity = def.unit === "meter" ? l.totalLength : def.unit === "sqmeter" ? l.area : l.entityCount;
        const cost = Math.round(quantity * def.costPerUnit);
        const materials: Record<string, number> = {};
        for (const [matKey, perUnit] of Object.entries(def.materials || {})) {
          materials[matKey] = Math.round(quantity * perUnit * 100) / 100;
        }
        return { layerName: l.layer, category, description: def.description, unit: def.unit, quantity, costPerUnit: def.costPerUnit, cost, materials, manual: true };
      })
      .filter(Boolean) as { layerName: string; category: string; description: string; unit: string; quantity: number; costPerUnit: number; cost: number; materials: Record<string, number>; manual: true }[];
  }, [manualMappings, unmatchedLayers, rateCard]);

  const manualTotal = manualItems.reduce((sum, i) => sum + i.cost, 0);
  const combinedTotal = costEstimate.grandTotal + manualTotal;

  const combinedMaterials = useMemo(() => {
    const merged = { ...materialTotals };
    for (const item of manualItems) {
      for (const [k, v] of Object.entries(item.materials)) {
        merged[k] = Math.round(((merged[k] || 0) + v) * 100) / 100;
      }
    }
    return merged;
  }, [materialTotals, manualItems]);

  const stillUnmatched = unmatchedLayers.filter((l) => !manualMappings[l.layer]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
      {/* Grand total */}
      <div className="rounded-lg border border-blueprint-700 bg-blueprint-800/60 p-4">
        <p className="text-xs uppercase tracking-wide text-ink-500">Estimated project cost</p>
        <p className="mt-1 font-mono text-3xl font-semibold text-draft-cyan">{formatINR(combinedTotal)}</p>
        <p className="mt-1 text-xs text-ink-500">Rates as of {rateCardLastUpdated} · MP region default</p>
        {manualTotal > 0 && (
          <p className="mt-1 text-xs text-ink-500">Includes {formatINR(manualTotal)} from manually mapped layers</p>
        )}
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-ink-500">Cost by category</p>
        {[...breakdown, ...manualItems].map((item) => {
          const isSelected = selectedLayer === item.layerName;
          const color = colorForLayer(item.layerName, item.category);
          return (
            <motion.button
              key={item.layerName}
              onClick={() => onSelectLayer(isSelected ? null : item.layerName)}
              whileTap={{ scale: 0.99 }}
              className={`w-full rounded-md border p-3 text-left transition-colors duration-150
                ${isSelected ? "border-draft-cyan bg-draft-cyan/5" : "border-blueprint-700 bg-blueprint-800/40 hover:border-blueprint-600"}
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate text-sm font-medium text-ink-100">{item.layerName}</span>
                  {"manual" in item && (
                    <span className="shrink-0 rounded bg-draft-amber/15 px-1.5 py-0.5 text-[10px] text-draft-amber">manual</span>
                  )}
                </div>
                <span className="shrink-0 font-mono text-sm text-ink-100">
                  ₹{formatQty(item.cost)}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-ink-500">{item.description}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-300">
                <span className="font-mono">
                  {formatQty(item.quantity)} {item.unit === "sqmeter" ? "m²" : item.unit === "meter" ? "m" : "units"}
                </span>
                <span className="font-mono text-ink-500">@ ₹{item.costPerUnit}/{item.unit === "sqmeter" ? "m²" : item.unit === "meter" ? "m" : "unit"}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {stillUnmatched.length > 0 && rateCard && (
        <div className="rounded-md border border-draft-amber/30 bg-draft-amber/5 p-3">
          <p className="text-xs font-medium text-draft-amber">
            {stillUnmatched.length} layer{stillUnmatched.length > 1 ? "s" : ""} need mapping
          </p>
          <p className="mt-1 text-xs text-ink-500">
            This file's layer names don't match the rate card. Pick what each one actually is
            to include it in the total.
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {stillUnmatched.map((l) => (
              <li key={l.layer} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-ink-300">{l.layer}</span>
                <select
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setManualMappings((m) => ({ ...m, [l.layer]: e.target.value }));
                  }}
                  defaultValue=""
                  className="shrink-0 rounded border border-blueprint-700 bg-blueprint-900 px-2 py-1 text-xs text-ink-100"
                >
                  <option value="" disabled>Map to…</option>
                  {Object.entries(rateCard.rates).map(([key, def]) => (
                    <option key={key} value={key}>{key.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Materials summary */}
      <div className="rounded-lg border border-blueprint-700 bg-blueprint-800/40 p-4">
        <p className="text-xs uppercase tracking-wide text-ink-500">Materials required</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {Object.entries(combinedMaterials).map(([key, qty]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-ink-300">{MATERIAL_LABELS[key] || key}</span>
              <span className="font-mono text-ink-100">
                {formatQty(qty as number)} {MATERIAL_UNITS[key] || ""}
              </span>
            </div>
          ))}
          {Object.keys(combinedMaterials).length === 0 && (
            <p className="text-xs text-ink-500">No materials computed yet — map layers above.</p>
          )}
        </div>
      </div>
    </div>
  );
}