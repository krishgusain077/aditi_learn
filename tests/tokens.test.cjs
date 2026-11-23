const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const p = require('node:path');
const root = p.join(__dirname, '..');
test('existing theme provider and shared token module exist', () => {
  const tokens = fs.readFileSync(p.join(root,'src/theme/tokens.ts'),'utf8');
  const provider = fs.readFileSync(p.join(root,'src/theme/ThemeProvider.tsx'),'utf8');
  assert.match(tokens, /light:/); assert.match(tokens, /dark:/);
  assert.match(provider, /export function ThemeProvider/);
  assert.match(provider, /export function useAppTheme/);
});
test('starter is ready for implementation rather than implementing feature', () => {
  const screen=fs.readFileSync(p.join(root,'src/screens/AppearanceSettings.tsx'),'utf8');
  assert.match(screen, /AppearanceSettings/);
  assert.doesNotMatch(screen, /<Switch/);
});
