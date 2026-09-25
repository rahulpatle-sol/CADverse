# Arch-Cost AI — Frontend

Ultra-luxury dark-mode landing page + working CAD cost-estimation app for **Arch-Cost AI**,
an AI-powered CAD-to-cost estimation platform.

- **`/`** — Marketing landing page (hero, formats marquee, live parser playground, pipeline, feature matrix, pricing, footer).
- **`/estimate`** — The actual estimator: upload a CAD file, parse it, inspect layers in 3D, get a cost breakdown.

---

## Tech stack

| Layer      | Choice                                          |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling    | Tailwind CSS                                    |
| Animation  | Framer Motion                                   |
| Icons      | Lucide React                                    |
| 3D viewer  | Three.js + React Three Fiber + Drei             |
| Backend    | Separate Node service (see `../backend`)        |

---

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# production build + serve
npm run build
npm start
```

The estimator at `/estimate` talks to the backend API. Configure the origin via
`.env.local` (see `.env.local.example`):

```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

---

## Project structure

```
app/
├── page.tsx                 # Landing page (Arch-Cost AI)
├── layout.tsx               # Fonts, metadata, global shell
├── globals.css              # Obsidian theme, glass + metallic utilities, reduced-motion
└── estimate/
    └── page.tsx             # Working estimator app (upload → parse → 3D → cost)

components/
├── landing/
│   ├── Navbar.tsx           # Fixed glass header, mobile menu, CTA
│   ├── Hero.tsx             # Badge, headline, CTAs, stats, hero visual
│   ├── BlueprintVisual.tsx  # Interactive isometric CAD blueprint (mouse parallax)
│   ├── FormatsBar.tsx       # .DWG .DXF .DWT .DWS marquee
│   ├── Playground.tsx       # Drag & drop demo: 4-stage pipeline + live report
│   ├── Pipeline.tsx         # 4-step "How it works" (id: technology)
│   ├── Features.tsx         # Bento feature matrix (id: features)
│   ├── Pricing.tsx          # 3-tier pricing (id: pricing)
│   ├── Footer.tsx           # Status badge, links, newsletter, socials
│   └── ui.tsx               # Reveal, GlowOrb, SectionHeading, CTA buttons
├── CadViewer.tsx            # R3F 3D viewer for parsed geometry
├── CostBreakdown.tsx        # Line-item cost report + manual layer mapping
└── UploadPanel.tsx          # File dropzone for the estimator

lib/
├── api.ts                   # uploadCadFile / fetchRateCard client
├── cn.ts                    # class-name helper
└── colors.ts                # layer → color mapping
```

---

## Design system

**Theme** — Obsidian dark mode with glassmorphism and ambient neon glows.

| Token          | Value                                          |
| -------------- | ---------------------------------------------- |
| Background     | `#08080C` (page), `#0D0E15` (raised surface)   |
| Card           | `rgba(255,255,255,0.03)` + `1px rgba(255,255,255,0.08)` border |
| Accent — Violet  | `#8B5CF6`                                    |
| Accent — Cyan    | `#06B6D4`                                    |
| Accent — Indigo  | `#4F46E5`                                    |
| Type           | Inter (sans) + JetBrains Mono (labels/code)   |

**Reusable utilities** (defined in `app/globals.css`):

- `.glass` / `.glass-strong` — frosted surfaces
- `.text-metallic` / `.text-accent` — `bg-clip-text` gradients
- `.btn-primary` — gradient CTA with glow shadow
- `.card-lux` — glass card with spring hover + violet edge glow
- `.mono-label` — uppercase mono eyebrow labels

**Tailwind extensions** (`tailwind.config.ts`): `obsidian` / `neon` color scales,
`glow-violet` / `glow-cyan` / `card-lux` shadows, and the `marquee`, `dashflow`,
`float`, `shimmer`, `pulse-ring`, `border-glow` keyframes.

**Motion conventions**

- Scroll reveals via `<Reveal>` (Framer Motion `whileInView`, once).
- All ambient loops are CSS keyframes, so `prefers-reduced-motion` disables them;
  Framer Motion animations are guarded with `useReducedMotion()`.
- Every card uses hover spring/translate + border-glow transitions.

---

## Landing page routes & anchors

| Nav link           | Target       |
| ------------------ | ------------ |
| Features           | `/#features` |
| Technology         | `/#technology` |
| Supported Formats  | `/#formats`  |
| Workflow           | `/#workflow` |
| Pricing            | `/#pricing`  |

Primary CTAs (`Launch CAD Engine`, `Get Started`, pricing buttons) route to `/estimate`.
