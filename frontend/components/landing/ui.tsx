"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      className={cn(className)}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient glow orbs                                                   */
/* ------------------------------------------------------------------ */

export function GlowOrb({
  className,
  color = "rgba(139,92,246,0.55)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl opacity-20",
        className,
      )}
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 mono-label text-neon-cyan/90">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_2px_rgba(6,182,212,0.8)]" />
          {eyebrow}
        </span>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}{" "}
          {accent && <span className="text-accent">{accent}</span>}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "max-w-2xl text-[15px] leading-relaxed text-ink-500 sm:text-base",
              align === "center" ? "mx-auto" : "",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type CtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  external?: boolean;
};

export function PrimaryCta({ href, children, className, icon }: CtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white outline-none",
        className,
      )}
    >
      {children}
      {icon}
    </Link>
  );
}

export function GhostCta({ href, children, className, icon }: CtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white",
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
