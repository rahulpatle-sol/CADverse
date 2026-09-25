"use client";

import { useCallback, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";

const ISO = "matrix(0.866,0.5,-0.866,0.5,0,0)";
const PLANE_X = 380;
const GRID = Array.from({ length: 11 }, (_, i) => -200 + i * 40);

const ROAD_A = "M -190 -70 L 30 -70 L 120 20 L 190 20";
const ROAD_B = "M -60 -190 L -60 60 L 60 180";
const ROAD_C = "M 90 -190 L 90 -30 L 190 70";

const WATER_MAIN = "M -190 100 L -40 100 L -40 -60 L 110 -60 L 110 -180";
const WATER_VALVES: Array<[number, number]> = [
  [-40, 100],
  [-40, -60],
  [110, -60],
  [110, -180],
];

const GRID_NODES: Array<[number, number]> = [
  [-150, -150],
  [-150, 20],
  [-150, 180],
  [20, -150],
  [20, 20],
  [20, 180],
  [170, -150],
  [170, 20],
  [170, 180],
];

function PlaneGrid({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <g stroke="rgba(255,255,255,0.09)" strokeWidth={1} opacity={opacity} vectorEffect="non-scaling-stroke">
      {GRID.map((v) => (
        <line key={`v${v}`} x1={v} y1={-200} x2={v} y2={200} />
      ))}
      {GRID.map((v) => (
        <line key={`h${v}`} x1={-200} y1={v} x2={200} y2={v} />
      ))}
      <rect x={-200} y={-200} width={400} height={400} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.4} />
    </g>
  );
}

