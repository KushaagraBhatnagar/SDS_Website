# SDS (Society for Data Science) Website Implementation Plan — v2

This implementation plan outlines the development of an immersive, high-end, AI-inspired digital experience for the SDS website. The experience is designed to feel like entering the mind of a machine, taking the user on a continuous journey from initialization to inference — following the full 7-stage narrative: **Initialize → Attention → Identity → Knowledge → Innovation → Community → Future**.

This version supersedes the original plan. Changes from v1 are marked with **[UPDATED]** or **[NEW]**.

---

## Confirmed Decisions

| Item | Decision |
|---|---|
| Styling | **Tailwind CSS v3** for layout/spacing/responsive grid + **CSS variables/custom classes** for glow, glass, scanline, and glitch effects (hybrid — pure utility classes can't express these custom effects; pure vanilla CSS would slow down build velocity) |
| Component library | **Skip shadcn/ui** — every interactive element (buttons, cards) needs a fully custom glass/glow/glitch treatment; importing and overriding shadcn adds bundle weight without saving effort. We build lightweight custom components instead (`GlassButton`, `GlowCard`, etc.) |
| Animation | Framer Motion for UI reveals/page transitions; GSAP or vanilla `requestAnimationFrame` for canvas/SVG-driven animations |
| 3D assets | Procedural Three.js geometry only (no `.gltf`/`.glb`) for fast load times |

---

## Project Bootstrapping & Setup

**[NEW]** `package.json`
Core dependencies:
- `three` and `@react-three/fiber` / `@react-three/drei` — interactive 3D Hero visualization
- `tailwindcss` v3 + `postcss` + `autoprefixer`
- `framer-motion` — page/component animations
- `gsap` — canvas/SVG-driven timeline animations
- `lucide-react` — futuristic icons
- `lenis` — smooth cinematic scroll physics
- `react-helmet-async` — SEO/meta tag management **[NEW]**

**[MODIFY]** `index.html`
- Load Google Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (technical logs)
- Set page title and SEO metadata (OpenGraph tags, description, favicon) **[UPDATED — was missing OG tags]**
- Add `<noscript>` fallback message describing the club, for users/crawlers without JS **[NEW]**

**[NEW]** `tailwind.config.js`
- Extend theme with the SDS color palette as Tailwind tokens (`bg-void`, `text-glow-blue`, etc.) so both Tailwind utilities and custom CSS reference the same source of truth

**[NEW]** `src/index.css`
Theme color variables:
- Background: `#020611` (deep navy near black)
- Primary Blue: `#0A1E5E`
- Accent Yellow: `#FFB000`
- Glow Blue: `#4A90FF`
- Text: `#F5F7FA`

Also sets up scroll styles, font families, scan lines, glassmorphic card utilities, and `prefers-reduced-motion` overrides **[UPDATED]**.

---

## Phase 0: Foundations (New Phase)

**[NEW]** `src/hooks/usePerformanceTier.js`
Detects device capability (`navigator.hardwareConcurrency`, `navigator.deviceMemory`, touch-only input) and `prefers-reduced-motion`. Returns a tier (`high` / `low` / `reduced`) consumed by all heavy visual components to decide whether to render full Three.js scenes, a lighter Canvas2D fallback, or a static gradient.

**[NEW]** `src/hooks/useIntroGate.js`
Manages whether the full cinematic intro plays:
- First visit in a session → full intro
- Returning visit within same session (`sessionStorage` flag) → short 3–4s micro-intro or skip straight to homepage
- "Skip Intro" button appears ~2s into the sequence regardless

**[NEW]** `src/data/` folder
Plain JSON/JS files for content that changes every semester: `team.json`, `events.json`, `domains.json`. Documented with comments so non-developer club members can hand off edits, or this folder can later be swapped for a headless CMS (e.g. Sanity) without touching components.

---

## Phase 1: Cinematic Intro & Transitions

**[NEW]** `src/components/IntroCanvas.jsx`
Single canvas state machine managing:
- **BOOT** — procedural neural network bootup; growing nodes, glowing synapses, typed terminal logs
- **DISSOLVE** — nodes disintegrate into drifting particles
- **QUOTE** — "Attention is all we get." reveals word-by-word over subtle attention-line visualization
- **GLITCH** — letters distort and break into glowing dust
- **SDS_REVEAL** — particles assemble into "SDS" in bold monospace
- **MORPH** — offscreen canvas sampling morphs "SDS" into "Society for Data Science"
- **ZOOM_OUT** — camera pulls back, homepage fades in behind the text

**[UPDATED]** Now driven by `useIntroGate` — respects skip button and session state. On `reduced` performance tier, swaps the full particle system for a simplified fade/type-only sequence (same story beats, far cheaper to render).

---

## Phase 2: Navigation, Global Theme, and Cursor

**[NEW]** `src/components/CustomCursor.jsx`
Center dot + trailing outer ring, expands/glows on hover.
**[UPDATED]** Automatically disabled on touch devices (`(hover: none)` media query) — falls back to default cursor, no janky ghost cursor on mobile.

**[NEW]** `src/components/Navbar.jsx`
Floating glassmorphic header, minimal layout, active-state glows, subtle glitch on hover. Includes a link to the new Community section.

**[NEW]** `src/components/ScrollProgressTracker.jsx` **[NEW COMPONENT]**
A slim fixed side indicator showing which of the 7 narrative stages (Initialize / Attention / Identity / Knowledge / Innovation / Community / Future) the user is currently scrolled through — ties the whole homepage back to the vision's narrative arc, not just the intro.

---

## Phase 3: Homepage Sections

Each section below is explicitly labeled with its narrative stage so the story continues past the intro.

**[NEW]** `src/components/HeroSection.jsx` — *Stage: Attention*
Split layout: large typography + glass CTA buttons (left), `ThreeVisualizer` (right).

**[NEW]** `src/components/ThreeVisualizer.jsx`
Interactive Attention Head / Token Embedding Space in `@react-three/fiber`: floating token cloud, cursor-reactive synaptic pathways, orbit controls.
**[UPDATED]** Respects `usePerformanceTier` — reduces particle count on `low` tier, renders a static SVG equivalent on `reduced` tier. Lazy-loaded via `React.lazy` + `Suspense` so it doesn't block first paint.

**[NEW]** `src/components/PipelineSection.jsx` — *Stage: Knowledge*
Scroll-triggered pipeline: Raw Data → Tokenization → Embeddings → Attention → Inference → Knowledge. Modular cards light up with pulsing particles along connecting buses.

**[NEW]** `src/components/DomainsSection.jsx` — *Stage: Knowledge*
Floating domain cards (AI, ML, Deep Learning, CV, NLP, GenAI, LLMs, Data Science) with 3D tilt, electric-blue border animation, subtle hover glitch. Data sourced from `src/data/domains.json`.

**[NEW]** `src/components/KnowledgeGraphSection.jsx` — *Stage: Knowledge*
Interactive 2D canvas knowledge graph; hover lights up connections and pulls neighbors closer via spring physics.
**[UPDATED]** Lazy-loaded; includes a hidden but screen-reader-accessible list of the same node relationships so the content isn't invisible to non-visual users and crawlers.

**[NEW]** `src/components/TokenFlowSection.jsx` — *Stage: Innovation*
Words (Data, Image, Text, Video…) stream, cluster into embedding points, pass through attention filters, compile into "Knowledge." Subtle continuous loop.

**[NEW]** `src/components/CommunitySection.jsx` **[NEW — fills vision gap]** — *Stage: Community*
Team/office-bearer showcase using glass cards, sourced from `src/data/team.json`. Optional testimonial or event-photo strip. This is the section prospective members and recruiters will look for first — it was in the vision's narrative but had no component in v1.

**[NEW]** `src/components/FutureSection.jsx` **[NEW — fills vision gap]** — *Stage: Future*
Roadmap/timeline-style component: upcoming events, workshops, competitions, sourced from `src/data/events.json`. Closes the narrative arc before the footer instead of jumping straight from Innovation to Footer.

**[NEW]** `src/components/Footer.jsx`
Terminal-style command input box, active links, copyright text.

---

## Phase 4: Integration & Assembly

**[MODIFY]** `src/App.jsx`
Combines all components; manages lifecycle between intro sequence and homepage mount with Lenis smooth-scrolling wrapper. Wraps heavy visual sections in `Suspense` boundaries with lightweight loading placeholders (not full spinners — a subtle pulsing dot keeps tone consistent).

---

## Accessibility & SEO **[NEW SECTION]**

- All canvas/WebGL/SVG visualizations paired with an `aria-hidden` decorative flag plus a real, semantic DOM equivalent (headings, lists) carrying the same information for screen readers and search crawlers
- Custom cursor and hover-glitch effects disabled under `prefers-reduced-motion` and on touch-only devices
- `react-helmet-async` manages per-page title, meta description, and OpenGraph tags
- Color contrast of soft-white text (`#F5F7FA`) against deep navy background (`#020611`) checked against WCAG AA at all font sizes used

---

## Verification Plan

### Automated Verification
- Run local development build via `npm run dev` — no bundling/runtime errors
- Audit React console for performance warnings or memory leaks in Three.js/Canvas contexts
- **[NEW]** Run Lighthouse CI (performance, accessibility, SEO, best-practices) as part of the build check, with a minimum score threshold agreed before launch

### Manual Verification
- Test all intro transitions (boot, dissolve, quote, SDS, morph, zoom-out) across multiple window sizes
- **[NEW]** Test intro skip button and session-based repeat-visit shortening
- Verify smooth scrolling and scroll-triggered animations
- Test custom cursor feedback and 3D hover responsiveness
- **[NEW]** Confirm cursor gracefully disables on touch devices
- Check responsive styles on mobile for readable text scaling and grid alignment
- **[NEW]** Test on at least one real low/mid-range Android device — not just browser window resize — since canvas/WebGL performance differs significantly from desktop dev tools emulation
- **[NEW]** Verify screen-reader users can access equivalent content for the knowledge graph and pipeline sections
