"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { GlowOrb, Reveal, SectionHeading } from "./ui";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/ forever",
    blurb: "For evaluation runs and single-site jobs.",
    features: [
      "5 CAD uploads per month",
      ".DWG and .DXF native parsing",
      "Standard quantity takeoff",
      "Itemized cost report export",
      "Community support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/ month",
    blurb: "For estimating teams shipping weekly bids.",
    features: [
      "Unlimited CAD uploads",
      "All 4 formats: .DWG .DXF .DWT .DWS",
      "LLM variable extraction & layer split",
      "99.8% verified precision reports",
      "Priority parsing queue",
      "API access + CSV / PDF export",
    ],
    cta: "Launch CAD Engine",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "For infrastructure & multi-disciplinary practices.",
    features: [
      "Private parsing sandbox",
      "SSO / SAML + role-based access",
      "On-premise connector option",
      "Dedicated accuracy tuning on your indexes",
      "99.99% uptime SLA + solutions engineer",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-32">
      <GlowOrb className="left-1/2 top-16 h-[420px] w-[620px] -translate-x-1/2" color="rgba(79,70,229,0.5)" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Scale to"
          accent="enterprise-grade."
          description="Transparent plans that grow with your estimating workload — every tier ships the same CAD-aware parsing core."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300",
                  t.featured
                    ? "border-neon-violet/45 bg-white/[0.045] shadow-glow-violet lg:-translate-y-3"
                    : "border-white/[0.08] bg-white/[0.03] hover:-translate-y-1 hover:border-white/20",
                )}
              >
                {t.featured && (
                  <>
                    <span className="pointer-events-none absolute inset-0 animate-border-glow rounded-2xl border border-neon-violet/60" />
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-neon-violet/50 bg-obsidian-950 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neon-violet">
                      <Sparkles className="h-3 w-3" />
                      Most popular
                    </span>
                  </>
                )}

                <p className="mono-label text-ink-500">{t.name}</p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {t.price}
                  </span>
                  <span className="pb-1.5 text-[13px] text-ink-500">{t.period}</span>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">{t.blurb}</p>

                <div className="my-6 h-px w-full bg-white/[0.08]" />

                <ul className="flex flex-1 flex-col gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink-300">
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          t.featured ? "bg-neon-violet/20" : "bg-white/[0.07]",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-2.5 w-2.5",
                            t.featured ? "text-neon-violet" : "text-neon-emerald",
                          )}
                        />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/estimate"
                  className={cn(
                    "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300",
                    t.featured
                      ? "btn-primary text-white"
                      : "border border-white/10 bg-white/[0.04] text-white/85 hover:border-white/25 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
