// Sends a form submission. The primary route is our own server function (/api/quote or /api/contact), which emails
// the company and instantly emails the customer a confirmation. If that function is unavailable (not configured yet,
// or down), the same data goes to the Web3Forms fallback so a lead is never lost; the customer then gets no automatic
// confirmation. Rejections from our own function (bad input, rate limit) are reported, not retried elsewhere.

type Opts = { endpoint?: string; fallback?: string; key?: string; body: Record<string, string> };

const post = (url: string, payload: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });

export async function sendLead({ endpoint, fallback, key, body }: Opts): Promise<void> {
  if (endpoint) {
    try {
      const res = await post(endpoint, body);
      if (res.ok) return;
      const missingOrBroken = res.status >= 500 || res.status === 404 || res.status === 405;
      if (!missingOrBroken) throw new Error('rejected'); // 400/403/415/429: do not retry through another route
    } catch (e) {
      if (e instanceof Error && e.message === 'rejected') throw e; // otherwise a network error: try the fallback
    }
  }
  if (fallback && key) {
    const res = await post(fallback, { ...body, access_key: key });
    if (res.ok) return;
  }
  throw new Error('not sent');
}
