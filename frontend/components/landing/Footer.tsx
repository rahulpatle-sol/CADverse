"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, Send } from "lucide-react";
import { Logo } from "./Navbar";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Technology", href: "/#technology" },
      { label: "Supported Formats", href: "/#formats" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "System Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPA", href: "#" },
    ],
  },
];

function SocialIcon({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.03] text-ink-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-violet/50 hover:text-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-obsidian-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-gradient opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* status badge */}
        <div className="flex justify-center pt-14">
          <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-neon-emerald/30 bg-neon-emerald/[0.07] px-4 py-2 font-mono text-[11px] tracking-wide text-neon-emerald">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-emerald opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-emerald" />
            </span>
            Engine Status: Operational | Accuracy 99.8%
          </span>
        </div>

        {/* main grid */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label="Arch-Cost AI home">
              <Logo />
            </Link>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-500">
              AI-powered CAD-to-cost estimation for civil, infrastructure and architectural
              teams. Parse drawings, take off quantities, and price jobs with 99.8% precision.
            </p>

            <div className="flex items-center gap-2.5">
              <SocialIcon label="GitHub" href="https://github.com">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="X" href="https://x.com">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.4l7.6-8.7L1 2h6.8l4.7 6.2L18.9 2Zm-1.1 18.1h1.7L7.3 3.8H5.4l12.4 16.3Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn" href="https://linkedin.com">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0H13v1.7h.05c.5-.9 1.7-1.85 3.45-1.85C20.4 8.85 22 10.7 22 14.1V21h-4v-6.1c0-1.5-.55-2.5-1.85-2.5-1.05 0-1.65.7-1.95 1.4-.1.25-.15.6-.15.95V21h-4V9Z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mono-label text-white/90">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[13.5px] text-ink-500 transition-colors duration-200 hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* newsletter */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-lg font-semibold text-white">
                Get early access to the LLM Layer Engine
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
                Join the waitlist for new parser modules, accuracy benchmarks and release notes.
                One email a month, no noise.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSent(false);
                  }}
                  placeholder="you@studio.com"
                  className="h-12 w-full rounded-full border border-white/10 bg-obsidian-950/70 pl-11 pr-4 text-sm text-white placeholder:text-ink-500/70 transition-colors duration-300 focus:border-neon-violet/60 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="btn-primary inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
              >
                {sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {sent ? "You're on the list" : "Join Waitlist"}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {sent && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 font-mono text-[11.5px] text-neon-emerald"
              >
                Confirmation sent to {email} — welcome aboard.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] py-8 sm:flex-row">
          <p className="text-[12.5px] text-ink-500">
            © {new Date().getFullYear()} Arch-Cost AI. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Security", "Status"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-[12.5px] text-ink-500 transition-colors duration-200 hover:text-white"
              >
                {t}
              </Link>
            ))}
            <span className="font-mono text-[11px] text-ink-500/70">
              built for engineers, priced by machines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
