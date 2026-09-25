"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Rocket, LogIn, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Technology", href: "/#technology" },
  { label: "Supported Formats", href: "/#formats" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] shadow-glow-violet">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 20L12 4l8 16"
            stroke="url(#lg-a)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M7.6 13.2h8.8"
            stroke="url(#lg-a)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="4"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="lg-a" x1="4" y1="4" x2="20" y2="20">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Arch-Cost <span className="text-accent">AI</span>
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-500">
          CAD → Cost Engine
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-obsidian-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[70px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Arch-Cost AI home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="relative rounded-full px-3.5 py-2 text-[13px] font-medium text-ink-300 transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/estimate"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium text-ink-300 transition-colors hover:text-white"
          >
            <LogIn className="h-3.5 w-3.5" />
            Log In
          </Link>
          <Link
            href="/estimate"
            className="btn-primary group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Launch CAD Engine
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.07] bg-obsidian-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-5 sm:px-8">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-ink-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2.5 border-t border-white/[0.07] pt-4">
                <Link
                  href="/estimate"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/85"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
                <Link
                  href="/estimate"
                  onClick={() => setOpen(false)}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                >
                  <Rocket className="h-4 w-4" />
                  Launch CAD Engine
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
