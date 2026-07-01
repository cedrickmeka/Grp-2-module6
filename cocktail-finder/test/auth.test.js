import test from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.BASE || 'http://localhost:4000';

function makeEmail() {
  return `user-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
}

test('auth, ownership, and pagination flow works', async () => {
  const email = makeEmail();
  const password = 'StrongPass123!';

  let res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email, password }),
  });
  assert.equal(res.status, 201, 'signup should succeed');

  res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(res.status, 200, 'login should succeed');
  const loginBody = await res.json();
  assert.ok(loginBody.token, 'login should return a token');
  const token = loginBody.token;

  res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200, 'me should return current user');

  res = await fetch(`${BASE}/api/cocktails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Auth Cocktail',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      glass: 'Cocktail glass',
      image: 'https://example.com/auth.jpg',
      instructions: 'Shake and serve.',
      ingredients: ['Gin', 'Lemon'],
    }),
  });
  assert.equal(res.status, 201, 'creating a cocktail should succeed');
  const cocktail = await res.json();
  assert.equal(cocktail.userId, loginBody.user.id, 'cocktail should belong to the authenticated user');

  res = await fetch(`${BASE}/api/cocktails?page=1&per_page=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200, 'cocktails list should support pagination');
  const pagedCocktails = await res.json();
  assert.ok(Array.isArray(pagedCocktails.items), 'pagination response should include items');
  assert.ok(pagedCocktails.items.length <= 1, 'per_page should limit result size');

  res = await fetch(`${BASE}/api/cocktails/${cocktail.id}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: 'Owned note' }),
  });
  assert.equal(res.status, 201, 'creating a note should succeed');
  const note = await res.json();
  assert.equal(note.userId, loginBody.user.id, 'note should belong to the authenticated user');

  res = await fetch(`${BASE}/api/cocktails/${cocktail.id}/notes?page=1&per_page=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200, 'notes list should support pagination');
  const pagedNotes = await res.json();
  assert.ok(Array.isArray(pagedNotes.items), 'pagination response should include notes items');

  res = await fetch(`${BASE}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200, 'logout should succeed');

  res = await fetch(`${BASE}/api/cocktails`);
  assert.equal(res.status, 401, 'protected routes should require auth');
});
