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
