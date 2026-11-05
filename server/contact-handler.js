/**
 * Contact-form handler. Wrapped by functions/api/contact.js (Cloudflare) and api/contact.js (Vercel).
 * All security behaviour lives in form-core.js.
 */
import { createFormHandler, EMAIL, phoneOk } from './form-core.js';
export { methodNotAllowed, clientIp } from './form-core.js';

const TOPICS = ['General question', 'Existing booking', 'Business / office move', 'Feedback or complaint', 'Something else'];

const contact = createFormHandler({
  fields: {
    name: [100, (v) => v.length >= 2],
    email: [120, (v) => EMAIL.test(v)],
    phone: [25, (v) => v === '' || phoneOk(v)], // optional
    topic: [60, (v) => TOPICS.includes(v)],
    message: [2000, (v) => v.length >= 10],
    consent: [10, (v) => v.length > 0],
  },
  multiline: ['message'],
  autoReply: 'contact',
  subject: (d) => `Website enquiry: ${d.topic} (${d.name})`,
  text: (d) =>
    [`Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone || 'not given'}`, `Topic: ${d.topic}`, '', d.message, '', `Consent given: ${d.consent ? 'yes' : 'no'}`, `Submitted: ${new Date().toISOString()}`].join('\n'),
});

export const handleContact = contact.handle;
export const validateContact = contact.validate;
export { TOPICS };
