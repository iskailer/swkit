import PouchDB from 'pouchdb/dist/pouchdb.js';
import { ensureSeedCards } from '../application/seed-cards.js';
import { PouchDbCardRepository } from './pouchdb-card-repository.js';

let repositoryPromise;
export function getCardRepository() {
  repositoryPromise ??= (async () => { const repository = new PouchDbCardRepository(new PouchDB('s-w-duvido')); await ensureSeedCards(repository); return repository; })();
  return repositoryPromise;
}
