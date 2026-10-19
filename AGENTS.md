# Codex instructions — LEGO Vault

## Mission and scope

LEGO Vault is a visually rich, LEGO-inspired digital collector showroom. The current release is **Vault 3.2**. The near-term goal is a beautiful, responsive, accessible private collection and collector profile; **Vault 4.0** (multi-user public profiles, offers, marketplace and social achievements) is a future project, not an existing capability.

Work incrementally. Favor polished visuals, playful brick-inspired details, themed atmosphere and clean architecture over feature quantity. Keep user data intact. Do **not** implement public profiles, expose collection data or enable real transactions without a separate explicit request and security design.

- Repository: https://github.com/remus-c/lego-vault
- GitHub Pages: https://remus-c.github.io/lego-vault/
- Current architectural and roadmap notes: [docs/vault-3.2-implementation-plan.md](docs/vault-3.2-implementation-plan.md) and [docs/profile-architecture.md](docs/profile-architecture.md)
- ChatGPT Project handoff: [docs/CHATGPT_PROJECT_HANDOFF.md](docs/CHATGPT_PROJECT_HANDOFF.md)

## Runtime and files

This is a **static website** on GitHub Pages, not a React or Node frontend. Preserve simple deployment unless a migration is explicitly requested.

- `index.html` — one-file app shell, route/navigation, base collection, UI state, save/restore, local backup and shared helpers. It uses a large one-line `const DEFAULT_SETS = …` JSON literal: treat edits here carefully.
- `profile.js`, `profile.css` — private collector profile, editor, showcase and achievements.
- `theme-registry.js` — catalog of **47 themes listed on LEGO Denmark's themes page as checked 2026-10-18**; theme IDs, accent colors, 21 reusable world presets and cross-theme mappings.
- `themes-page.js`, `themes.css` — Theme Atlas.
- `set-card-theme.js`, `set-card-theme.css` — official theme metadata separate from aesthetic effects, reusable exhibit cards/modals.
- `motion-engine.js`, `motion.css` — decorative atmosphere, Off/Gentle/Cinematic options, `prefers-reduced-motion` compliance and small mobile effect budgets.
- `metadata.js` — optional Rebrickable metadata lookup.
- `cloud-config.js`, `cloud.js` — public Supabase project URL/publishable key, optional private browser sync. **Never** put secret/service-role keys, passwords, auth tokens or private collection records into the repo.
- `supabase/schema.sql` — owner-only RLS on `public.vault_state`; schema modifications require specific authorization and review.
- `scripts/smoke-test.mjs` — zero-dependency repository integrity tests.

Script tags in `index.html` intentionally load global modules in order; do not arbitrarily reorder them. Most code is ordinary browser JavaScript (non-ES-module) and needs `window` globals established before dependent files run.

## Data preservation (non-negotiable)

1. The static public GitHub repo contains a **default example/personal seed collection**. As of the 3.2 snapshot it has **35 confirmed owned**, **5 wishlist**, and **14 confirmed of 15 Star Wars helmets**; #75458 is **unconfirmed**, not missing. One botanical set remains unidentified. These are baseline facts, not permanent limits.
2. Browser edits live under `remus-lego-vault-v3` in localStorage. `state.patches`, `state.added`, `state.profile` and `state.preferences` can contain newer data than the GitHub defaults.
3. Authenticated Supabase sync stores a **private per-user JSON document**. Do not assume GitHub files reflect the user's latest saved changes. The app's cloud copy is not a publishable user directory.
4. Preserve backups and migration from older formats. Do not silently rewrite historic theme names, erase user patches, reset wishlists, or interpret wishlist/unconfirmed as owned.
5. Historical reference retail price (RRP) is not market/resale value. Never invent purchase dates, resale prices, quantities, official availability, or rarity.
6. Product photography and LEGO metadata may come from Brickset/Rebrickable; comply with licensing and API terms. Image failure must keep a readable fallback.

## Theme accuracy and creative treatment

- The Theme Atlas reflects a *dated snapshot* of LEGO.com's currently listed themes, **not** every historical LEGO theme ever made. Retired/legacy themes and LEGO 'Other' have separate handling.
- Preserve the distinction **official product theme vs visual mood**. Examples:
  - Game Boy #72046: official **Super Mario**, retro-pixel visuals.
  - The Batman Batcycle #42155: official **Technic**, Gotham/noir visuals.
  - UCS Millennium Falcon #75192: official **Star Wars**, galactic visuals.
  - Home Alone #21330: official **Ideas**, cinematic/gallery mood.
  - Bugatti Chiron #42083: official **Technic**, hypercar/racing mood.
- When revising theme coverage, check official LEGO.com pages or an authoritative catalog, record the source/date, and support older/retired sets. Do not infer official themes merely from a movie/franchise name.
- Use 21 shared visual-world presets plus tailored data-driven overrides, rather than 47 duplicated rendering implementations.

## Visual quality and performance

- Design for phone first (especially 375px widths), then tablets and desktop. Strong color and rich LEGO brick motifs are welcome; text, image clarity and interaction always take priority.
- Reuse CSS/JS theme tokens and UI components. Keep animations mainly to `transform` and `opacity`; do not flood the DOM with particles, blur large layers on mobile, or block scroll.
- Honor user Off/Gentle/Cinematic and OS `prefers-reduced-motion`. Keep effects decorative (`aria-hidden`, `pointer-events:none`). Ensure hover interactions also have keyboard focus and touch equivalents.
- No sound by default. No unauthorized copies of LEGO character art or brand logos.
- Test light/dark contrast, image fallback, long set names, optional/empty data, modal focus, accessible labels and iPhone layout.

## Authentication and database safety

- Current Supabase table uses row-level security (RLS) and each authenticated user may access only their own state. **Never** weaken RLS, grant public write/read permissions to `vault_state`, or expose other users' data.
- `cloud-config.js` is public by design and may contain only a project URL and a public/publishable key. No environment secrets in frontend.
- For Vault 4.0, separate catalog sets, private ownership, explicitly public profile fields, achievements, listings and offers into dedicated tables with RLS, privacy-by-default and moderation. Do not use client-side achievement or sale checks as security boundaries.
- Request approval before applying database migrations, deployments requiring payment, destructive commands, public release of user information, or authentication changes.

## Work process and validation

1. **Inspect the current files** and `git status` before changing anything. Treat the current branch, user edits and production state as authoritative.
2. Describe the plan and list files to touch. Work in a feature branch/PR for significant changes; avoid blind direct-to-main edits.
3. Make a narrow change, preserve `DEFAULT_SETS` and cloud data contracts unless explicitly changing them, and add or update checks.
4. Run `node scripts/smoke-test.mjs`. If browser testing is available, check 320px, 375px, 768px, 1440px, touch behavior, keyboard access and the reduced-motion setting.
5. Verify ownership totals, 47-theme snapshot, source order, cloud scripts, backup/restore and no browser-console errors.
6. Summarize modified files, tests actually run, and any unverified visual/deployment behavior. Never claim that a GitHub commit proves Pages finished deploying or that browser/cloud flows passed without testing.

## Current delivery priority

**Next: Vault 3.2 Phase 3 — cinematic Collector Profile**. Improve a personalized hero, signature LEGO aesthetic, featured-set podiums, animated trophy cabinet and accessible collector progression. Do not invent a purchase timeline: use actual recorded dates only. After that, run Phase 4: visual, mobile, performance and accessibility QA. The marketplace remains a separate future Vault 4.0 milestone.
