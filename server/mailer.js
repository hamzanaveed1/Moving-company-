/**
 * Sends one email, by whichever provider is configured (checked in this order):
 *   1. SMTP: your own mailbox, e.g. the Hostinger mailbox customersupport@movingpal.co.uk (SMTP_HOST, SMTP_USER, SMTP_PASS)
 *   2. Resend (RESEND_API_KEY)
 * Messages use Resend's field names: { from, to: [..], reply_to, subject, text, html?, headers? }.
 * Returns { ok: true } or { ok: false, reason } (the reason is safe to log: it never contains secrets or customer data).
 * SMTP needs Node (Vercel Functions). Cloudflare Pages should use Resend.
 */

const smtpConfigured = (env) => Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
export const mailConfigured = (env) => smtpConfigured(env) || Boolean(env.RESEND_API_KEY);

export async function sendMail(env, msg) {
  return smtpConfigured(env) ? sendSmtp(env, msg) : sendResend(env, msg);
}

async function sendResend(env, msg) {
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
  } catch (err) {
    return { ok: false, reason: `could not reach Resend. ${err?.message || ''}`.trim() };
  }
  if (res.ok) return { ok: true };
  let why = '';
  try { why = (await res.text()).slice(0, 300); } catch { /* ignore */ }
  return { ok: false, reason: `Resend rejected the email (HTTP ${res.status}). ${why}`.trim() };
}

async function sendSmtp(env, msg) {
  let nodemailer;
  try { nodemailer = (await import('nodemailer')).default; } catch { return { ok: false, reason: 'SMTP is configured but the nodemailer package is not available on this host.' }; }
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465; // 465 = TLS from the start, 587 = STARTTLS
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST, port, secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
  });
  try {
    await transporter.sendMail({ from: msg.from, to: msg.to, replyTo: msg.reply_to, subject: msg.subject, text: msg.text, html: msg.html, headers: msg.headers });
    return { ok: true };
  } catch (err) {
    // Example reasons: "Invalid login" (wrong mailbox password), "Greeting never received" (wrong host/port).
    return { ok: false, reason: `SMTP send failed (${err?.code || 'error'}): ${String(err?.message || '').slice(0, 200)}` };
  } finally {
    transporter.close();
  }
}
