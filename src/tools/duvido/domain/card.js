export const CardOrigin = Object.freeze({ SEED: 'seed', USER_CREATED: 'user' });

export function createCard({ id = crypto.randomUUID(), question, answer, origin = CardOrigin.USER_CREATED, now = new Date().toISOString() }) {
  validateSide(question, 'pergunta');
  validateSide(answer, 'resposta');
  return { _id: id, type: 'duvido-card', question: { text: question.text.trim(), image: question.image ?? '' }, answer: { text: answer.text.trim(), image: answer.image ?? '' }, origin, createdAt: now, updatedAt: now, isDeleted: false };
}

function validateSide(side, label) { if (!side?.text?.trim()) throw new TypeError(`A ${label} é obrigatória.`); }
