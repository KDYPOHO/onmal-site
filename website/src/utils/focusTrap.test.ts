import test from 'node:test';
import assert from 'node:assert/strict';
import { getWrappedFocusIndex } from './focusTrap.ts';

test('getWrappedFocusIndex wraps Tab from last element to first element', () => {
  assert.equal(getWrappedFocusIndex(2, 3, false), 0);
  assert.equal(getWrappedFocusIndex(-1, 3, false), 0);
  assert.equal(getWrappedFocusIndex(0, 3, false), null);
  assert.equal(getWrappedFocusIndex(1, 3, false), null);
});

test('getWrappedFocusIndex wraps Shift+Tab from first element to last element', () => {
  assert.equal(getWrappedFocusIndex(0, 3, true), 2);
  assert.equal(getWrappedFocusIndex(-1, 3, true), 2);
  assert.equal(getWrappedFocusIndex(1, 3, true), null);
  assert.equal(getWrappedFocusIndex(2, 3, true), null);
});

test('getWrappedFocusIndex handles empty focusable list safely', () => {
  assert.equal(getWrappedFocusIndex(0, 0, false), null);
  assert.equal(getWrappedFocusIndex(0, 0, true), null);
});
