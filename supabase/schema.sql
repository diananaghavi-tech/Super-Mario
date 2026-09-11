-- High score leaderboard for "The Little Prince" mini-game.
--
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)
-- for your project. Safe to re-run: it drops and recreates the objects it owns.
--
-- Design notes:
--   * One row per player name (case-insensitive). Submitting a lower score
--     than a player's existing best is a no-op, so "high score" always means
--     each player's personal best, not every run they've ever played.
--   * The table has NO direct insert/update/delete grants for the public
--     "anon" role. All writes go through the submit_score() function below,
--     which validates input and enforces the "only overwrite if higher" rule
--     atomically (avoids a race between two browsers submitting at once).
--   * Reads (for the leaderboard) are open to anyone via a SELECT policy.

drop function if exists public.submit_score(text, integer);
drop table if exists public.high_scores;

create table public.high_scores (
  id bigint generated always as identity primary key,
  player_name text not null check (char_length(player_name) between 1 and 20),
  score integer not null check (score >= 0 and score <= 1000000),
  updated_at timestamptz not null default now()
);

-- Case-insensitive uniqueness: "Alice" and "alice" are the same player.
create unique index high_scores_player_name_key on public.high_scores (lower(player_name));

alter table public.high_scores enable row level security;

create policy "Anyone can read the leaderboard"
  on public.high_scores
  for select
  to anon
  using (true);

-- Intentionally no insert/update/delete policies for anon: all writes must
-- go through submit_score(), which runs as the table owner (security definer)
-- so it can bypass RLS after doing its own validation.
create or replace function public.submit_score(p_name text, p_score integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_name is null or char_length(trim(p_name)) = 0 or char_length(p_name) > 20 then
    raise exception 'invalid player name';
  end if;
  if p_score is null or p_score < 0 or p_score > 1000000 then
    raise exception 'invalid score';
  end if;

  insert into public.high_scores (player_name, score)
  values (trim(p_name), p_score)
  on conflict (lower(player_name)) do update
    set score = excluded.score,
        updated_at = now()
    where excluded.score > public.high_scores.score;
end;
$$;

revoke all on function public.submit_score(text, integer) from public;
grant execute on function public.submit_score(text, integer) to anon;
