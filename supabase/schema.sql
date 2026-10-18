-- LEGO Vault 3.0 — private per-user collection sync.
-- Apply in a NEW dedicated Supabase project, not in an unrelated project's database.
-- Never publish a service_role/secret key in GitHub Pages.
create table if not exists public.vault_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint vault_state_object check (jsonb_typeof(state) = 'object')
);
alter table public.vault_state enable row level security;
revoke all on public.vault_state from anon;
grant select, insert, update, delete on public.vault_state to authenticated;

drop policy if exists "Read own LEGO Vault" on public.vault_state;
create policy "Read own LEGO Vault" on public.vault_state
 for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Create own LEGO Vault" on public.vault_state;
create policy "Create own LEGO Vault" on public.vault_state
 for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Update own LEGO Vault" on public.vault_state;
create policy "Update own LEGO Vault" on public.vault_state
 for update to authenticated using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);

drop policy if exists "Delete own LEGO Vault" on public.vault_state;
create policy "Delete own LEGO Vault" on public.vault_state
 for delete to authenticated using ((select auth.uid()) = user_id);

comment on table public.vault_state is
 'One versioned LEGO Vault collection JSON document per authenticated user; protected by RLS.';
