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

test('valid request is emailed to the company as plain text and succeeds', async () => {
  const calls = [];
  const res = await withFetch(async (url, init) => { calls.push({ url, init }); return new Response('{}', { status: 200 }); }, () => call({ request: req(good), env }));
  assert.equal(res.status, 200);
  const sent = calls[0]; // the notification to the company is sent first
  assert.equal(sent.url, 'https://api.resend.com/emails');
  const payload = JSON.parse(sent.init.body);
  assert.deepEqual(payload.to, ['to@x.co.uk']);
  assert.equal(payload.reply_to, 't@example.com');
  assert.equal(payload.html, undefined);
  assert.match(payload.text, /From: M1 1AA/);
  assert.equal(payload.headers['Auto-Submitted'], 'auto-generated'); // so a mailbox auto-reply never answers our own lead email
  assert.equal(sent.init.headers.Authorization, 'Bearer k');
});

test('the customer instantly gets a confirmation email from the company mailbox', async () => {
  const calls = [];
  const res = await withFetch(async (url, init) => { calls.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); }, () => call({ request: req({ ...good, name: '<b>Ann Lee' }), env }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 2);
  const mail = calls[1];
  assert.deepEqual(mail.to, ['t@example.com']);            // to the customer
  assert.equal(mail.from, 'Site <from@x.co.uk>');            // from the configured company sender
  assert.equal(mail.reply_to, 'to@x.co.uk');                 // replies reach the company mailbox
  assert.match(mail.subject, /received your quote request/);
  assert.match(mail.text, /within one business day/);
  assert.match(mail.text, /M1 1AA/);
  assert.equal(mail.headers['Auto-Submitted'], 'auto-replied');
  assert.ok(!mail.html.includes('<b>Ann'), 'customer-supplied name must be HTML-escaped');
  assert.ok(mail.html.includes('&lt;b&gt;Ann'));
  assert.ok(mail.html.includes('https://www.x.co.uk/email-logo.png'), 'the logo is shown at the end of the email');
});

test('a failed confirmation email never fails the request, and none is sent if the lead itself failed', async () => {
  let n = 0;
  const res = await withFetch(async () => (++n === 1 ? new Response('{}', { status: 200 }) : new Response('nope', { status: 500 })), () => call({ request: req(good), env }));
  assert.equal(res.status, 200);
  assert.equal(n, 2);
  n = 0;
  const bad = await withFetch(async () => { n++; return new Response('x', { status: 500 }); }, () => call({ request: req(good), env }));
  assert.equal(bad.status, 502);
  assert.equal(n, 1); // no confirmation is promised when the lead did not go through
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
  const calls = [];
  const grab = async (_u, init) => { calls.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); };
  await withFetch(grab, () => call({ request: req(good, { 'CF-Connecting-IP': '198.51.100.1' }), env: base }));
  assert.deepEqual(calls[0].to, ['customersupport@movingpal.co.uk']);
  assert.match(calls[0].from, /customersupport@movingpal\.co\.uk/);
  assert.equal(calls[0].reply_to, 't@example.com');
  assert.deepEqual(calls[1].to, ['t@example.com']);            // confirmation to the customer
  assert.equal(calls[1].reply_to, 'customersupport@movingpal.co.uk');
  calls.length = 0;
  await withFetch(grab, () => call({ request: req(good, { 'CF-Connecting-IP': '198.51.100.2' }), env: { ...base, TO_EMAIL: 'other@example.com' } }));
  assert.deepEqual(calls[0].to, ['other@example.com']);
});
