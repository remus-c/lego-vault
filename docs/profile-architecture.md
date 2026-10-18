# Collector Profile: visual foundation for future Vault community

Version: 3.x (personal profile prototype). Do not treat these features as a public marketplace.

## Current user experience

- Dedicated **My Profile** navigation screen and homepage call-to-action.
- User-editable display name, collector handle (preview only), short bio, optional location, avatar insignia, cover palette, and three manually selected showcase sets.
- A curated, responsive cinematic profile layout with actual LEGO catalogue images and robust fallbacks.
- Real-time owned set count, known piece count, helmet series completion, and separate wishlist count.
- Six achievements calculated dynamically from owned set metadata. Level points: 10 per owned set and 5 extra per helmet.
- Stored in \`state.profile\` through existing \`save()\` and mirrored by the authenticated Supabase cloud-sync document. No database migration required.

## Privacy and user expectations

- This page is a **personal preview only**. There is not yet a public profile directory, permalink by collector handle, friend/follower system, or public editing permission.
- \`displayName\`, \`handle\`, \`bio\`, \`location\`, \`cover\`, \`avatar\`, and \`featuredIds\` live inside the user's RLS-protected \`vault_state.state\` JSON.
- The *static* GitHub Pages site, including its default collection data, remains public. Authenticated cloud-specific edits are private.
- The editable handle is not guaranteed unique. Reserve uniqueness at the server/database layer **before** enabling any public profile routes.
- Optional location defaults to blank. Never silently publish collection ownership, ownership valuations, emails, or exact locations.

## Scalability plan / data boundaries

The current JSON state is suitable for a single collector's private experience, but **not** for a social network or multi-party marketplace.

Suggested modular schema for a later authorized 4.0 project:
- \`user_profiles\` — account ID, unique handle, avatar, public display data, visibility and created/updated timestamps.
- \`collection_items\` — owner ID, canonical LEGO set ID, quantity, condition, photos, paid price, ownership visibility. Avoid public exposure of private notes and invoices.
- \`catalog_sets\` — set metadata by immutable catalogue ID, year, piece count, theme, image URL and refresh provenance, separate from user ownership.
- \`achievements\` and \`earned_achievements\` — versioned achievement definitions and verifiable grants.
- \`listings\`, \`listing_photos\`, \`offers\` — *future marketplace only* with seller ownership verification, statuses, expiry, price currency, moderated photos, offer permissions and user-facing privacy rules.
- \`notifications\` — private server-authorized events tied to recipient and actions.

Scale and integrity principles:
1. Keep authentication via Supabase Auth. Use granular RLS, least privilege and separate roles.
2. Do not rely on client-side achievements, XP, sale ownership, offer acceptance or price checks as authoritative when public activity begins.
3. Plan server-side transactional offer acceptance, anti-spam limits, content moderation, dispute/abuse workflows and audit trails before enabling any real sale.
4. Introduce explicit **opt-in visibility** and a preview showing what strangers can see. Default private until permission is granted.
5. Storage and cached image metadata should use legitimate sources and terms, with fallback and attribution when necessary.
6. Split future CSS/JS into versioned modules. Current profile.css + profile.js already isolate the profile from other site pages.
7. Introduce paginated catalogue and collection access rather than rendering every user's full data for a public community at once.
8. Use migrations and additive schemas; preserve compatibility with exported backups, private state and existing set IDs.

## Relevant source files

- \`index.html\`: navigation and shared collection state, routing, modal and save hooks.
- \`profile.css\`: themed and responsive collector-profile design.
- \`profile.js\`: profile editor, showcase and progress derived from collections.
- \`cloud.js\`, \`cloud-config.js\`: optional authenticated browser sync.
- \`metadata.js\`: optional Rebrickable metadata enrichment (personal key).
- \`supabase/schema.sql\`: private per-user data row, enforced by RLS.

## Pre-release QA checklist

- Desktop, tablet and narrow iPhone widths (375px and below).
- Keyboard focus, modal form and Escape-close semantics.
- Unavailable catalogue images; no image URLs supplied by user can inject arbitrary HTML.
- Zero sets, 1–2 sets and a very large collection; unknown price or piece count.
- User profile saves on one signed-in device and appears on another signed-in device.
- Cloud offline, duplicate writes, stale data conflict, sign-out and local backup import.
- Privacy checks before any future public release.
