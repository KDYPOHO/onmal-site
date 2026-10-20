import test from 'node:test';
import assert from 'node:assert/strict';
import { installFetchGuard } from './installFetchGuard.ts';

test('installFetchGuard allows setting fetch when prototype has only a getter', () => {
  const proto: Record<string, unknown> = {};
  const baseFetch = () => 'base';

  Object.defineProperty(proto, 'fetch', {
    configurable: true,
    enumerable: true,
    get() {
      return baseFetch;
    },
  });

  const win = Object.create(proto) as Record<string, unknown>;

  // Without guard, strict mode assignment throws TypeError
  assert.throws(() => {
    win.fetch = () => 'override';
  }, TypeError);

  installFetchGuard(win);

  // With guard installed, assignment succeeds without throwing
  const replacement = () => 'override';
  assert.doesNotThrow(() => {
    win.fetch = replacement;
  });
  assert.equal(win.fetch, replacement);
});

test('installFetchGuard allows setting fetch when own property has only a configurable getter', () => {
  const win: Record<string, unknown> = {};
  const baseFetch = () => 'base';

  Object.defineProperty(win, 'fetch', {
    configurable: true,
    enumerable: true,
    get() {
      return baseFetch;
    },
  });

  installFetchGuard(win);

  const replacement = () => 'override';
  assert.doesNotThrow(() => {
    win.fetch = replacement;
  });
  assert.equal(win.fetch, replacement);
});
