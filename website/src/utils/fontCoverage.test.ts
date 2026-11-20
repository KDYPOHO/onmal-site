import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translations } from './i18n.ts';
import { SCREENSHOTS } from '../constants/assets.ts';

// The homepage ships fonts cut down to the characters it uses (tools/make-home-fonts.py).
// If text changes without re-running that script, new characters fall back silently.
test('every character on the homepage is inside the bundled font subset', () => {
  const subset = new Set(readFileSync(new URL('../../font-subset-chars.txt', import.meta.url), 'utf8'));
  const text = JSON.stringify(translations) + JSON.stringify(SCREENSHOTS);
  const missing = [...new Set(text)].filter((ch) => ch.trim() && !subset.has(ch));
  assert.deepEqual(missing, [], `Re-run tools/make-home-fonts.py; missing: ${missing.join('')}`);
});
