// Simple smoke test for the backend API
const BASE = process.env.BASE || 'http://localhost:4000';

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function waitFor(url, attempts = 20, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (err) {
      // ignore
    }
    await sleep(delay);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

(async () => {
  try {
    await waitFor(`${BASE}/api/health`, 5, 500);

    const signupRes = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke User',
        email: `smoke-${Date.now()}@example.com`,
        password: 'SmokePass123!',
      }),
    });
    if (!signupRes.ok) {
      throw new Error(`Signup failed: ${signupRes.status}`);
    }
    const { token } = await signupRes.json();

    const res = await fetch(`${BASE}/api/cocktails?page=1&per_page=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error('API returned non-OK status', res.status);
      process.exit(2);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
      console.error('Unexpected payload, expected paginated object');
      process.exit(3);
    }

    console.log(`Smoke test passed — ${data.items.length} cocktails returned`);
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err.message);
    process.exit(1);
  }
})();
