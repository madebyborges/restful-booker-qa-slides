-- Capability-scoped sessions. Only the public project key belongs in the browser.
create schema if not exists presentation_private;
revoke all on schema presentation_private from public, anon, authenticated;

create table public.presentation_sessions (
  id uuid primary key,
  capability_hash text not null check (capability_hash ~ '^[0-9a-f]{64}$'),
  state jsonb not null check (
    jsonb_typeof(state) = 'object' and octet_length(state::text) < 4096
    and state ? 'mode' and state->>'mode' in ('api','front')
  ),
  version bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
alter table public.presentation_sessions enable row level security;
revoke all on public.presentation_sessions from public, anon, authenticated;
grant select (id,state,version,expires_at) on public.presentation_sessions to anon;
grant insert (id,capability_hash,state) on public.presentation_sessions to anon;
grant update (state) on public.presentation_sessions to anon;

create policy session_read on public.presentation_sessions for select to anon using (
  expires_at > now() and capability_hash = encode(sha256(convert_to(
    coalesce(current_setting('request.headers',true)::json->>'x-room-key',''),'UTF8')),'hex')
);
create policy session_create on public.presentation_sessions for insert to anon with check (
  coalesce(current_setting('request.headers',true)::json->>'x-room-key','') ~ '^[0-9a-f]{32}$'
  and capability_hash = encode(sha256(convert_to(
    coalesce(current_setting('request.headers',true)::json->>'x-room-key',''),'UTF8')),'hex')
);
create policy session_update on public.presentation_sessions for update to anon using (
  expires_at > now() and capability_hash = encode(sha256(convert_to(
    coalesce(current_setting('request.headers',true)::json->>'x-room-key',''),'UTF8')),'hex')
) with check (
  expires_at > now() and capability_hash = encode(sha256(convert_to(
    coalesce(current_setting('request.headers',true)::json->>'x-room-key',''),'UTF8')),'hex')
);

create function presentation_private.version_session() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.version := old.version + 1;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
revoke all on function presentation_private.version_session() from public,anon,authenticated;
create trigger version_session before update on public.presentation_sessions
for each row execute function presentation_private.version_session();
