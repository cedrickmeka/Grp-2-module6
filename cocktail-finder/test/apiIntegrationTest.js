// Full integration test covering create/update/delete for cocktails and notes
const BASE = process.env.BASE || 'http://localhost:4000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(url, attempts = 20, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (err) {
      // ignore
    }
    await sleep(delay);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function run() {
  await waitFor(`${BASE}/api/cocktails`);

  // Create cocktail
  const cocktailPayload = {
    name: 'CI Integration Cocktail',
    category: 'Cocktail',
    alcoholic: 'Alcoholic',
    glass: 'Test glass',
    image: 'https://example.com/ci.jpg',
    instructions: 'Mix everything.',
    ingredients: ['A', 'B'],
  };

  let res = await fetch(`${BASE}/api/cocktails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cocktailPayload),
  });
  if (res.status !== 201) throw new Error('Failed to create cocktail: ' + res.status);
  const created = await res.json();
  if (!created.id) throw new Error('Created cocktail missing id');
  const cid = created.id;

  // Fetch cocktail
  res = await fetch(`${BASE}/api/cocktails/${cid}`);
  if (res.status !== 200) throw new Error('Failed to fetch created cocktail');
  const fetched = await res.json();
  if (fetched.name !== cocktailPayload.name) throw new Error('Fetched cocktail name mismatch');

  // Update cocktail
  res = await fetch(`${BASE}/api/cocktails/${cid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'CI Integration Cocktail Updated' }),
  });
  if (res.status !== 200) throw new Error('Failed to update cocktail');
  const updated = await res.json();
  if (updated.name !== 'CI Integration Cocktail Updated') throw new Error('Update did not persist');

  // Add note
  res = await fetch(`${BASE}/api/cocktails/${cid}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Integration note' }),
  });
  if (res.status !== 201) throw new Error('Failed to create note');
  const note = await res.json();
  if (!note.id) throw new Error('Note missing id');
  const nid = note.id;

  // Get notes
  res = await fetch(`${BASE}/api/cocktails/${cid}/notes`);
  if (res.status !== 200) throw new Error('Failed to list notes');
  const notes = await res.json();
  if (!Array.isArray(notes) || notes.findIndex((n) => n.id === nid) === -1) throw new Error('Created note not found');

  // Update note
  res = await fetch(`${BASE}/api/notes/${nid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Integration note updated' }),
  });
  if (res.status !== 200) throw new Error('Failed to update note');

  // Delete note
  res = await fetch(`${BASE}/api/notes/${nid}`, { method: 'DELETE' });
  if (res.status !== 204) throw new Error('Failed to delete note');

  // Delete cocktail
  res = await fetch(`${BASE}/api/cocktails/${cid}`, { method: 'DELETE' });
  if (![200,204].includes(res.status)) throw new Error('Failed to delete cocktail');

  // Confirm deletion
  res = await fetch(`${BASE}/api/cocktails/${cid}`);
  if (res.status !== 404) throw new Error('Cocktail still exists after deletion');

  console.log('Integration tests passed');
}

run().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
