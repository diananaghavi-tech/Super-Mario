// Generates src/supabaseConfig.js from the SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
// environment variables at deploy time. The committed version of this file is
// just empty placeholders (see src/supabaseConfig.js) - real values only ever
// exist in the deploy runner's working copy, never in git history.
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';

if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must both be set.');
  process.exit(1);
}

const content = `// Generated at deploy time by .github/scripts/write-supabase-config.js - do not edit.
export const SUPABASE_URL = ${JSON.stringify(url)};
export const SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(key)};
`;

fs.writeFileSync(path.join(__dirname, '..', '..', 'src', 'supabaseConfig.js'), content);
console.log('Wrote src/supabaseConfig.js');
