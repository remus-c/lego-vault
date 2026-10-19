# ChatGPT Project handoff — LEGO Vault

**Suggested ChatGPT Project name:** LEGO Vault — Design & Development

This file exists to move project *context and decisions*, not user accounts or private Supabase records. The actual website stays on GitHub Pages, and its database stays on Supabase.

## Where the code lives
- GitHub repo: https://github.com/remus-c/lego-vault
- Public website: https://remus-c.github.io/lego-vault/
- Codex guidance (repo root): [AGENTS.md](../AGENTS.md)
- Current product implementation roadmap: [vault-3.2-implementation-plan.md](vault-3.2-implementation-plan.md)
- Private profile and future public-marketplace schema boundary: [profile-architecture.md](profile-architecture.md)
- Zero-dependency code sanity check: `node scripts/smoke-test.mjs`.

## Summary for ChatGPT Project context

LEGO Vault is a premium, colorful, animated personal LEGO collector website. Current baseline is **Vault 3.2** with GitHub Pages hosting and optional signed-in Supabase cloud sync. The design direction is "digital collector showroom": LEGO-stud/bricks subtly moving in backgrounds, animated achievements, collector identity, gallery-like profile and sharply themed sets.

**Existing work:**
- 35 confirmed owned sets, five wishlist entries, 14 confirmed Star Wars helmets (out of 15; the remaining #75458 must stay **unconfirmed** until confirmed). One unidentified botanical is tracked separately. Defaults are public in GitHub, whereas user updates may be stored **privately in Supabase**.
- Vault 3.0: private authenticated JSON state sync with owner-only database row-level security (RLS), export/import backup, optional metadata lookup.
- Vault 3.2 Phase 0: verified snapshot of 47 official theme names from LEGO Denmark on 2026-10-18, represented through 21 re-usable visual worlds. Theme Atlas page includes zero-ownership themes and retired/legacy fallback.
- Phase 1: `motion-engine.js` / `motion.css` Off, Gentle and Cinematic; generated floating bricks/studs and world effects; iPhone-friendly budgets and OS reduced-motion behavior.
- Phase 2: `set-card-theme.js` / `set-card-theme.css` cinematic themed cards and modal, separate official theme from appearance, plus three featured sets on profile.
- Current next feature: **Phase 3 — Profile 3.2**. Cinematic collector cover, collectible shelf/podium, theme aura, animated but accessible medals and real purchase-history timeline *only where actual dates exist*. Then real-device Phase 4 QA.
- Vault 4.0, later: authenticated public opt-in profiles, user collections, achievements, listings, offers. **Not active yet; do not expose private data or enable marketplace prematurely.**

**Critical decisions and requirements:**
- Visually vibrant, playful LEGO geometry, premium typography, smooth motion and distinctive story for each official LEGO theme, with good mobile performance.
- All catalog themes remain accessible, including those not owned, but active official LEGO shop themes must not be confused with retired or historical themes.
- Official themes are separate from *visual DNA*. Game Boy #72046 is Super Mario officially yet can have a retro visual; Batcycle #42155 is Technic yet can have Gotham styling.
- Keep user collection records, existing backup formats, cloud synchronization and authentication safe. Do not add passwords or service-role keys to GitHub.
- User's preferences and personal notes may be in the cloud, **not** in repository source. Do not overwrite cloud data by changing the default JSON.
- No client-only authority for marketplace trades, public ownership, monetary values, or achievements. Future multi-user features require deliberate database tables with proper RLS and moderation.
- Brand identity should avoid presenting LEGO Vault as officially affiliated with LEGO Group. Check licenses/terms for third-party images and metadata.

## Suggested ChatGPT Project instructions

Copy or adapt this text into **Project settings → Instructions**:

> You are my product designer and engineering partner for LEGO Vault. Work with the GitHub repository remus-c/lego-vault and follow AGENTS.md as the source of coding rules. Aim for a visually spectacular, colorful, animated and premium LEGO collector experience while protecting performance, accessibility, Supabase security and my existing collection. Maintain all 47 official LEGO Denmark theme entries (dated snapshot) alongside historical themes, keeping official categories independent from visual effects. Plan changes, use feature branches/PRs for significant updates, test what you can, and never claim changes are live before confirming. Current priority: LEGO Vault 3.2 Phase 3 Collector Profile, followed by Phase 4 browser QA; keep marketplace ideas for Vault 4.0.

## One-time UI steps (cannot be performed through this GitHub repository)

1. In the ChatGPT sidebar, create **New project** named **LEGO Vault — Design & Development**.
2. Open this conversation's `⋯` menu and select **Move to project** → that project. When this menu isn't offered, create a new chat inside the project and refer to this handoff.
3. In the project `⋯` → **Project settings**, paste the instructions above.
4. As project sources, optionally upload this handoff document and the implementation plan. These are also available on GitHub.
5. Open Codex in ChatGPT (if available to your plan), select/connect **remus-c/lego-vault** and begin with the scoped first task described below. Codex reads `AGENTS.md` from the repo. Exact Codex UI labels may vary.

## First recommended Codex task

> Inspect AGENTS.md, docs/vault-3.2-implementation-plan.md, profile.js and profile.css. Propose and implement LEGO Vault 3.2 Phase 3: a cinematic responsive collector hero with layered LEGO-inspired background, a polished themed three-set showcase, theme aura, and animated trophy cabinet. Preserve collection/Supabase data, keep default gallery consistent with 47 official LEGO.com theme registry, avoid invented purchase dates, honor Off/Gentle/Cinematic and reduced-motion settings, use a feature branch/PR, run node scripts/smoke-test.mjs, and report what was and wasn't browser-tested.

## Operational caution

ChatGPT Projects are organizational workspaces; **moving a chat does not relocate GitHub files or Supabase tables**. Codex remains code-focused and is not automatically granted extra Supabase permissions. Never paste an admin key into a Project source or ChatGPT instruction.

No automated GitHub Pages deployment or actual browser QA is asserted by this handoff file.
