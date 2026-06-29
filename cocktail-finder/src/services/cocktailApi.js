const BASE_URL = "http://localhost:4000";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

export const fetchCocktails = async (search = "") => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchJson(`${BASE_URL}/api/cocktails${query}`);
};

export const fetchCocktailCategories = async () => {
  return fetchJson(`${BASE_URL}/api/cocktails/categories`);
};

export const getCocktailById = async (id) => {
  return fetchJson(`${BASE_URL}/api/cocktails/${id}`);
};

export const createCocktail = async (cocktail) => {
  return fetchJson(`${BASE_URL}/api/cocktails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cocktail),
  });
};

export const updateCocktail = async (id, cocktail) => {
  return fetchJson(`${BASE_URL}/api/cocktails/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cocktail),
  });
};

export const deleteCocktail = async (id) => {
  return fetchJson(`${BASE_URL}/api/cocktails/${id}`, {
    method: "DELETE",
  });
};

export const getCocktailNotes = async (cocktailId) => {
  return fetchJson(`${BASE_URL}/api/cocktails/${cocktailId}/notes`);
};

export const createNote = async (cocktailId, text) => {
  return fetchJson(`${BASE_URL}/api/cocktails/${cocktailId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const updateNote = async (noteId, text) => {
  return fetchJson(`${BASE_URL}/api/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const deleteNote = async (noteId) => {
  return fetchJson(`${BASE_URL}/api/notes/${noteId}`, {
    method: "DELETE",
  });
};
