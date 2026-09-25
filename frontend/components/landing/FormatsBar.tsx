"use client";

import { Reveal } from "./ui";

type Format = {
  ext: string;
  title: string;
  desc: string;
  tone: string;
};

const FORMATS: Format[] = [
  {
    ext: ".DWG",
    title: "Main Drawing File",
    desc: "2D/3D geometry, blocks & references",
    tone: "#8B5CF6",
  },
  {
    ext: ".DXF",
    title: "Drawing Exchange Format",
    desc: "Interoperability & vector passthrough",
    tone: "#06B6D4",
  },
  {
    ext: ".DWT",
    title: "Drawing Templates",
    desc: "Standardized schematics & title blocks",
    tone: "#4F46E5",
  },
  {
    ext: ".DWS",
    title: "Drawing Standards",
    desc: "Attribute & layer rule enforcement",
    tone: "#34D399",
  },
];

function FormatCard({ f }: { f: Format }) {
  return (
    <div className="group flex w-[300px] shrink-0 items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:w-[360px]">
      <div
        className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border font-mono text-[13px] font-semibold"
        style={{
          borderColor: `${f.tone}55`,
          background: `${f.tone}14`,
          color: f.tone,
          boxShadow: `inset 0 0 22px -8px ${f.tone}`,
        }}
      >
        {f.ext}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{f.title}</p>
        <p className="truncate text-[12px] text-ink-500">{f.desc}</p>
      </div>
    </div>
  );
}

export default function FormatsBar() {
  const track = [...FORMATS, ...FORMATS];

  return (
    <section id="formats" className="relative border-y border-white/[0.06] bg-obsidian-900/50 py-14">
      <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col items-center gap-3 px-5 sm:px-8">
        <Reveal>
          <span className="mono-label text-ink-500">Supported CAD formats</span>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="text-center text-sm text-ink-300">
            Native parsers for the file types your engineers already ship — zero conversion,
            zero geometry loss.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
            {track.map((f, i) => (
              <FormatCard key={`${f.ext}-${i}`} f={f} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
