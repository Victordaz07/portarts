/**
 * Smoke tests for the running app — asserts the key HTTP contracts.
 *
 * Usage:
 *   1. Start the app:   npm run build && npm run start   (or npm run dev)
 *   2. In another shell: npm run test:smoke
 *      (override the target with BASE_URL=https://your-domain npm run test:smoke)
 *
 * These are intentionally dependency-free (Node's built-in test runner) and hit
 * the server over HTTP, so they exercise routing, the admin auth gate, and the
 * graceful GitHub degradation exactly as a browser or crawler would.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function ensureServerUp() {
  try {
    await fetch(BASE_URL, { method: "HEAD" });
  } catch {
    throw new Error(
      `No server reachable at ${BASE_URL}. Start it with \`npm run start\` (or set BASE_URL).`
    );
  }
}

test("homepage responds 200 and is indexable", async () => {
  await ensureServerUp();
  const res = await fetch(`${BASE_URL}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /index, follow/i, "home should be index,follow");
});

test("missing project is noindex (no soft-404 indexing)", async () => {
  const res = await fetch(`${BASE_URL}/project/__does_not_exist__`);
  const html = await res.text();
  assert.match(html, /noindex/i, "not-found project must be noindex");
});

test("sitemap is served", async () => {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  assert.equal(res.status, 200);
});

test("GitHub proxy rejects missing params with 400", async () => {
  const res = await fetch(`${BASE_URL}/api/github`);
  assert.equal(res.status, 400);
});

test("GitHub repos feed degrades gracefully to an array", async () => {
  const res = await fetch(`${BASE_URL}/api/github?user=Victordaz07&type=repos`);
  assert.equal(res.status, 200, "repos feed must never 500 on upstream failure");
  const body = await res.json();
  assert.ok(Array.isArray(body), "repos feed must return an array");
});

test("admin API routes require an admin session (401)", async () => {
  for (const path of [
    "/api/admin/projects",
    "/api/admin/config",
    "/api/admin/analytics?days=7",
  ]) {
    const res = await fetch(`${BASE_URL}${path}`);
    assert.equal(res.status, 401, `${path} must be gated`);
  }
});

test("admin upload rejects unauthenticated POST (401)", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/upload`, { method: "POST" });
  assert.equal(res.status, 401);
});
