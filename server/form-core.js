/**
 * Host-independent form engine shared by every form (quote, contact). Each form supplies a small
 * definition (fields, subject, email body); this file supplies all the security behaviour:
 * same-origin check, JSON only, 8 KB cap, honeypot, per-IP throttle, server-side validation,
 * control-character stripping (header injection), plain-text email through Resend.
 *
 * Environment variables (Vercel: Project > Settings > Environment Variables; Cloudflare: Pages > Settings):
 *   RESEND_API_KEY   secret
 *   TO_EMAIL         optional: where messages go (default: customersupport@movingpal.co.uk)
 *   FROM_EMAIL       optional: a sender on a domain verified in Resend (default: "MovingPal <customersupport@movingpal.co.uk>")
 *   SITE_URL         e.g. https://www.movingpal.co.uk  (used for the Origin check)
 */

/** Default mailbox for every form. Override with the TO_EMAIL / FROM_EMAIL environment variables. */
export const DEFAULT_TO = 'customersupport@movingpal.co.uk';
export const DEFAULT_FROM = 'MovingPal <customersupport@movingpal.co.uk>';
const DEFAULT_SITE = 'https://www.movingpal.co.uk';

import { buildAutoReply } from './auto-reply.js';

export const POSTCODE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?(\s*\d[A-Za-z]{2})?$/;
export const EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
export const phoneOk = (v) => v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15;

/** Strip control characters (blocks header/log injection) and trim. Only `multiline` fields may keep newlines. */
export const clean = (v, multiline = false) =>
  String(v ?? '')
    .replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '')
    .trim();

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
  });

export const methodNotAllowed = () => json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });

/** Best-effort client IP from the headers each host sets. */
export const clientIp = (request) =>
  request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

/**
 * @param {object} def
 * @param {Record<string,[number,(v:string)=>boolean]>} def.fields  field -> [max length, validator]
 * @param {string[]} [def.multiline]   fields allowed to contain newlines
 * @param {(d:object)=>string} def.subject
 * @param {(d:object)=>string} def.text   plain-text email body
 * @param {'quote'|'contact'} [def.autoReply]  also email the customer an instant confirmation (see auto-reply.js)
 * @param {string} [def.replyTo]       field holding the sender's email address
 * @param {number} [def.maxPerWindow]
 */
export function createFormHandler(def) {
  const kind = def.autoReply;
  const MAX_BODY = 8 * 1024;
  const WINDOW_MS = 10 * 60 * 1000;
  const MAX_PER_WINDOW = def.maxPerWindow ?? 5;
  const multiline = new Set(def.multiline ?? []);
  // Best-effort per-instance throttle. Add a host firewall rate-limit rule for real protection.
  const hits = new Map();

  function validate(input) {
    const data = {};
    const errors = [];
    for (const [key, [max, ok]] of Object.entries(def.fields)) {
      const v = clean(input?.[key], multiline.has(key)).slice(0, max);
      if (!ok(v)) errors.push(key);
      data[key] = v;
    }
    return { data, errors };
  }

  async function handle(request, env, ip = 'unknown') {
    // 1. Same-site only. Browsers always send Origin on cross-origin POSTs, so this blocks other sites posting here.
    const origin = request.headers.get('Origin');
    const allowed = new Set([new URL(request.url).origin]);
    if (env.SITE_URL) allowed.add(new URL(env.SITE_URL).origin);
    if (!origin || !allowed.has(origin)) return json({ ok: false, error: 'forbidden' }, 403);

    // 2. Content type and size
    if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'bad_request' }, 415);
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);
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
    if (!env.RESEND_API_KEY) { console.error('[form] Not sent: RESEND_API_KEY is not set in the environment variables.'); return json({ ok: false, error: 'not_configured' }, 503); }
    const to = env.TO_EMAIL || DEFAULT_TO;
    const from = env.FROM_EMAIL || DEFAULT_FROM;
    let res;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        // Plain text only: customer-supplied content is never interpreted as HTML.
        body: JSON.stringify({ from, to: [to], reply_to: data[def.replyTo ?? 'email'], subject: def.subject(data).replace(/[\r\n]+/g, ' '), text: def.text(data), headers: { 'Auto-Submitted': 'auto-generated' } }), // tells mailbox auto-responders not to reply to this internal lead email
      });
    } catch (err) {
      console.error('[form] Not sent: could not reach Resend.', err?.message || '');
      return json({ ok: false, error: 'upstream' }, 502);
    }
    if (!res.ok) {
      // Log Resend's reason (for example "domain is not verified") so it shows in the host's logs. No customer data is logged.
      let reason = '';
      try { reason = (await res.text()).slice(0, 300); } catch { /* ignore */ }
      console.error(`[form] Not sent: Resend rejected the email (HTTP ${res.status}). ${reason}`);
      return json({ ok: false, error: 'upstream' }, 502);
    }

    // 7. Instant confirmation to the customer. The lead has already reached us, so a failure here is logged, never reported.
    if (kind) {
      try {
        const supportEmail = to;
        const mail = buildAutoReply(kind, data, { supportEmail, siteUrl: env.SITE_URL || DEFAULT_SITE });
        const ar = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from, to: [data[def.replyTo ?? 'email']], reply_to: supportEmail,
            subject: mail.subject, text: mail.text, html: mail.html,
            headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All' }, // stops mail loops with other auto-responders
          }),
        });
        if (!ar.ok) {
          let why = '';
          try { why = (await ar.text()).slice(0, 300); } catch { /* ignore */ }
          console.error(`[form] Lead delivered, but the customer confirmation was not sent (HTTP ${ar.status}). ${why}`);
        }
      } catch (err) {
        console.error('[form] Lead delivered, but the customer confirmation failed.', err?.message || '');
      }
    }
    return json({ ok: true });
  }

  return { handle, validate };
}
