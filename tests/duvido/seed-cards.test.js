import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureSeedCards, seedCards } from '../../src/tools/duvido/application/seed-cards.js';

class CardStore {
  constructor() { this.cards = new Map(); }
  async find(id, { includeDeleted } = {}) { const card = this.cards.get(id) ?? null; return !includeDeleted && card?.isDeleted ? null : card; }
  async create(card) { this.cards.set(card._id, card); return card; }
}

test('seed is idempotent and does not recreate a soft-deleted card', async () => {
  const repository = new CardStore();
  assert.equal((await ensureSeedCards(repository)).length, 4);
  assert.deepEqual(await ensureSeedCards(repository), []);
  repository.cards.set(seedCards[0]._id, { ...seedCards[0], isDeleted: true });
  assert.deepEqual(await ensureSeedCards(repository), []);
  assert.equal(repository.cards.get(seedCards[0]._id).isDeleted, true);
});
