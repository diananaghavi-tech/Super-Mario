// Supabase connection details for the client-side leaderboard.
//
// This file is committed with empty placeholders on purpose. The deploy
// workflow (.github/workflows/deploy.yml) overwrites it with real values
// from the SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY repository secrets right
// before copying files to the server - the real values are never committed
// or logged. The publishable key is safe to expose to the browser (that's
// what it's for); it relies on the Row Level Security policies in
// supabase/schema.sql, not on secrecy, to keep the database safe.
//
// For local testing, fill these in yourself and don't commit real values.
export const SUPABASE_URL = '';
export const SUPABASE_PUBLISHABLE_KEY = '';
