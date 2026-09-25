"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Upload, Zap } from "lucide-react";
import BlueprintVisual from "./BlueprintVisual";
import { GlowOrb, GhostCta, PrimaryCta, Reveal } from "./ui";

const STATS = [
  { value: "99.8%", label: "Verified cost accuracy" },
  { value: "<30s", label: "Per drawing parse time" },
  { value: "4", label: "Native CAD formats" },
  { value: "24/7", label: "Private parsing sandbox" },
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-lux bg-grid-40 opacity-[0.55]"
        style={{
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 20%, transparent 78%)",
        }}
      />
      <GlowOrb className="-top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2" color="rgba(139,92,246,0.6)" />
      <GlowOrb className="-left-32 top-64 h-[420px] w-[420px]" color="rgba(6,182,212,0.5)" />
      <GlowOrb className="-right-24 top-40 h-[460px] w-[460px]" color="rgba(79,70,229,0.55)" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* badge */}
          <Reveal>
            <motion.div
              animate={reduce ? undefined : { boxShadow: [
                "0 0 0 0 rgba(139,92,246,0.35)",
                "0 0 34px 4px rgba(139,92,246,0.18)",
                "0 0 0 0 rgba(139,92,246,0.35)",
              ] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative inline-flex items-center gap-2 rounded-full border border-neon-violet/40 bg-neon-violet/[0.08] px-4 py-1.5 backdrop-blur"
            >
              <Zap className="h-3.5 w-3.5 text-neon-cyan" />
              <span className="font-mono text-[11px] font-medium tracking-wide text-white/85 sm:text-[12px]">
                LLM Layer Engine —{" "}
                <span className="text-neon-cyan">99.8% Precision Cost Accuracy</span>
              </span>
            </motion.div>
          </Reveal>

          {/* headline */}
          <Reveal delay={0.08}>
            <h1 className="mt-7 text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              <span className="text-metallic">High-Precision CAD-to-Cost</span>
              <br />
              <span className="text-accent">Estimation Engine.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-500 sm:text-lg">
              Securing estimation accuracy up to{" "}
              <span className="font-medium text-white">99.8%</span>. Powered by advanced
              CAD-aware AI &amp; LLMs to instantly parse complex multi-layered architectural
              &amp; infrastructure drawings.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.24}>
            <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <PrimaryCta
                href="/estimate"
                className="w-full sm:w-auto"
                icon={
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                }
              >
                Get Started with Arch-Cost AI
              </PrimaryCta>
              <GhostCta href="/#workflow" className="w-full sm:w-auto" icon={<Upload className="h-4 w-4" />}>
                Upload Sample .DWG
              </GhostCta>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500/80">
              No credit card · Encrypted parsing · SOC-2 aligned sandbox
            </p>
          </Reveal>
        </div>

        {/* stats */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 bg-obsidian-950/70 px-4 py-5">
                <span className="font-mono text-xl font-semibold text-white">{s.value}</span>
                <span className="text-center text-[11px] leading-tight text-ink-500">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* hero visual */}
        <Reveal delay={0.14} y={40}>
          <div className="relative mx-auto mt-16 max-w-5xl">
            <BlueprintVisual />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
