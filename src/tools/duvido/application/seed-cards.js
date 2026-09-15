import { CardOrigin, createCard } from '../domain/card.js';

const demoSvg = (label, color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img"><rect width="800" height="600" fill="${color}"/><text x="400" y="320" fill="white" font-size="96" font-family="sans-serif" text-anchor="middle">${label}</text></svg>`;
export const seedCards = Object.freeze([
  ['seed-fato-1', 'DEMO: Quantos minutos tem uma hora?', '60 minutos', '#3475B2'], ['seed-fato-2', 'DEMO: Qual cor surge da mistura de azul e amarelo?', 'Verde', '#1F6F43'], ['seed-fato-3', 'DEMO: Qual planeta é conhecido como planeta vermelho?', 'Marte', '#B84A3D'], ['seed-fato-4', 'DEMO: Quantos lados possui um triângulo?', 'Três lados', '#7B4FA3'],
].map(([id, questionText, answerText, color]) => createCard({ id, origin: CardOrigin.SEED, question: { text: questionText, image: demoSvg('?', color) }, answer: { text: answerText, image: demoSvg('✓', color) }, now: '2026-09-15T00:00:00.000Z' })));

export async function ensureSeedCards(repository, cards = seedCards) { const created = []; for (const card of cards) { const existing = await repository.find(card._id, { includeDeleted: true }); if (!existing) { await repository.create(card); created.push(card._id); } } return created; }
