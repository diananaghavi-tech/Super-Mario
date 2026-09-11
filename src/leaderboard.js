import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabaseConfig.js';

const REST_URL = `${SUPABASE_URL}/rest/v1`;

function headers(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    ...extra,
  };
}

// Submits a player's score. The submit_score() Postgres function only keeps
// it if it's higher than that player's existing best (see supabase/schema.sql).
export async function submitScore(name, score) {
  const res = await fetch(`${REST_URL}/rpc/submit_score`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ p_name: name, p_score: score }),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit score (${res.status})`);
  }
}

export async function fetchTopScores(limit = 10) {
  const res = await fetch(
    `${REST_URL}/high_scores?select=player_name,score&order=score.desc&limit=${limit}`,
    { headers: headers() }
  );
  if (!res.ok) {
    throw new Error(`Failed to load leaderboard (${res.status})`);
  }
  return res.json();
}
