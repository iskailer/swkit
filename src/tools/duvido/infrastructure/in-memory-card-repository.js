export class InMemoryCardRepository {
  constructor(cards = []) { this.cards = new Map(cards.map((card) => [card._id, structuredClone(card)])); }
  async create(card) { const saved = { ...structuredClone(card), _rev: '1' }; this.cards.set(saved._id, saved); return structuredClone(saved); }
  async find(id, { includeDeleted = false } = {}) { const card = this.cards.get(id); return card && (includeDeleted || !card.isDeleted) ? structuredClone(card) : null; }
  async findAll({ includeDeleted = false } = {}) { return [...this.cards.values()].filter((card) => includeDeleted || !card.isDeleted).map(structuredClone); }
  async update(id, changes) { const current = await this.find(id, { includeDeleted: true }); if (!current) return null; const saved = { ...current, ...structuredClone(changes), updatedAt: new Date().toISOString(), _rev: String(Number(current._rev ?? 0) + 1) }; this.cards.set(id, saved); return structuredClone(saved); }
  async delete(id) { return this.update(id, { isDeleted: true, deletedAt: new Date().toISOString() }); }
}
