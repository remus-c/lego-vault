# LEGO Vault 3.2 — implementation plan
Date: 18 October 2026
Project: remus-c/lego-vault (existing GitHub Pages site + private Supabase cloud sync).

## Goal
Make LEGO Vault a visually vivid, cinematic, brick-infused personal collector showroom without losing existing data, privacy, usability, or the path to multiuser Vault 4.0.

## Verified catalogue baseline (phase 0 — completed)
- Source: https://www.lego.com/en-dk/themes (LEGO Denmark, checked 18 October 2026).
- Exactly **47 official themes in LEGO.com's current theme directory** (not a claim about all historical LEGO themes); all are listed in `theme-registry.js` and shown in **Theme Atlas**.
- A theme's data identity is separate from its visual DNA and a set's cross-franchise aesthetics. Examples:
  - #72046 Game Boy: LEGO official *Super Mario*; render with optional *retro pixel* effects.
  - #42155 The Batman Batcycle: LEGO official *Technic*; may additionally feature Gotham-style art.
  - #42127 The Batman Batmobile: LEGO official *Batman* despite the Technic building system.
  - #21330 Home Alone / #21333 Starry Night: LEGO *Ideas*.
  - #10323 PAC-MAN Arcade: LEGO *Icons*.
  - #76294 X-Mansion: LEGO *Marvel*.
  - #72306 PlayStation: LEGO *Other* product category; not among the 47 shop-directory themes. Accessible as **Other / Uncategorised**.
- Also provide **Legacy / retired theme** as an option. Older lines (e.g. Bionicle, Atlantis, old Space) are not represented as actively stocked shop themes.
- Keep original broad category strings in historical `DEFAULT_SETS` and `state.added` for backward compatibility. Display and filtering may resolve official themes through the mapping layer; **do not rewrite user data silently**.
- Current seed archive remains 35 confirmed owned sets, 5 wishlist sets, 14/15 confirmed helmet series (15th unconfirmed), plus separate unresolved botanical.

### Acceptance checks for phase 0
- All 47 names can be browsed, searched and selected for a new set. Theme Atlas still displays empty themes with 0 owned.
- Themes found in the user's collection lead to valid collection filtering even when original saved categories are broad or legacy.
- "Other" and historic/retired entries are clearly separate from 47 official shop headings.
- Adding to a new theme does not break ownership counts, profile statistics, backups, image fallback, or cloud synchronization.
- Registry is a separate versioned resource with source, verified date, stable ID, alias, color and visual-preset name.

## Phase 1 — global motion and color engine (next)
Files: `theme-tokens.css`, `motion.css`, `motion-engine.js`.
- Define CSS custom properties for each of the 47 official theme identities (through 21 shareable *world presets* with theme-specific palettes), plus legacy and fallback.
- Introduce depth layers: ambient gradient, stud/plate/brick silhouettes, animated thematic layer (stars, leaves, hologram scans, angular shadows, gear outlines, arcade pixels), foreground content. Effects must be decorative, CSS/DOM, no copied LEGO character illustrations.
- Motion setting in profile settings: **Off / Gentle / Cinematic**, default Gentle, saved locally and optionally in `state.preferences.motion` after migration.
- Never block touch scrolling; avoid performance-heavy per-pixel canvas/fullscreen blur on iPhone.
- Respect `prefers-reduced-motion: reduce` and expose a visible pause/disable effects control.
- Target: 60 fps when possible on modern iPhones; cap background decorative elements and use `transform`/`opacity` rather than scroll-triggered expensive layout.

## Phase 2 — theme-reactive collection surfaces
Files: `theme-card.css`, `set-card-theme.js`.
- Use official theme for catalog labels; combine optional franchise/mood to pick visual DNA. Do not depend on set title keywords for authoritative theme.
- Star Wars: deep navy, star fields, restrained holographic orbit.
- Batman / DC: moody violet, architectural noir, distant signal beams.
- Botanicals: sage/coral gradients, leaves and floating petals.
- Technic / Speed Champions: industrial blue/red, blueprint, gears and speed trails.
- Super Mario / Sonic / Minecraft: layered pixel art motifs; playful but legible.
- Ideas / Icons / Art: gallery displays, subtle gold/pastel lighting.
- Other 40+ themes inherit tuned palettes and semantic presets (education, fantasy, hero, pixel, ocean, city, etc.), each identifiable by name and accent; individual overrides can be added iteratively.
- Apply DNA in gallery cards, details modals, featured displays and thematic filters without duplicating UI components.

## Phase 3 — Collector Profile 3.2
Files: `profile.css`, `profile.js`, optional `profile-showcase.js`.
- Hero: layered LEGO brick scene, signature theme aura derived from top themes, avatar/podium, optional accent selector.
- Showcase shelf: three featured LEGO images in custom-lit floating display bays, themed atmosphere per bay and image fallbacks.
- Trophy cabinet: collectible medallion tiers, restrained unlock glows; server-verifiable achievements only when public rewards exist.
- Collection journey: date-aware timeline **only for entries with acquisition/recorded timestamps**; never infer purchase dates from release dates.
- Profile fields remain private under existing Supabase RLS; no public profile URL, handle claims, or trading features until explicitly enabled.
- All changes are backward-compatible with imported Vault 2.x and 3.0 JSON backups.

## Phase 4 — QA, performance and accessibility
- Desktop 1440/1024, tablets 768, phones 390/375/320 px, portrait/landscape, touch and keyboard.
- Image unavailable, unknown values, long set names, zero owned sets, 1 set, 1000+ sets, cloud offline and stale data conflicts.
- Focus states and dialog semantics; `prefers-reduced-motion`, hidden tab pause, data saver/mobile battery path.
- Avoid fetching 47 images at once; SVG/CSS motifs first, external product images lazy loaded.
- No purchased asset dependencies. Verify third-party image/metadata rights and API terms prior to public multi-user operation.
- Smoke test account sign-in + cloud-save across devices, JSON backup/export and recovery before declaring a release complete.

## Architectural principles to preserve for Vault 4.0
1. Catalog theme registry != user collection records != animation skin != achievements != public listings.
2. Use stable canonical IDs and add migration layers, never break existing stored category strings.
3. Multiuser directory and marketplace require dedicated relational tables, role-separated RLS, moderation, transactions and safe uploads; not a publicized JSON blob.
4. Prefer design tokens and composable components over hundreds of one-off CSS rules.
5. Public profile visibility must be explicit opt-in and separately reviewable, not inferred from sign-in.

## Status
- **Built now:** verified official 47-theme registry, official/legacy category handling, visual world presets, themed Theme Atlas browse screen, cross-theme filtering, and compatibility with existing 3.0 collection.
- **Not yet built:** system-wide motion controls, full theme-reactive styling for every set card, cinematic profile hero backgrounds and live achievements effects.
- **No Supabase table changes required** for phase 0.
