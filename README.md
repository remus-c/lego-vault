# LEGO Vault 3.0

Live website (GitHub Pages): https://remus-c.github.io/lego-vault/

The website is a static HTML collection tracker with separate **Owned**, **Star Wars Helmets**, and **Wishlist** views.

## Features
- 35 confirmed owned sets and five wishlist items at the time of this release.
- Images loaded from Brickset by LEGO set number; if an image fails, a theme illustration is shown instead.
- Reference original retail prices are *not* current resale market values.
- Local, browser-specific edits, backup import/export, and CSV export work with no account.
- Optional private cloud synchronization across devices using a separate Supabase project.
- Optional LEGO set details lookup (name, year, piece count, image preview) with a personal Rebrickable API key, stored only in the local browser.

## Enable cloud sync (owner setup)
1. Create a **separate** Supabase project for LEGO Vault on a plan whose price you accept.
2. Run [supabase/schema.sql](./supabase/schema.sql) as a migration. It creates the `public.vault_state` table with row-level security. Each signed-in user can only access their own row.
3. In Supabase > Authentication > URL Configuration, set **Site URL** to `https://remus-c.github.io/lego-vault/` and add the same path as an allowed redirect URL.
4. Configure the project **URL** and its **publishable** (or legacy anon) key on the website using the *Cloud Sync* button. To ship the configuration automatically across devices, add a `cloud-config.js` script with `window.VAULT_CLOUD_CONFIG={url:'https://PROJECT.supabase.co',publishableKey:'sb_publishable_...'};` and reference it **before** `cloud.js` in `index.html`.
5. Sign in with the same email on each device, through the emailed magic link.

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
