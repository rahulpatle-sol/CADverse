"use client";

import { motion } from "framer-motion";
import { BrainCircuit, BadgeCheck, ScanLine, ShieldCheck } from "lucide-react";
import { GlowOrb, Reveal, SectionHeading } from "./ui";

const STEPS = [
  {
    step: "01",
    title: "Secure CAD Upload",
    description:
      "Encrypted parser supporting .DWG, .DXF, .DWT, and .DWS files. Every blueprint is handled inside an isolated ingestion sandbox.",
    meta: "AES-256 · TLS 1.3",
    Icon: ShieldCheck,
    tone: "#8B5CF6",
  },
  {
    step: "02",
    title: "Backend Parsing & Geometry Analysis",
    description:
      "Detects vector geometry, spatial coordinates, road lengths, and pipe diameters across every layer of the drawing.",
    meta: "12,408 entities / sec",
    Icon: ScanLine,
    tone: "#06B6D4",
  },
  {
    step: "03",
    title: "LLM Variable Extraction",
    description:
      "Translates CAD vector variables into real-world material quantities and labor specs with context-aware reasoning.",
    meta: "CAD-aware LLM layer",
    Icon: BrainCircuit,
    tone: "#4F46E5",
  },
  {
    step: "04",
    title: "Accurate Cost Output",
    description:
      "Generates instant, verified line-item cost reports cross-referenced against live local market indexes.",
    meta: "99.8% precision",
    Icon: BadgeCheck,
    tone: "#34D399",
  },
];

export default function Pipeline() {
  return (
    <section id="technology" className="relative overflow-hidden py-24 sm:py-32">
      <GlowOrb className="-left-40 top-1/3 h-[420px] w-[420px]" color="rgba(6,182,212,0.45)" />
      <GlowOrb className="-right-32 bottom-0 h-[440px] w-[440px]" color="rgba(139,92,246,0.5)" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="How Arch-Cost secures"
          accent="your estimates"
          description="A four-stage pipeline that moves your drawing from raw vector geometry to a signed-off, market-accurate cost report — without a human touching a scale."
        />

        <div className="relative mt-16">
          {/* connector rail */}
          <div className="pointer-events-none absolute left-0 right-0 top-[74px] hidden h-px lg:block">
            <div className="h-px w-full bg-white/[0.08]" />
            <motion.div
              className="absolute inset-y-0 left-0 h-px bg-accent-gradient shadow-[0_0_12px_2px_rgba(139,92,246,0.6)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
            />
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1} className="h-full" as="li">
                <div className="group relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-obsidian-950/85 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-neon-violet/40 hover:shadow-glow-violet">
                  <span className="absolute right-5 top-5 font-mono text-[11px] tracking-[0.2em] text-white/15 transition-colors duration-300 group-hover:text-white/35">
                    {s.step}
                  </span>

                  <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                      borderColor: `${s.tone}45`,
                      background: `${s.tone}14`,
                      boxShadow: `0 0 40px -14px ${s.tone}`,
                    }}
                  >
                    <s.Icon className="h-5 w-5" style={{ color: s.tone }} />
                    <span
                      className="absolute inset-0 animate-pulse-ring rounded-xl border"
                      style={{ borderColor: `${s.tone}55` }}
                    />
                  </span>

                  <h3 className="mt-5 text-[15px] font-semibold leading-snug text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-ink-500">
                    {s.description}
                  </p>

                  <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: s.tone, boxShadow: `0 0 8px 1px ${s.tone}` }}
                    />
                    {s.meta}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
