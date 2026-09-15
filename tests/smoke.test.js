import test from 'node:test';
import assert from 'node:assert/strict';
import { tools, findToolByRoute } from '../src/app/tool-registry.js';

test('tool registry exposes the phase-one tools', () => {
  assert.deepEqual(tools.map(({ id }) => id), ['timer', 'duvido']);
  assert.equal(findToolByRoute('/timer')?.name, 'Timer');
  assert.equal(findToolByRoute('/missing'), undefined);
});
