import { createCard } from '../domain/card.js';

export class PouchDbCardRepository {
  constructor(database) { this.database = database; }
  async create(cardInput) { const card = cardInput.type === 'duvido-card' ? cardInput : createCard(cardInput); const result = await this.database.put(card); return { ...card, _rev: result.rev }; }
  async find(id, { includeDeleted = false } = {}) {
    try { const document = await this.database.get(id, { deleted: 'ok' }); return !includeDeleted && document.isDeleted ? null : document; }
    catch (error) { if (error.status === 404) return null; throw error; }
  }
  async findAll({ includeDeleted = false } = {}) { const result = await this.database.allDocs({ include_docs: true }); return result.rows.map((row) => row.doc).filter((document) => document?.type === 'duvido-card').filter((document) => includeDeleted || !document.isDeleted); }
  async findAvailableCards() { return this.findAll(); }
  async update(id, changes) { const current = await this.find(id, { includeDeleted: true }); if (!current) return null; const updated = { ...current, ...changes, _id: id, _rev: current._rev, updatedAt: new Date().toISOString() }; const result = await this.database.put(updated); return { ...updated, _rev: result.rev }; }
  async delete(id) { const current = await this.find(id, { includeDeleted: true }); if (!current) return null; return this.update(id, { isDeleted: true, deletedAt: new Date().toISOString() }); }
}

export async function createPouchDbCardRepository(PouchDB, databaseName = 's-w-duvido') { return new PouchDbCardRepository(new PouchDB(databaseName)); }
