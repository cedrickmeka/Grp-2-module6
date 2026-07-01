import test from 'node:test';
import assert from 'node:assert/strict';

import { getFavorites, removeFavoriteById, toggleFavoriteById } from '../src/utils/favorites.js';

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }
}

test('adds and removes favorites from storage', () => {
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;

  const first = toggleFavoriteById('1', { name: 'Mojito', image: '/m.jpg' });
  assert.equal(first.isFavorite, true);
  assert.equal(getFavorites().length, 1);

  const second = toggleFavoriteById('1', { name: 'Mojito', image: '/m.jpg' });
  assert.equal(second.isFavorite, false);
  assert.equal(getFavorites().length, 0);

  const afterAdd = toggleFavoriteById('2', { name: 'Martini', image: '/m2.jpg' });
  assert.equal(afterAdd.isFavorite, true);
  assert.equal(getFavorites()[0].strDrink, 'Martini');

  const removed = removeFavoriteById('2');
  assert.equal(removed.length, 0);
});
