// Initialises every manual ad unit on the page (kept in an external file so CSP needs no inline script).
const w = window as unknown as { adsbygoogle: unknown[] };
w.adsbygoogle = w.adsbygoogle || [];
document.querySelectorAll('ins.adsbygoogle').forEach(() => {
  try { w.adsbygoogle.push({}); } catch { /* ad blocked or failed: page works regardless */ }
});
