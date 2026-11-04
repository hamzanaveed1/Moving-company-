import test from 'node:test';
import assert from 'node:assert/strict';
import { handleQuote, methodNotAllowed, clientIp, validate } from '../server/quote-handler.js';
import { onRequestPost, onRequest } from '../functions/api/quote.js';
import { POST, GET } from '../api/quote.js';

const good = {
  moveType: 'House move', size: '3 bedrooms', fromPostcode: 'M1 1AA', toPostcode: 'B1 1AA',
  fromAccess: 'Ground floor / house with easy access', toAccess: 'Flat with a working lift',
  moveDate: '2030-01-15', flexible: 'Fixed date', extras: 'Packing service', notes: 'Narrow street', name: 'Test User',
  phone: '07123 456789', email: 't@example.com', callTime: 'Morning', consent: 'on',
};
const env = { RESEND_API_KEY: 'k', TO_EMAIL: 'to@x.co.uk', FROM_EMAIL: 'Site <from@x.co.uk>', SITE_URL: 'https://www.x.co.uk' };
const call = ({ request, env: e }) => handleQuote(request, e, clientIp(request));
const req = (body, headers = {}) =>
  new Request('https://www.x.co.uk/api/quote', {
    method: 'POST',
    headers: { Origin: 'https://www.x.co.uk', 'Content-Type': 'application/json', 'CF-Connecting-IP': String(Math.random()), ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const withFetch = async (impl, fn) => { const o = globalThis.fetch; globalThis.fetch = impl; try { return await fn(); } finally { globalThis.fetch = o; } };

test('valid request is emailed as plain text and succeeds', async () => {
  let sent;
  const res = await withFetch(async (url, init) => { sent = { url, init }; return new Response('{}', { status: 200 }); }, () => call({ request: req(good), env }));
  assert.equal(res.status, 200);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  const payload = JSON.parse(sent.init.body);
  assert.equal(payload.reply_to, 't@example.com');
  assert.equal(payload.html, undefined);
  assert.match(payload.text, /From: M1 1AA/);
  assert.equal(sent.init.headers.Authorization, 'Bearer k');
});

test('rejects cross-site and missing Origin', async () => {
  assert.equal((await call({ request: req(good, { Origin: 'https://evil.example' }), env })).status, 403);
  const noOrigin = new Request('https://www.x.co.uk/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(good) });
  assert.equal((await call({ request: noOrigin, env })).status, 403);
});

test('rejects wrong content type, bad JSON, arrays and oversize bodies', async () => {
  assert.equal((await call({ request: req(good, { 'Content-Type': 'text/plain' }), env })).status, 415);
  assert.equal((await call({ request: req('{nope'), env })).status, 400);
  assert.equal((await call({ request: req('[]'), env })).status, 400);
  assert.equal((await call({ request: req({ ...good, notes: 'x'.repeat(9000) }), env })).status, 413);
});

test('server-side validation catches what the browser could skip', async () => {
  for (const bad of [{ fromPostcode: 'nope' }, { email: 'a@b' }, { phone: '123' }, { name: '' }, { moveDate: '2020-99-99' }, { consent: '' }]) {
    const res = await call({ request: req({ ...good, ...bad }), env });
    assert.equal(res.status, 400, JSON.stringify(bad));
  }
});

test('honeypot returns success but sends nothing', async () => {
  let called = false;
  const res = await withFetch(async () => { called = true; return new Response('{}'); }, () => call({ request: req({ ...good, website: 'http://spam' }), env }));
  assert.equal(res.status, 200);
  assert.equal(called, false);
});

test('control characters are stripped and long fields truncated', () => {
  const { data } = validate({ ...good, name: 'Bob\r\nBcc: attacker@evil.example', notes: 'n'.repeat(5000) });
  assert.ok(!/[\r\n]/.test(data.name));
  assert.equal(data.notes.length, 1000);
});

test('503 when the email API key is missing, 502 when provider fails', async () => {
  assert.equal((await call({ request: req(good), env: { SITE_URL: env.SITE_URL } })).status, 503);
  const res = await withFetch(async () => new Response('x', { status: 500 }), () => call({ request: req(good), env }));
  assert.equal(res.status, 502);
});

test('throttles repeated submissions from one IP', async () => {
  const ip = { 'CF-Connecting-IP': '203.0.113.9' };
  const codes = [];
  await withFetch(async () => new Response('{}'), async () => { for (let i = 0; i < 7; i++) codes.push((await call({ request: req(good, ip), env })).status); });
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429]);
});

test('non-POST methods get 405', async () => {
  assert.equal(onRequest().status, 405);
  assert.equal(GET().status, 405);
  assert.equal(methodNotAllowed().headers.get('Allow'), 'POST');
});

test('Cloudflare and Vercel wrappers both route to the shared handler', async () => {
  const cf = await withFetch(async () => new Response('{}'), () => onRequestPost({ request: req(good), env }));
  assert.equal(cf.status, 200);
  const saved = { ...process.env };
  Object.assign(process.env, env);
  try {
    const v = await withFetch(async () => new Response('{}'), () => POST(req(good)));
    assert.equal(v.status, 200);
  } finally { for (const k of Object.keys(env)) delete process.env[k]; Object.assign(process.env, saved); }
});

test('client IP is read from Vercel and Cloudflare headers', () => {
  const h = (o) => new Request('https://x.co.uk/', { headers: o });
  assert.equal(clientIp(h({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })), '203.0.113.7');
  assert.equal(clientIp(h({ 'x-real-ip': '198.51.100.2' })), '198.51.100.2');
  assert.equal(clientIp(h({ 'cf-connecting-ip': '192.0.2.5', 'x-forwarded-for': '1.1.1.1' })), '192.0.2.5');
  assert.equal(clientIp(h({})), 'unknown');
});

test('leads go to customersupport@movingpal.co.uk by default, and TO_EMAIL overrides it', async () => {
  const base = { RESEND_API_KEY: 'k', SITE_URL: env.SITE_URL };
  let sent;
  const grab = async (_u, init) => { sent = JSON.parse(init.body); return new Response('{}', { status: 200 }); };
  await withFetch(grab, () => call({ request: req(good, { 'CF-Connecting-IP': '198.51.100.1' }), env: base }));
  assert.deepEqual(sent.to, ['customersupport@movingpal.co.uk']);
  assert.match(sent.from, /customersupport@movingpal\.co\.uk/);
  assert.equal(sent.reply_to, 't@example.com');
  await withFetch(grab, () => call({ request: req(good, { 'CF-Connecting-IP': '198.51.100.2' }), env: { ...base, TO_EMAIL: 'other@example.com' } }));
  assert.deepEqual(sent.to, ['other@example.com']);
});