function PlaneShell({
  y,
  fill,
  children,
}: {
  y: number;
  fill: string;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${PLANE_X} ${y}) ${ISO}`}>
      <rect x={-200} y={-200} width={400} height={400} fill={fill} />
      <PlaneGrid />
      {children}
    </g>
  );
}

function Chip({
  label,
  value,
  tone,
  className,
  delay = "0s",
}: {
  label: string;
  value: string;
  tone: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute animate-float rounded-lg border border-white/10 bg-obsidian-900/80 px-3 py-2 backdrop-blur-md",
        className,
      )}
      style={{ animationDelay: delay, animationDuration: "7s" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: tone, boxShadow: `0 0 8px 1px ${tone}` }}
        />
        <span className="mono-label text-ink-500">{label}</span>
      </div>
      <div className="mt-1 font-mono text-[12px] font-medium text-white">{value}</div>
    </div>
  );
}

export default function BlueprintVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-1, 1], [8, -8]);
  const rotateX = useTransform(sy, [-1, 1], [-7, 7]);
  const depthA = useTransform(sx, [-1, 1], [-14, 14]);
  const depthB = useTransform(sx, [-1, 1], [-7, 7]);
  const depthAY = useTransform(sy, [-1, 1], [-8, 8]);
  const depthBY = useTransform(sy, [-1, 1], [-4, 4]);
  const sheen = useTransform(sx, [-1, 1], [18, 82]);
  const sheenBg = useMotionTemplate`radial-gradient(420px circle at ${sheen}% 20%, rgba(255,255,255,0.07), transparent 60%)`;

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [mx, my, reduce],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative [perspective:1400px]"
    >
      {/* card chrome */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-obsidian-900/60 shadow-card-lux backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-violet shadow-[0_0_10px_2px_rgba(139,92,246,0.7)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              iso-vector view · scale 1:500
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-neon-cyan">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan" />
            </span>
            live
          </span>
        </div>

        <motion.div
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <svg
            viewBox="0 0 760 520"
            className="block h-auto w-full"
            role="img"
            aria-label="Interactive isometric CAD blueprint with roads, water pipelines and electrical grid layers"
          >
            <defs>
              <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="elecGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
              <filter id="nodeGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="3.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ambient plane wash */}
            <ellipse cx={PLANE_X} cy={330} rx={330} ry={150} fill="rgba(79,70,229,0.16)" />

            {/* ELECTRICAL GRID (base layer) */}
            <motion.g
              style={reduce ? undefined : { x: depthB, y: depthBY }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <PlaneShell y={356} fill="rgba(79,70,229,0.05)">
                <g
                  stroke="url(#elecGrad)"
                  strokeWidth={1.6}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  opacity={0.85}
                >
                  <path d="M -150 -150 L 170 -150 M -150 20 L 170 20 M -150 180 L 170 180" />
                  <path d="M -150 -150 L -150 180 M 20 -150 L 20 180 M 170 -150 L 170 180" />
                </g>
                <g filter="url(#nodeGlow)">
                  {GRID_NODES.map(([x, y], i) => (
                    <rect
                      key={i}
                      x={x - 5}
                      y={y - 5}
                      width={10}
                      height={10}
                      rx={1.5}
                      fill="#0D0E15"
                      stroke="#818CF8"
                      strokeWidth={1.6}
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.22}s`, animationDuration: "2.6s" }}
                    />
                  ))}
                </g>
              </PlaneShell>
            </motion.g>

            {/* WATER PIPELINE (mid layer) */}
            <motion.g
              style={reduce ? undefined : { x: depthA, y: depthAY }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <PlaneShell y={276} fill="rgba(6,182,212,0.045)">
                <path
                  d={WATER_MAIN}
                  fill="none"
                  stroke="rgba(6,182,212,0.18)"
                  strokeWidth={11}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={WATER_MAIN}
                  fill="none"
                  stroke="url(#waterGrad)"
                  strokeWidth={2.6}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="14 16"
                  className="animate-dashflow"
                />
                <g filter="url(#nodeGlow)">
                  {WATER_VALVES.map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={5.5}
                      fill="#06B6D4"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2.4s" }}
                    />
                  ))}
                </g>
              </PlaneShell>
            </motion.g>

            {/* ROAD NETWORK (top layer) */}
            <motion.g
              style={reduce ? undefined : { x: depthB }}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlaneShell y={196} fill="rgba(139,92,246,0.05)">
                <g
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                >
                  {[ROAD_A, ROAD_B, ROAD_C].map((d) => (
                    <g key={d}>
                      <path d={d} stroke="rgba(139,92,246,0.16)" strokeWidth={13} />
                      <path d={d} stroke="url(#roadGrad)" strokeWidth={3} />
                      <path
                        d={d}
                        stroke="#E9D5FF"
                        strokeWidth={1.4}
                        strokeDasharray="8 18"
                        className="animate-dashflow"
                      />
                    </g>
                  ))}
                  <circle cx={-60} cy={-70} r={24} stroke="rgba(139,92,246,0.2)" strokeWidth={12} />
                  <circle cx={-60} cy={-70} r={24} stroke="url(#roadGrad)" strokeWidth={2.4} />
                </g>
                <g filter="url(#nodeGlow)">
                  {[
                    [-60, -70],
                    [30, -70],
                    [120, 20],
                    [-60, 60],
                    [90, -30],
                  ].map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={4.6}
                      fill="#FFFFFF"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.25}s`, animationDuration: "2.8s" }}
                    />
                  ))}
                </g>
              </PlaneShell>
            </motion.g>
          </svg>

          {/* light sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: sheenBg }}
          />
        </motion.div>

        {/* HUD footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
          {[
            { c: "#8B5CF6", t: "Roads" },
            { c: "#06B6D4", t: "Water" },
            { c: "#4F46E5", t: "Electrical" },
            { c: "#34D399", t: "Structural" },
          ].map((l) => (
            <span key={l.t} className="flex items-center gap-2 font-mono text-[11px] text-ink-500">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: l.c, boxShadow: `0 0 8px 1px ${l.c}` }}
              />
              {l.t}
            </span>
          ))}
          <span className="font-mono text-[11px] text-neon-cyan/80">4 layers synced</span>
        </div>
      </div>

      <Chip
        label="Layer 01"
        value="Roads · 14,820 m²"
        tone="#8B5CF6"
        className="-left-3 top-16 sm:-left-8"
        delay="0s"
      />
      <Chip
        label="Layer 02"
        value="Water · 3,240 m"
        tone="#06B6D4"
        className="-right-3 top-40 sm:-right-8"
        delay="1.2s"
      />
      <Chip
        label="Layer 03"
        value="Electrical · 1,875 m"
        tone="#4F46E5"
        className="-bottom-5 left-6 sm:left-16"
        delay="2.1s"
      />
    </div>
  );
}
