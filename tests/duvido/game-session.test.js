import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../src/tools/duvido/domain/game-session.js';
const cards = ['a', 'b', 'c'].map((_id) => ({ _id, question: { text: _id }, answer: { text: _id } }));
test('selectRandomCard chooses an available card', () => { const game = new GameSession(cards, { random: () => 0.5 }); assert.equal(game.selectRandomCard()._id, 'b'); });
test('markAsUsed removes the current card from the game', () => { const game = new GameSession(cards, { random: () => 0 }); game.selectRandomCard(); assert.equal(game.markAsUsed()._id, 'a'); assert.deepEqual(game.usedCardIds, ['a']); });
test('remainingCards excludes the card currently displayed', () => { const game = new GameSession(cards, { random: () => 0 }); game.selectRandomCard(); assert.equal(game.remainingCards(), 2); });
test('resetGame restores every card and clears used cards', () => { const game = new GameSession(cards, { random: () => 0 }); game.selectRandomCard(); game.markAsUsed(); game.resetGame(); assert.equal(game.remainingCards(), 3); assert.equal(game.usedCardIds.length, 0); });
