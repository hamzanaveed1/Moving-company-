import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact as raw, validateContact, TOPICS, clientIp } from '../server/contact-handler.js';
import { onRequestPost } from '../functions/api/contact.js';
import { POST, GET } from '../api/contact.js';

// Like the real wrappers: pass the caller's IP so the per-IP throttle sees distinct visitors.
const handleContact = (request, env) => raw(request, env, clientIp(request));
const good = { name: 'Sam Jones', email: 's@example.com', phone: '', topic: TOPICS[0], message: 'Hello, do you cover Cardiff to Bristol?', consent: 'on' };
const env = { RESEND_API_KEY: 'k', TO_EMAIL: 'to@x.co.uk', FROM_EMAIL: 'Site <from@x.co.uk>', SITE_URL: 'https://www.x.co.uk' };
const req = (body, headers = {}) =>
  new Request('https://www.x.co.uk/api/contact', {
    method: 'POST',
    headers: { Origin: 'https://www.x.co.uk', 'Content-Type': 'application/json', 'x-real-ip': String(Math.random()), ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const withFetch = async (impl, fn) => { const o = globalThis.fetch; globalThis.fetch = impl; try { return await fn(); } finally { globalThis.fetch = o; } };
const ok = async () => new Response('{}', { status: 200 });

test('valid contact message is emailed to the company as plain text with reply-to', async () => {
  const calls = [];
  const res = await withFetch(async (u, i) => { calls.push(JSON.parse(i.body)); return new Response('{}'); }, () => handleContact(req(good), env));
  assert.equal(res.status, 200);
  const sent = calls[0];
  assert.equal(sent.reply_to, 's@example.com');
  assert.equal(sent.html, undefined);
  assert.match(sent.text, /do you cover Cardiff/);
  assert.match(sent.subject, /General question/);
});

test('the person who wrote in instantly gets a confirmation from the company mailbox', async () => {
  const calls = [];
  const res = await withFetch(async (u, i) => { calls.push(JSON.parse(i.body)); return new Response('{}'); }, () => handleContact(req(good), env));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 2);
  const mail = calls[1];
  assert.deepEqual(mail.to, ['s@example.com']);
  assert.equal(mail.from, 'Site <from@x.co.uk>');
  assert.equal(mail.reply_to, 'to@x.co.uk');
  assert.match(mail.subject, /received your message/);
  assert.match(mail.text, /within one business day/);
  assert.match(mail.text, /Hi Sam,/);
});

test('phone is optional but validated when present; topic must be from the list', async () => {
  assert.equal((await withFetch(ok, () => handleContact(req({ ...good, phone: '07123 456789' }), env))).status, 200);
  assert.equal((await handleContact(req({ ...good, phone: '12' }), env)).status, 400);
  assert.equal((await handleContact(req({ ...good, topic: 'Free money' }), env)).status, 400);
});

test('rejects short message, bad email, missing consent', async () => {
  for (const bad of [{ message: 'hi' }, { email: 'nope' }, { name: '' }, { consent: '' }]) {
    assert.equal((await handleContact(req({ ...good, ...bad }), env)).status, 400, JSON.stringify(bad));
  }
});

test('blocks cross-site posts, honeypot sends nothing, header injection stripped', async () => {
  assert.equal((await handleContact(req(good, { Origin: 'https://evil.example' }), env)).status, 403);
  let called = false;
  const hp = await withFetch(async () => { called = true; return new Response('{}'); }, () => handleContact(req({ ...good, website: 'spam' }), env));
  assert.equal(hp.status, 200);
  assert.equal(called, false);
  const { data } = validateContact({ ...good, name: 'Bob\r\nBcc: x@evil.example' });
  assert.ok(!/[\r\n]/.test(data.name));
});

test('subject line cannot contain line breaks', async () => {
  let sent;
  await withFetch(async (u, i) => { sent = JSON.parse(i.body); return new Response('{}'); }, () => handleContact(req({ ...good, name: 'A\nB' }), env));
  assert.ok(!/[\r\n]/.test(sent.subject));
});

test('503 when email is not configured; throttled after repeated posts; wrappers work', async () => {
  assert.equal((await handleContact(req(good), { SITE_URL: env.SITE_URL })).status, 503);
  const ip = { 'x-real-ip': '203.0.113.50' };
  const codes = [];
  await withFetch(ok, async () => { for (let i = 0; i < 7; i++) codes.push((await handleContact(req(good, ip), env)).status); });
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429]);
  assert.equal((await withFetch(ok, () => onRequestPost({ request: req(good), env }))).status, 200);
  Object.assign(process.env, env);
  try { assert.equal((await withFetch(ok, () => POST(req(good)))).status, 200); } finally { for (const k of Object.keys(env)) delete process.env[k]; }
  assert.equal(GET().status, 405);
});
