// Verifies that local files referenced from index.html (stylesheet, entry
// script) actually exist, so a broken reference fails fast in CI instead of
// showing up as a blank page after deploy.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const refRe = /(?:href|src)="(?!https?:\/\/)([^"]+)"/g;

let ok = true;
let match;
while ((match = refRe.exec(html))) {
  const refPath = path.join(ROOT, match[1]);
  if (!fs.existsSync(refPath)) {
    console.error(`index.html references missing file: ${match[1]}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log('All local references in index.html exist.');
