// Walks every JS module under src/ and verifies each relative import path
// resolves to a real file. Catches the most common cross-file mistake when
// several people edit different modules in parallel: a rename or move that
// isn't reflected in every importer.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src');

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

const importRe = /import\s+(?:[\s\S]*?)\s+from\s+['"](\.[^'"]+)['"]/g;

let ok = true;
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = importRe.exec(text))) {
    const importPath = match[1];
    const resolved = path.resolve(path.dirname(file), importPath);
    if (!fs.existsSync(resolved)) {
      console.error(`${path.relative(ROOT, file)}: cannot resolve import "${importPath}"`);
      ok = false;
    }
  }
}

if (!ok) process.exit(1);
console.log('All module imports resolve.');
