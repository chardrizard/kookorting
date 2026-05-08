-- Rate limiting table for recipe generation
-- Tracks per-user generation count within a rolling window

create table if not exists recipe_rate_limits (
  user_id text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

-- Only the service role (edge function) should read/write this table
alter table recipe_rate_limits enable row level security;

-- No public access — all access is via service role in edge functions
