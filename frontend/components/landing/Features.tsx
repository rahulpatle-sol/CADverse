"use client";

import { motion } from "framer-motion";
import { Boxes, Layers, ShieldCheck, Target } from "lucide-react";
import { GlowOrb, Reveal, SectionHeading } from "./ui";

const FORMAT_SPEED = [
  { ext: ".DWG", t: "0.8s", pct: 100, tone: "#8B5CF6" },
  { ext: ".DXF", t: "0.6s", pct: 88, tone: "#06B6D4" },
  { ext: ".DWT", t: "0.9s", pct: 74, tone: "#4F46E5" },
  { ext: ".DWS", t: "1.1s", pct: 62, tone: "#34D399" },
];

const LAYERS = [
  { name: "Roads", pct: 92, tone: "#8B5CF6", qty: "14,820 m²" },
  { name: "Water", pct: 74, tone: "#06B6D4", qty: "3,240 m" },
  { name: "Electrical", pct: 61, tone: "#4F46E5", qty: "1,875 m" },
  { name: "Structural", pct: 43, tone: "#34D399", qty: "218 ea" },
];

function IconTile({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-1"
      style={{
        borderColor: `${tone}45`,
        background: `${tone}14`,
        boxShadow: `0 0 40px -14px ${tone}`,
      }}
    >
      {children}
    </span>
  );
}

function CardShell({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="card-lux group flex h-full flex-col rounded-2xl p-6 sm:p-7">
        {children}
      </div>
    </Reveal>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <GlowOrb className="left-1/4 top-0 h-[420px] w-[520px] -translate-x-1/2" color="rgba(139,92,246,0.45)" />
      <GlowOrb className="bottom-10 right-1/4 h-[360px] w-[420px]" color="rgba(6,182,212,0.4)" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Feature matrix"
          title="Everything an estimating team needs,"
          accent="in one engine."
          description="From raw file ingestion to a boardroom-ready cost report — built for civil, infrastructure and multi-disciplinary design practices."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {/* A — Multi-file format support */}
          <CardShell className="md:col-span-2 lg:col-span-4">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-md">
                <IconTile tone="#8B5CF6">
                  <Boxes className="h-5 w-5 text-neon-violet" />
                </IconTile>
                <h3 className="mt-5 text-lg font-semibold text-white">Multi-File Format Support</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
                  Native parsing for all major CAD drawing types — no re-saving, no plugins, no
                  geometry loss. Templates and standards files are honoured exactly as authored.
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300 sm:inline-flex">
                4 native parsers
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {FORMAT_SPEED.map((f) => (
                <div
                  key={f.ext}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition-colors duration-300 group-hover:border-white/[0.12]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-semibold" style={{ color: f.tone }}>
                      {f.ext}
                    </span>
                    <span className="font-mono text-[11px] text-ink-500">avg {f.t}</span>
                  </div>
                  <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${f.tone}, #ffffff22)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.pct}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardShell>

          {/* B — Layered quantity analysis */}
          <CardShell className="md:col-span-1 lg:col-span-2" delay={0.08}>
            <IconTile tone="#06B6D4">
              <Layers className="h-5 w-5 text-neon-cyan" />
            </IconTile>
            <h3 className="mt-5 text-lg font-semibold text-white">Layered Quantity Analysis</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
              Separates complex civil maps into clear road, water, electric and structural
              categories — each with its own takeoff.
            </p>

            <div className="mt-6 flex flex-col gap-3.5">
              {LAYERS.map((l) => (
                <div key={l.name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-300">{l.name}</span>
                    <span className="font-mono text-ink-500">{l.qty}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${l.tone}, ${l.tone}55)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.pct}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardShell>

          {/* C — Verified accuracy */}
          <CardShell className="md:col-span-1 lg:col-span-2" delay={0.04}>
            <IconTile tone="#4F46E5">
              <Target className="h-5 w-5 text-neon-indigo" />
            </IconTile>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Verified Cost Accuracy <span className="text-accent">99.8%</span>
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
              AI cross-references local material indexes and labor rates, eliminating the drift
              that manual estimating introduces.
            </p>

            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              {[
                { label: "Arch-Cost AI", pct: 99.8, tone: "#34D399", value: "99.8%" },
                { label: "Manual estimate", pct: 71, tone: "#F5B94D", value: "±12.4%" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-300">{b.label}</span>
                    <span className="font-mono" style={{ color: b.tone }}>
                      {b.value}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: b.tone, boxShadow: `0 0 14px -2px ${b.tone}` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardShell>

          {/* D — Enterprise security */}
          <CardShell className="md:col-span-2 lg:col-span-4" delay={0.1}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <IconTile tone="#34D399">
                  <ShieldCheck className="h-5 w-5 text-neon-emerald" />
                </IconTile>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  Enterprise Security &amp; Data Safety
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
                  A private parsing sandbox for sensitive infrastructure blueprints. Files are
                  encrypted in transit and at rest, isolated per workspace, and purged on your
                  schedule.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["SOC-2 aligned", "AES-256 at rest", "TLS 1.3", "Zero retention mode"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full flex-1 rounded-xl border border-white/[0.08] bg-obsidian-950/80 p-4 sm:max-w-[300px]">
                <div className="flex items-center gap-1.5 border-b border-white/[0.07] pb-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                  <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                  <span className="ml-2 font-mono text-[10px] text-ink-500">sandbox.log</span>
                </div>
                <ul className="mt-3 flex flex-col gap-2 font-mono text-[11.5px] leading-relaxed">
                  {[
                    { k: "workspace", v: "isolated", c: "#34D399" },
                    { k: "encryption", v: "aes-256-gcm", c: "#34D399" },
                    { k: "retention", v: "0h · auto-purge", c: "#06B6D4" },
                    { k: "access", v: "rbac + sso", c: "#8B5CF6" },
                    { k: "audit", v: "immutable trail", c: "#34D399" },
                  ].map((r) => (
                    <li key={r.k} className="flex items-center justify-between gap-3">
                      <span className="text-ink-500">{r.k}</span>
                      <span style={{ color: r.c }}>{r.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
