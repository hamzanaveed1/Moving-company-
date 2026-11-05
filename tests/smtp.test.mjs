import test from 'node:test';
import assert from 'node:assert/strict';
import { SMTPServer } from 'smtp-server';
import { handleQuote, clientIp } from '../server/quote-handler.js';

const good = {
  moveType: 'House move', size: '1 bedroom', fromPostcode: 'S3 7BY', toPostcode: 'S60 2JH',
  fromAccess: 'Ground floor / easy access', toAccess: 'Flat with a working lift',
  moveDate: '2030-01-15', flexible: 'Fixed date', extras: 'None', notes: '', name: 'Hamza Naveed',
  phone: '07123 456789', email: 'customer@example.com', callTime: 'Morning', consent: 'on',
};
const req = () => new Request('https://www.x.co.uk/api/quote', { method: 'POST', headers: { Origin: 'https://www.x.co.uk', 'Content-Type': 'application/json', 'x-real-ip': String(Math.random()) }, body: JSON.stringify(good) });

// A real SMTP server on localhost standing in for the Hostinger mailbox server.
async function fakeMailbox() {
  const messages = [];
  const server = new SMTPServer({
    authOptional: false, allowInsecureAuth: true, disabledCommands: ['STARTTLS'],
    onAuth: (auth, _s, cb) => (auth.username === 'customersupport@movingpal.co.uk' && auth.password === 'right-password' ? cb(null, { user: 1 }) : cb(new Error('Invalid login'))),
    onData(stream, session, cb) { let raw = ''; stream.on('data', (c) => (raw += c)); stream.on('end', () => { messages.push({ to: session.envelope.rcptTo.map((r) => r.address), from: session.envelope.mailFrom.address, raw }); cb(); }); },
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { messages, port: server.server.address().port, close: () => new Promise((r) => server.close(r)) };
}
const envFor = (port, pass) => ({ SMTP_HOST: '127.0.0.1', SMTP_PORT: String(port), SMTP_SECURE: 'false', SMTP_USER: 'customersupport@movingpal.co.uk', SMTP_PASS: pass, SITE_URL: 'https://www.x.co.uk' });

test('SMTP: the lead goes to the mailbox and the customer gets an instant confirmation from it', async () => {
  const box = await fakeMailbox();
  try {
    const r = req();
    const res = await handleQuote(r, envFor(box.port, 'right-password'), clientIp(r));
    assert.equal(res.status, 200);
    assert.equal(box.messages.length, 2);
    const [lead, confirm] = box.messages;
    assert.deepEqual(lead.to, ['customersupport@movingpal.co.uk']);
    assert.match(lead.raw, /Reply-To: customer@example\.com/i);
    assert.match(lead.raw, /Auto-Submitted: auto-generated/i);
    assert.match(lead.raw, /S3 7BY/);
    assert.deepEqual(confirm.to, ['customer@example.com']);
    assert.equal(confirm.from, 'customersupport@movingpal.co.uk');
    assert.match(confirm.raw, /Reply-To: customersupport@movingpal\.co\.uk/i);
    assert.match(confirm.raw, /Auto-Submitted: auto-replied/i);
    assert.match(confirm.raw, /within one business day/);
    assert.match(confirm.raw, /text\/html/);
  } finally { await box.close(); }
});

test('SMTP: a wrong mailbox password fails cleanly (502) and sends nothing', async () => {
  const box = await fakeMailbox();
  try {
    const r = req();
    const res = await handleQuote(r, envFor(box.port, 'wrong'), clientIp(r));
    assert.equal(res.status, 502);
    assert.equal(box.messages.length, 0);
  } finally { await box.close(); }
});
