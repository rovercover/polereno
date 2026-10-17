import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

const files = await readdir('dist', { recursive: true });
assert(!files.some(file => /\.(map|tsx?|prd|md)$/.test(file)), 'Source files or source maps must not be deployed.');
const scripts = files.filter(file => file.endsWith('.js') && !path.basename(file).startsWith('vendor-'));
assert(scripts.length > 0, 'No application bundle was produced.');
for (const file of scripts) {
  const source = await readFile(path.join('dist', file), 'utf8');
  assert(/_0x[0-9a-f]+/.test(source), 'Application identifiers must be obfuscated.');
  assert(!/\/\/[#@]\s*sourceMappingURL/.test(source), 'No source-map references should be published.');
}
const html = await readFile('dist/index.html', 'utf8');
assert(!html.includes('/src/'), 'HTML must reference only built assets.');
assert(html.includes('noindex, nofollow, nosnippet, noimageindex'));
assert((await readFile('dist/robots.txt', 'utf8')).includes('Disallow: /'));
assert((await readFile('dist/_headers', 'utf8')).includes('Cross-Origin-Resource-Policy: same-origin'));
console.log('Production checks passed: obfuscated app code, no source maps/source files, crawler restrictions, and resource headers.');
