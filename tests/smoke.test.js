import test from 'node:test';
import assert from 'node:assert/strict';

import {
  tools,
  findToolByRoute,
} from '../src/app/tool-registry.js';

test('tool registry exposes the tools', () => {
  assert.deepEqual(
    tools.map(({ id }) => id),
    ['timer', 'duvido', 'todo']
  );

  assert.equal(
    findToolByRoute('/timer')?.name,
    'Timer'
  );

  assert.equal(
    findToolByRoute('/duvido')?.name,
    'Duvido que validou!'
  );

  assert.equal(
    findToolByRoute('/todo')?.name,
    'Todo List'
  );

  assert.equal(
    findToolByRoute('/missing'),
    undefined
  );
});