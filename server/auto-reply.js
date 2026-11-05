/**
 * The instant confirmation email a customer receives after filling in a form.
 * Sent from customersupport@movingpal.co.uk (see DEFAULT_FROM in form-core.js); replies go to the same mailbox.
 * Plain text plus a simple inline-styled HTML version. Every customer-supplied value is HTML-escaped.
 */
export const BRAND = 'MovingPal';
/** How quickly the team promises to reply. Change this one line (e.g. 'two business days'). */
export const RESPONSE_TIME = 'one business day';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const niceDate = (iso) => { const t = Date.parse(`${iso}T12:00:00Z`); return Number.isNaN(t) ? String(iso || '') : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
const firstName = (name) => (String(name || '').trim().split(/\s+/)[0] || 'there').slice(0, 40);

/**
 * @param {'quote'|'contact'} kind
 * @param {Record<string,string>} d      validated, cleaned form data
 * @param {{ supportEmail: string, siteUrl: string }} ctx
 * @returns {{ subject: string, text: string, html: string }}
 */
export function buildAutoReply(kind, d, { supportEmail, siteUrl }) {
  const hi = firstName(d.name);
  const site = String(siteUrl || '').replace(/\/$/, '');
  const quote = kind === 'quote';

  const subject = quote ? `We have received your quote request | ${BRAND}` : `We have received your message | ${BRAND}`;
  const intro = quote
    ? `Thank you for asking ${BRAND} for a quote. We have received your details, and a member of our team will contact you by email within ${RESPONSE_TIME}.`
    : `Thank you for getting in touch with ${BRAND}. We have received your message, and a member of our team will reply by email within ${RESPONSE_TIME}.`;
  const timing = `If you wrote to us at a weekend or on a bank holiday, we will reply on the next business day.`;

  /** @type {[string,string][]} */
  const summary = quote
    ? [
        ['Move', `${d.moveType}${d.size ? `, ${d.size}` : ''}`],
        ['From', d.fromPostcode],
        ['To', d.toPostcode],
        ['Date', niceDate(d.moveDate)],
      ]
    : [
        ['Topic', d.topic],
      ];
  const steps = quote
    ? ['We review your details and may email you with a couple of questions.', 'You receive a written fixed-price quote that lists what is included.', 'If you are happy, you confirm your date and we plan the move with you.']
    : [];

  const text = [
    `Hi ${hi},`, '',
    intro, timing, '',
    quote ? 'Your request' : 'Your enquiry',
    ...summary.map(([k, v]) => `  ${k}: ${v}`), '',
    ...(steps.length ? ['What happens next', ...steps.map((s, i) => `  ${i + 1}. ${s}`), ''] : []),
    `Need to add something? Just reply to this email and it will reach us at ${supportEmail}.`, '',
    'Kind regards,', `The ${BRAND} team`, site, '',
    '---',
    `This is an automatic confirmation. You are receiving it because this email address was used on a form at ${site}. If that was not you, you can ignore it and nothing further will happen.`,
  ].join('\n');

  const row = ([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#5b6678;font-size:14px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;color:#0c1f3d;font-size:14px;font-weight:600">${esc(v)}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7fc">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e3e9f2;font-family:Arial,Helvetica,sans-serif;color:#26324a">
<tr><td style="padding:22px 28px 10px"><span style="font-size:22px;font-weight:800;color:#0c1f3d;letter-spacing:-0.5px">Moving</span><span style="font-size:22px;font-weight:800;color:#b36200;letter-spacing:-0.5px">Pal</span></td></tr>
<tr><td style="padding:6px 28px 4px"><h1 style="margin:0 0 12px;font-size:20px;color:#0c1f3d">${quote ? 'We have your quote request' : 'We have your message'}</h1>
<p style="margin:0 0 12px;font-size:15px;line-height:1.55">Hi ${esc(hi)},</p>
<p style="margin:0 0 12px;font-size:15px;line-height:1.55">${esc(intro)}</p>
<p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#5b6678">${esc(timing)}</p></td></tr>
<tr><td style="padding:0 28px 8px"><div style="background:#f4f7fc;border-radius:10px;padding:14px 16px"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5b6678">${quote ? 'Your request' : 'Your enquiry'}</p><table role="presentation" cellpadding="0" cellspacing="0">${summary.map(row).join('')}</table></div></td></tr>
${steps.length ? `<tr><td style="padding:12px 28px 0"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5b6678">What happens next</p><ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.6">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></td></tr>` : ''}
<tr><td style="padding:16px 28px 6px"><p style="margin:0;font-size:14px;line-height:1.55">Need to add something? Just reply to this email, or write to <a href="mailto:${esc(supportEmail)}" style="color:#1d4a85">${esc(supportEmail)}</a>.</p></td></tr>
<tr><td style="padding:14px 28px 22px"><p style="margin:0;font-size:14px;line-height:1.55">Kind regards,<br><strong>The ${esc(BRAND)} team</strong><br><a href="${esc(site)}" style="color:#1d4a85">${esc(site.replace(/^https?:\/\//, ''))}</a></p></td></tr>
<tr><td style="padding:14px 28px 20px;border-top:1px solid #e3e9f2"><p style="margin:0;font-size:12px;line-height:1.5;color:#7b8598">This is an automatic confirmation. You are receiving it because this email address was used on a form at ${esc(site.replace(/^https?:\/\//, ''))}. If that was not you, you can ignore it and nothing further will happen.</p></td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
