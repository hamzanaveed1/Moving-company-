/**
 * Quote-form handler. Wrapped by functions/api/quote.js (Cloudflare) and api/quote.js (Vercel).
 * All security behaviour lives in form-core.js.
 */
import { createFormHandler, POSTCODE, EMAIL, phoneOk } from './form-core.js';
export { methodNotAllowed, clientIp } from './form-core.js';

const quote = createFormHandler({
  fields: {
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
    phone: [25, phoneOk],
    email: [120, (v) => EMAIL.test(v)],
    callTime: [30, () => true],
    consent: [10, (v) => v.length > 0],
  },
  multiline: ['notes'],
  autoReply: 'quote',
  subject: (d) => `New quote request: ${d.moveType} (${d.fromPostcode} to ${d.toPostcode})`,
  text: (d) =>
    [
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email}`, `Best time to call: ${d.callTime || 'n/a'}`, '',
      `Move type: ${d.moveType}`, `Size: ${d.size}`, `From: ${d.fromPostcode} (${d.fromAccess})`, `To: ${d.toPostcode} (${d.toAccess})`,
      `Date: ${d.moveDate} (${d.flexible || 'n/a'})`, `Extras: ${d.extras || 'None'}`, '', `Notes: ${d.notes || 'None'}`, '',
      `Consent given: ${d.consent ? 'yes' : 'no'}`, `Submitted: ${new Date().toISOString()}`,
    ].join('\n'),
});

export const handleQuote = quote.handle;
export const validate = quote.validate;
