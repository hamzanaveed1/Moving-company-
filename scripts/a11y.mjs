/**
 * Accessibility scan (axe-core, WCAG 2.0/2.1/2.2 A+AA + best practices) across every page template.
 * Usage:  npm run build && npm run preview &   then   npm run a11y
 * Needs Playwright with a browser available (`npx playwright install chromium` if you do not have one).
 */
const BASE = process.env.BASE_URL || 'http://localhost:4321';
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium'); process.exit(2); }
const axe = (await import('node:module')).createRequire(import.meta.url)('axe-core/axe.min.js');
const urls = ['/', '/services/', '/services/house-removals/', '/locations/', '/locations/removals-london/', '/routes/', '/routes/london-to-manchester-removals/', '/blog/', '/blog/how-much-does-moving-house-cost-uk/', '/get-a-quote/', '/contact/', '/about/', '/faq/', '/moving-checklist/', '/privacy-policy/', '/security/'];
const browser = await chromium.launch();
let total = 0;
for (const [name, viewport] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await (await browser.newContext({ viewport, bypassCSP: true })).newPage(); // CSP bypass only so axe can be injected
  for (const u of urls) {
    await page.goto(BASE + u, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axe.source });
    const r = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    for (const v of r.violations) { total++; console.log(`✗ [${name}] ${u}: ${v.id} (${v.impact}) ${v.nodes[0].target.join(' ')}`); }
  }
}
await browser.close();
console.log(total ? `${total} accessibility violation(s)` : 'No accessibility violations found');
process.exit(total ? 1 : 0);
