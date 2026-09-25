"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  Check,
  CircleDollarSign,
  FileCheck2,
  Layers,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { GlowOrb, Reveal, SectionHeading } from "./ui";

type Status = "idle" | "dragging" | "running" | "done";

const STAGES = [
  {
    title: "File Uploading & Integrity Check",
    detail: "Encrypted channel · SHA-256 integrity handshake",
    Icon: ShieldCheck,
    tone: "#8B5CF6",
  },
  {
    title: "Layer Separation",
    detail: "Roads · Water pipelines · Electrical grids",
    Icon: Layers,
    tone: "#06B6D4",
  },
  {
    title: "LLM Quantity Takeoff & Variable Extraction",
    detail: "Vector geometry → material and labor variables",
    Icon: BrainCircuit,
    tone: "#4F46E5",
  },
  {
    title: "Live Cost Output Generation",
    detail: "Local material index cross-reference",
    Icon: CircleDollarSign,
    tone: "#34D399",
  },
];

const VARIABLES = [
  { label: "Road Asphalt Surface Area", value: 14820, unit: "m²", tone: "#8B5CF6" },
  { label: "Water Pipe Line Length", value: 3240, unit: "m", tone: "#06B6D4" },
  { label: "Conduit Runs (Electrical)", value: 1875, unit: "m", tone: "#4F46E5" },
  { label: "Manholes / Junction Boxes", value: 46, unit: "ea", tone: "#34D399" },
  { label: "Excavation Volume", value: 9120, unit: "m³", tone: "#F5B94D" },
];

const ROWS = [
  { item: "Asphalt wearing course · 40 mm", qty: "14,820", unit: "m²", rate: 18.4, total: 272688 },
  { item: "HDPE water pipe · DN200 PN10", qty: "3,240", unit: "m", rate: 46.0, total: 149040 },
  { item: "Electrical conduit · 25 mm", qty: "1,875", unit: "m", rate: 12.75, total: 23906 },
  { item: "Precast manhole · Ø1200", qty: "46", unit: "ea", rate: 680.0, total: 31280 },
  { item: "Earthwork excavation · bulk", qty: "9,120", unit: "m³", rate: 9.2, total: 83904 },
];

const TOTAL = 560818;
const SAMPLE_NAME = "municipal-bypass-route.dwg";

/* ---------------------------------------------------------------- */

function useCountUp(target: number, active: boolean, decimals = 0, duration = 1300) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, decimals, duration, reduce]);

  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");
}

function VariableRow({
  label,
  value,
  unit,
  tone,
  active,
}: {
  label: string;
  value: number;
  unit: string;
  tone: string;
  active: boolean;
}) {
  const shown = useCountUp(value, active);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 last:border-0"
    >
      <span className="flex items-center gap-2.5 text-[13px] text-ink-300">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: tone, boxShadow: `0 0 8px 1px ${tone}` }}
        />
        {label}
      </span>
      <span className="shrink-0 font-mono text-[13px] font-medium text-white">
        {shown} <span className="text-ink-500">{unit}</span>
      </span>
    </motion.div>
  );
}

