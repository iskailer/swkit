import { CardOrigin, createCard } from '../domain/card.js';
import { validateCardInput } from './card-validator.js';

export class CardManagementService {
  constructor(repository) { this.repository = repository; }
  async listCards() { return this.repository.findAll({ includeDeleted: false }); }
  async save(input, id) {
    const errors = validateCardInput(input);
    if (Object.keys(errors).length) return { errors };
    const payload = { question: { text: input.questionText, image: input.questionSvg }, answer: { text: input.answerText, image: input.answerSvg } };
    const card = id ? await this.repository.update(id, payload) : await this.repository.create(createCard({ ...payload, origin: CardOrigin.USER_CREATED }));
    return { card, errors: {} };
  }
  async deleteCard(id) { return this.repository.delete(id); }
}
