/**
 * Shared quote-form handler (host independent). Wrapped by:
 *   functions/api/quote.js  (Cloudflare Pages Function)
 *   api/quote.js            (Vercel Function)
 *
 * Receives the quote form, validates it SERVER-SIDE (client checks can be bypassed), and emails it to you
 * through Resend. Secrets live in Cloudflare env vars, never in the browser.
 *
 * Required environment variables (Vercel: Project > Settings > Environment Variables; Cloudflare: Pages > Settings):
 *   RESEND_API_KEY   secret
 *   TO_EMAIL         where leads go, e.g. leads@loadby.co.uk
 *   FROM_EMAIL       a sender on a domain verified in Resend, e.g. "Website <quotes@loadby.co.uk>"
 *   SITE_URL         e.g. https://loadby.co.uk  (used for the Origin check)
 */

const MAX_BODY = 8 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort per-isolate throttle. For real protection add a Cloudflare WAF rate-limiting rule on /api/quote.
const hits = new Map();

const POSTCODE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?(\s*\d[A-Za-z]{2})?$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

/** field -> [max length, validator] */
const FIELDS = {
  moveType: [60, (v) => v.length > 0],
  size: [60, (v) => v.length > 0],
  fromPostcode: [10, (v) => POSTCODE.test(v)],
  toPostcode: [10, (v) => POSTCODE.test(v)],
  fromAccess: [80, (v) => v.length > 0],
  toAccess: [80, (v) => v.length > 0],
  moveDate: [10, (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))],
  flexible: [30, () => true],
  extras: [300, () => true],
  notes: [1000, () => true],
  name: [100, (v) => v.length >= 2],
  phone: [25, (v) => v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15],
  email: [120, (v) => EMAIL.test(v)],
  callTime: [30, () => true],
  consent: [10, (v) => v.length > 0],
};

/** Strip control characters (blocks header/log injection) and trim. Only `multiline` fields may keep newlines. */
const clean = (v, multiline = false) =>
  String(v ?? '')
    .replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '')
    .trim();
const MULTILINE = new Set(['notes']);

export function validate(input) {
  const out = {};
  const errors = [];
  for (const [key, [max, ok]] of Object.entries(FIELDS)) {
    const v = clean(input?.[key], MULTILINE.has(key)).slice(0, max);
    if (!ok(v)) errors.push(key);
    out[key] = v;
  }
  return { data: out, errors };
}

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
  });

export async function handleQuote(request, env, ip = 'unknown') {
  // 1. Same-site only. Browsers always send Origin on cross-origin POSTs, so this blocks other sites posting here.
  const origin = request.headers.get('Origin');
  const allowed = new Set([new URL(request.url).origin]);
  if (env.SITE_URL) allowed.add(new URL(env.SITE_URL).origin);
  if (!origin || !allowed.has(origin)) return json({ ok: false, error: 'forbidden' }, 403);

  // 2. Content type and size
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'bad_request' }, 415);
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);

  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ ok: false, error: 'bad_request' }, 400);

  // 3. Throttle (best effort)
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '600' });
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();

  // 4. Bots: honeypot filled => pretend success, send nothing
  if (clean(body.website)) return json({ ok: true });

  // 5. Validate
  const { data, errors } = validate(body);
  if (errors.length) return json({ ok: false, error: 'invalid', fields: errors }, 400);

  // 6. Deliver
  if (!env.RESEND_API_KEY || !env.TO_EMAIL || !env.FROM_EMAIL) return json({ ok: false, error: 'not_configured' }, 503);

  const subject = `New quote request: ${data.moveType} (${data.fromPostcode} to ${data.toPostcode})`;
  const text = [
    `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`, `Best time to call: ${data.callTime || 'n/a'}`, '',
    `Move type: ${data.moveType}`, `Size: ${data.size}`, `From: ${data.fromPostcode} (${data.fromAccess})`, `To: ${data.toPostcode} (${data.toAccess})`,
    `Date: ${data.moveDate} (${data.flexible || 'n/a'})`, `Extras: ${data.extras || 'None'}`, '', `Notes: ${data.notes || 'None'}`, '',
    `Consent given: ${data.consent ? 'yes' : 'no'}`, `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      // Plain text only: customer-supplied content is never interpreted as HTML.
      body: JSON.stringify({ from: env.FROM_EMAIL, to: [env.TO_EMAIL], reply_to: data.email, subject, text }),
    });
  } catch {
    return json({ ok: false, error: 'upstream' }, 502);
  }
  if (!res.ok) return json({ ok: false, error: 'upstream' }, 502);
  return json({ ok: true });
}

export const methodNotAllowed = () => json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });

/** Best-effort client IP from the headers each host sets. */
export const clientIp = (request) =>
  request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