function PrecisionGauge({ active }: { active: boolean }) {
  const pct = useCountUp(99.8, active, 1, 1500);
  const r = 44;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative flex h-[124px] w-[124px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: active ? c * (1 - 0.998) : c }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="60%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="font-mono text-xl font-semibold text-white">{pct}%</span>
        <span className="mono-label text-[9px] text-neon-cyan">verified</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export default function Playground() {
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback((name: string) => {
    setFileName(name);
    setStage(0);
    setStatus("running");
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    if (stage >= STAGES.length - 1) {
      const t = setTimeout(() => setStatus("done"), 1100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 1050);
    return () => clearTimeout(t);
  }, [status, stage]);

  const reset = useCallback(() => {
    setStatus("idle");
    setStage(0);
    setFileName(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      start(file ? file.name : SAMPLE_NAME);
    },
    [start],
  );

  const done = status === "done";
  const progress = status === "idle" ? 0 : ((stage + (done ? 1 : 0)) / STAGES.length) * 100;

  return (
    <section id="workflow" className="relative overflow-hidden py-24 sm:py-32">
      <GlowOrb className="left-1/2 top-10 h-[460px] w-[640px] -translate-x-1/2" color="rgba(79,70,229,0.5)" />
      <GlowOrb className="bottom-0 right-0 h-[380px] w-[380px]" color="rgba(6,182,212,0.4)" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Interactive ingestion playground"
          title="Drop a drawing. Watch the engine"
          accent="think."
          description="Drag a CAD file into the sandbox — or load the sample map — and follow every stage from integrity check to a fully itemized, verified cost report."
        />

        <Reveal delay={0.1} y={36} className="mx-auto mt-14 max-w-6xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-900/60 shadow-card-lux backdrop-blur-xl">
            {/* top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-emerald shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
                arch-cost parser · sandbox
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-ink-500">
                  {done ? "report ready" : status === "running" ? `stage ${stage + 1}/4` : "awaiting file"}
                </span>
                {status !== "idle" && (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-ink-300 transition-colors hover:border-white/25 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              {/* ---------------- dropzone ---------------- */}
              <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".dwg,.dxf,.dwt,.dws"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) start(f.name);
                    e.target.value = "";
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (status === "idle") setStatus("dragging");
                  }}
                  onDragLeave={() => setStatus((s) => (s === "dragging" ? "idle" : s))}
                  onDrop={onDrop}
                  onClick={() => status === "idle" && inputRef.current?.click()}
                  role={status === "idle" ? "button" : undefined}
                  tabIndex={status === "idle" ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (status === "idle" && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  className={cn(
                    "relative flex min-h-[248px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-8 text-center transition-all duration-300",
                    status === "dragging"
                      ? "border-neon-cyan/70 bg-neon-cyan/[0.07] shadow-glow-cyan"
                      : "border-white/15 bg-white/[0.02] hover:border-neon-violet/50 hover:bg-white/[0.04]",
                    status === "idle" ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {status === "idle" || status === "dragging" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          <Upload className="h-6 w-6 text-neon-cyan" />
                          <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-neon-violet/50" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {status === "dragging"
                              ? "Release to start the parse"
                              : "Drag & drop your CAD file here"}
                          </p>
                          <p className="mt-1.5 text-[13px] text-ink-500">
                            or click to browse — nothing leaves the sandbox
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {[".DWG", ".DXF", ".DWT", ".DWS"].map((e) => (
                            <span
                              key={e}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-ink-300"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="run"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="flex w-full flex-col items-center gap-5"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-violet/40 bg-neon-violet/10">
                          {done ? (
                            <BadgeCheck className="h-6 w-6 text-neon-emerald" />
                          ) : (
                            <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
                          )}
                        </span>
                        <div className="w-full">
                          <p className="truncate font-mono text-sm text-white">{fileName}</p>
                          <p className="mt-1 text-[13px] text-ink-500">
                            {done ? "Parse complete · 4 layers detected" : STAGES[stage].detail}
                          </p>
                        </div>
                        <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            className="h-full rounded-full bg-accent-gradient"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[11px] text-ink-500">
                          <span>integrity: pass</span>
                          <span>layers: 4</span>
                          <span>entities: 12,408</span>
                          <span className="text-neon-cyan">precision: 99.8%</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => (status === "idle" ? start(SAMPLE_NAME) : reset())}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition-all duration-300 hover:border-neon-violet/50 hover:bg-neon-violet/10 hover:text-white"
                >
                  {status === "idle" ? (
                    <>
                      <FileCheck2 className="h-4 w-4 text-neon-cyan" />
                      Load Sample Map
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Run another file
                    </>
                  )}
                </button>
              </div>

              {/* ---------------- stage timeline ---------------- */}
              <div className="p-5 sm:p-7">
                <p className="mono-label mb-4 text-ink-500">Pipeline status</p>
                <ol className="flex flex-col gap-3">
                  {STAGES.map((s, i) => {
                    const state = status === "idle" || status === "dragging"
                      ? "pending"
                      : done || i < stage
                        ? "complete"
                        : i === stage
                          ? "active"
                          : "pending";
                    return (
                      <li
                        key={s.title}
                        className={cn(
                          "relative flex gap-3.5 rounded-xl border p-3.5 transition-all duration-300",
                          state === "active" &&
                            "border-neon-violet/50 bg-neon-violet/[0.08] shadow-glow-violet",
                          state === "complete" && "border-neon-emerald/25 bg-neon-emerald/[0.05]",
                          state === "pending" && "border-white/[0.07] bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                            state === "active"
                              ? "border-neon-violet/50 bg-neon-violet/15 text-neon-violet"
                              : state === "complete"
                                ? "border-neon-emerald/40 bg-neon-emerald/10 text-neon-emerald"
                                : "border-white/10 bg-white/[0.03] text-ink-500",
                          )}
                        >
                          {state === "complete" ? (
                            <Check className="h-4 w-4" />
                          ) : state === "active" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <s.Icon className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-[13px] font-medium leading-snug",
                              state === "pending" ? "text-ink-500" : "text-white",
                            )}
                          >
                            {s.title}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-snug text-ink-500/85">
                            {s.detail}
                          </p>
                        </div>
                        <span
                          className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            color:
                              state === "complete"
                                ? "#34D399"
                                : state === "active"
                                  ? "#8B5CF6"
                                  : "rgba(122,140,166,0.7)",
                          }}
                        >
                          {state === "complete" ? "done" : state === "active" ? "run" : "wait"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* ---------------- results ---------------- */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-white/[0.07]"
                >
                  <div className="grid gap-0 lg:grid-cols-[1fr_1.25fr]">
                    {/* extracted variables */}
                    <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="mono-label text-ink-500">Extracted variables</p>
                        <span className="flex items-center gap-1.5 font-mono text-[11px] text-neon-violet">
                          <BrainCircuit className="h-3.5 w-3.5" />
                          LLM takeoff
                        </span>
                      </div>
                      <div>
                        {VARIABLES.map((v) => (
                          <VariableRow key={v.label} {...v} active={done} />
                        ))}
                      </div>
                    </div>

                    {/* estimate report */}
                    <div className="p-5 sm:p-7">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="mono-label text-ink-500">Itemized estimate report</p>
                        <span className="rounded-full border border-neon-emerald/30 bg-neon-emerald/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-emerald">
                          99.8% verified
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[460px] border-collapse text-left">
                          <thead>
                            <tr className="border-b border-white/[0.08]">
                              {["Item", "Qty", "Rate", "Total"].map((h) => (
                                <th
                                  key={h}
                                  className="pb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] font-normal text-ink-500 last:text-right"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {ROWS.map((r, i) => (
                              <motion.tr
                                key={r.item}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                                className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.03]"
                              >
                                <td className="py-2.5 pr-3 text-[13px] text-ink-300">{r.item}</td>
                                <td className="py-2.5 pr-3 font-mono text-[12px] text-white">
                                  {r.qty}
                                  <span className="ml-1 text-ink-500">{r.unit}</span>
                                </td>
                                <td className="py-2.5 pr-3 font-mono text-[12px] text-ink-300">
                                  ${r.rate.toFixed(2)}
                                </td>
                                <td className="py-2.5 text-right font-mono text-[12px] font-medium text-white">
                                  ${r.total.toLocaleString("en-US")}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-5 flex flex-col gap-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="mono-label text-ink-500">Overall estimate</p>
                          <p className="mt-1.5 font-mono text-2xl font-semibold text-white">
                            ${TOTAL.toLocaleString("en-US")}
                          </p>
                          <p className="mt-1 text-[12px] text-ink-500">
                            Currency: USD · Rates refreshed 2h ago
                          </p>
                        </div>
                        <PrecisionGauge active={done} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
