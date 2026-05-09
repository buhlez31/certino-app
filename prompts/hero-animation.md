# Task: Build animated Hero section for Certino landing

## Context

You are working in the `certino-app` repo, branch `feat/landing-page`. It is a Next.js 15 App Router project (TypeScript + Tailwind v4) located at `/Users/mk/Documents/1 Projekty/Hyliar/certino-app`. The landing page is a single client component at:

- `components/certino-landing.jsx` (uses `"use client"`, ~1875 lines)

It is rendered at the root route `app/page.tsx`. The main app sits at `/app` (`app/app/page.tsx`) — leave that alone.

The landing page is composed of these sub-functions inside `certino-landing.jsx`, in this render order:

1. `Header` — sticky pill nav with Launch App CTA (`href="/app"`) — keep as is
2. `Hero` — currently a placeholder dashed box ("Hero · image + text") — **REPLACE THIS**
3. `Architecture` — protocol architecture schema, do not touch
4. `HowItWorks` — three-column diagrams, do not touch
5. `Problem` — day-curve diagram, do not touch
6. `Solution` — headline + paragraph ("A registry built for small producers and the hour" + Certino is the missing piece…) — **MOVE its copy into the new Hero; delete the old `Solution` section call from the main render tree**
7. `Closing`, `Footer` — do not touch

Design tokens already exist in `ThemeStyles` (CSS custom properties on `[data-theme="light"]`):
`--bg-page` (cream `#F6F1E7`), `--bg-card`, `--bg-card-soft`, `--text-primary` (dark teal `#15212A`), `--text-secondary`, `--text-tertiary`, `--accent` (deep teal `#0F3B47`), `--navy` (`#1F2E5C`), `--lime` (`#D0FF14`), `--border`, `--shadow-sm`, `--shadow-md`. The `display` class uses Instrument Serif; `mono` uses JetBrains Mono. Body font is Hanken Grotesk. Use these tokens and font classes — do not introduce a new palette.

## Goal

Replace the current placeholder `Hero` with a full-bleed, immersive hero that:

1. **Leads with the relocated Solution copy** as the editorial focal point:

   > **A registry built for *small producers* and *the hour*.**
   >
   > Certino is the missing piece between a single rooftop and a serious ESG buyer. We do the heavy lifting — metering, attestation, settlement — so a small producer can sell a real, hourly-matched certificate to a real, named buyer.

   Use existing italic-emphasis treatment seen elsewhere in the file (`<span className="italic" style={{ color: "var(--accent)" }}>...</span>`).

2. **Visualizes the real-world Treetino + Victron Energy product chain.** Treetino HILIER + tree planters / outdoor solar installations are connected to Victron inverters/chargers/MPPT/Cerbo GX, which feed metering data into the Certino oracle. The hero should show this chain visually — illustrative, not photographic, unless real product imagery is freely usable per the source sites' terms.

3. **Includes a tasteful animation** — energy flow / pulse along the device chain, or subtle illustrated movement of people interacting with the products. Implementation should use SVG with `<animate>` / `<animateMotion>` (matches existing schema style, no JS animation lib needed) OR CSS keyframes. Avoid heavy libraries (no Lottie, no Framer Motion) unless you can justify it in a one-liner.

4. **Is fully responsive.** Stacks vertically on small screens (text above visual), splits to two columns on `md:` and up. The hero should claim ~85vh on desktop (still leaves a visual hint that more content is below). Test at 375px, 768px, 1280px breakpoints.

## Sources to read

The user will append URLs to this prompt below. Read each source page (you may use WebFetch). Extract:

- Product naming, taglines, exact device names (HILIER, MultiPlus, Cerbo GX, MPPT, etc.)
- Visual language cues: how Treetino and Victron present their hardware (line drawings, photos, illustrations, isometric, exploded views)
- Any reusable assets ONLY if the site's terms permit hot-linking or asset reuse. If unclear, do not hot-link — re-illustrate in SVG using their published shapes/silhouettes as reference.

URLs:

- Treetino: <PASTE_TREETINO_URL_HERE>
- Victron Energy: <PASTE_VICTRON_URL_HERE>
- Optional extras (product pages): <PASTE_ANY_OTHER_URLS>

If a URL fetch fails or terms are restrictive, fall back to original SVG illustrations you compose yourself — clearly labelled "Treetino HILIER", "Victron MultiPlus II", etc. — drawn in the existing line-art / isometric style already used in `IsoHouse` (search the file). Do not invent product names that don't appear on the source sites.

## Implementation instructions

1. Read `components/certino-landing.jsx`. Locate the `Hero` function (around line 137 in the current branch — verify before editing).
2. Replace the body of `Hero` with the new layout. The function must keep the same name and default-export structure.
3. Remove the `<Solution />` call from the main `CertinoLanding` render tree (since its copy is now in the hero). Optionally delete the `Solution` function definition or leave it dead — your call, but if you leave it, prepend a one-line `// unused — copy moved into Hero` comment.
4. Use `lucide-react` icons already in the file's import list if you need iconography — do not add new icons unless necessary; if you do, append to the existing `lucide-react` import.
5. Animation must respect `prefers-reduced-motion`. Wrap motion in a `@media (prefers-reduced-motion: reduce)` block inside `ThemeStyles` (or use SVG attributes — `<animate>` will respect the OS preference automatically).
6. Run `npm run dev` (Node 20 — `nvm use 20` first) and verify at:
   - `http://localhost:3000/` — landing renders, hero is the new one, no console errors
   - Resize the window to 375 / 768 / 1280 — confirm layout adapts
   - Scroll — Architecture section should still appear right after the hero (no Solution duplicate)
7. If you used WebFetch on any product imagery URL, note the source URL in a comment near the SVG so future maintainers know the provenance.

## Constraints

- Do **not** introduce new npm dependencies unless absolutely required — justify in commit message if you do.
- Do **not** modify the build config, `next.config.ts`, `tsconfig.json`, or `app/layout.tsx`.
- Do **not** change the existing palette / CSS variables.
- Keep the file `"use client"` directive at line 1.
- Do **not** commit copyrighted product photos to the repo. Re-illustrate in SVG, or load the third-party image at runtime with `next/image` from an explicit allowlisted remote URL (and update `next.config.ts` `images.remotePatterns` if you do).

## Deliverable

A single commit on the branch `feat/landing-page` that:

- Edits `components/certino-landing.jsx` (Hero rewrite + Solution removal)
- (Optional) updates `app/globals.css` only if you need a global animation keyframe
- Includes a commit message summarizing: hero rebuilt, Solution merged in, animation approach, sources consulted

After committing, push the branch and report:

1. Commit hash
2. List of files changed
3. One-sentence description of the visual + animation choice
4. Any source URLs that returned 4xx/5xx or had restrictive terms

## Verification checklist (run before declaring done)

- [ ] `npm run dev` starts cleanly on port 3000 with Node 20
- [ ] `/` renders, `/app` still renders (main demo unaffected)
- [ ] Hero copy matches the relocated Solution text exactly
- [ ] No duplicate "registry built for small producers" appears further down the page
- [ ] Visual animation runs and respects reduced-motion
- [ ] Layout works at 375 / 768 / 1280 widths
- [ ] No new ESLint errors (`npm run lint` if configured)
- [ ] No console errors in browser devtools
