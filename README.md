# LEGO Vault 3.0

Live website (GitHub Pages): https://remus-c.github.io/lego-vault/

The website is a static HTML collection tracker with separate **Owned**, **Star Wars Helmets**, and **Wishlist** views.

## LEGO Vault 3.2 theme foundation

- **Theme Atlas**: browse/search all **47 LEGO.com Denmark currently-listed themes**, verified against https://www.lego.com/en-dk/themes on 18 October 2026. Every theme is displayed even when the collector owns zero sets.
- **Theme creation**: the Add Set dialog now includes all 47 current official categories plus `Other / Uncategorised` and `Legacy / retired theme`, with compatibility for the existing broad historic categories.
- **Thematic visuals**: Theme Atlas uses color-specific bricks, ambient motifs and subtle CSS animation; shared theme DNA is configured by a data registry with 21 stylistic presets.
- **Verified set mappings**: official categories are separate from aesthetic/franchise overlays, e.g. Game Boy #72046 → Super Mario, Batcycle #42155 → Technic, Home Alone #21330 → Ideas, PAC-MAN #10323 → Icons, X-Mansion #76294 → Marvel, and PlayStation #72306 → Other. Stored ownership is not rewritten.
- See [full 3.2 build plan](./docs/vault-3.2-implementation-plan.md) for the remaining animated profile, collection cards, achievements and quality gates.
- Note: This catalog is a **snapshot of today's LEGO.com theme directory**, not a comprehensive historical list of every LEGO theme ever produced.

## LEGO Vault 3.2 Atmosphere Engine (Phase 1 complete)

- Animated LEGO-inspired decorative background on all Vault screens: glowing studs, floating plastic bricks, star dust, garden petals/leaves, mechanical gears, arcade pixels and ambient rings.
- **Theme-aware:** The shared engine reads the verified 47-theme LEGO Denmark registry (21 reusable atmosphere worlds), follows active collection filters, theme atlas tiles, showcase cards and set details, and matches the selected profile cover.
- **Atmosphere button / FX (iPhone):** choose **Off**, **Gentle** (default), or **Cinematic**. Saves under `state.preferences.motion`, and follows existing optional signed-in Supabase cloud sync. A local backup also persists the setting.
- Accessibility and performance: `prefers-reduced-motion` always disables active effects; background tabs pause. Decorative sprite budgets: Gentle 7 on phones/13 desktop; Cinematic 16 on phones/29 desktop.
- Implementation isolated in [motion.css](./motion.css) and [motion-engine.js](./motion-engine.js); no external image resources are required for effects. These are independently created geometric LEGO-inspired motifs, not copied licensed imagery.
- JavaScript syntax and integration smoke tests have passed. Full visual and frame-rate QA on real iPhone/desktop devices is still pending.
- See [implementation plan](./docs/vault-3.2-implementation-plan.md).

## Features
- 35 confirmed owned sets and five wishlist items at the time of this release.
- Images loaded from Brickset by LEGO set number; if an image fails, a theme illustration is shown instead.
- Reference original retail prices are *not* current resale market values.
- Local, browser-specific edits, backup import/export, and CSV export work with no account.
- Optional private cloud synchronization across devices using a separate Supabase project.
- Optional LEGO set details lookup (name, year, piece count, image preview) with a personal Rebrickable API key, stored only in the local browser.

## Cloud sync — project created (18 October 2026)
- The separate **LEGO Vault** Supabase project is active in `eu-north-1`. Quoted project cost was 0 per month; free usage limits apply.
- `public.vault_state` has been created and row-level security enabled, with owner-only select/insert/update/delete policies.
- Public project URL and **publishable** key (not a secret) are in [cloud-config.js](./cloud-config.js), loaded before [cloud.js](./cloud.js).
- **Still required from the owner:** In the [Supabase authentication dashboard](https://supabase.com/dashboard/project/bfpzdyhfctwugtulbsna/auth/url-configuration), set **Site URL** to `https://remus-c.github.io/lego-vault/` and add `https://remus-c.github.io/lego-vault/**` under **Redirect URLs** (or the exact site URL). Save those settings.
- Next, open the website on the **device containing your latest local edits**, export a backup, click **Cloud Sync**, and request a sign-in email. Follow the emailed link. Repeat on other devices using the same email.
- The login and cross-device flow have **not** yet been tested end-to-end with a real account. No user data has been imported to the cloud yet.

**Do not use a Supabase secret/service-role key in any public file or browser.** Only publishable/anon keys are appropriate for the browser. RLS controls who can read or change a personal collection.

On first sign-in, the site uploads the browser's local state if the cloud account has no saved state. If browser and cloud data differ, it prompts the user to choose which copy to keep (offering a backup first). For concurrent updates, it checks `updated_at` and warns about a version conflict rather than silently overwriting it.

Signing out does not erase the browser's local cache. On a shared device, clear site storage separately as needed.

## Automatic set lookup
Rebrickable requires a personal API key, available via https://rebrickable.com/api/. In the Add Set dialog, choose **Fill details**, supply your key once, and enter a set number. This enriches name, release year, piece count and shows a photo preview. Prices and collection condition remain manually editable. If Rebrickable is unavailable, manual entry still works.

## Notes
- The static GitHub site is publicly accessible, including the base collection shipped with the source code. **Cloud-specific personal edits are per-user and protected by RLS**, not publicly synchronized.
- A public site that displays the collection is not by itself a private personal portal.
- Images and API lookups depend on third-party services and may temporarily fail.
- User changes in the cloud are not written back to the GitHub repository. A full backup can always be exported.
