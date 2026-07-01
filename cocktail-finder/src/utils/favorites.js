const FAVORITES_KEY = 'favorites';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return null;
}

export function getFavorites() {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(FAVORITES_KEY) || '[]';
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFavorites(items) {
  const storage = getStorage();
  if (!storage) {
    return items;
  }

  storage.setItem(FAVORITES_KEY, JSON.stringify(items));
  return items;
}

export function isFavorite(id) {
  return getFavorites().some((item) => (item.id || item.idDrink) === id);
}

export function toggleFavoriteById(id, drink) {
  const stored = getFavorites();
  const existing = stored.find((item) => (item.id || item.idDrink) === id);

  if (existing) {
    const updated = stored.filter((item) => (item.id || item.idDrink) !== id);
    saveFavorites(updated);
    return { isFavorite: false, favorites: updated };
  }

  const normalized = {
    id,
    idDrink: id,
    strDrink: drink?.name || drink?.strDrink || 'Drink',
    strDrinkThumb: drink?.image || drink?.strDrinkThumb || '',
    strCategory: drink?.category || drink?.strCategory || 'Cocktail',
    strAlcoholic: drink?.alcoholic || drink?.strAlcoholic || 'Alcoholic',
  };

  const updated = [...stored, normalized];
  saveFavorites(updated);
  return { isFavorite: true, favorites: updated };
}

export function removeFavoriteById(id) {
  const updated = getFavorites().filter((item) => (item.id || item.idDrink) !== id);
  saveFavorites(updated);
  return updated;
}
