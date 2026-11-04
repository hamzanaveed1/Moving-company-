/**
 * Post-build audit of ./dist. Fails (exit 1) on any problem. Run: npm run audit:site
 * SEO: one h1, unique title/description, canonical, alt text, valid JSON-LD, no broken internal links.
 * Security: no inline scripts/handlers, no third-party resources, safe external links, headers file present.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(root);
const urlOf = (f) => '/' + f.slice(root.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '');

const titles = new Map(), descs = new Map(), links = new Set();
let problems = 0;
const bad = (m) => { problems++; console.log('✗', m); };
const adsOn = Boolean(process.env.PUBLIC_ADSENSE_CLIENT);

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const url = urlOf(f);
  const is404 = url.includes('404');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="(.*?)"/s)?.[1] ?? '';

  // ---- SEO ----
  if (!is404) {
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) bad(`${url}: ${h1s} <h1>`);
    if (!title) bad(`${url}: no <title>`);
    if (title.length > 65) bad(`${url}: title ${title.length} chars`);
    if (desc.length < 70 || desc.length > 165) bad(`${url}: description ${desc.length} chars`);
    if (titles.has(title)) bad(`${url}: duplicate title (also ${titles.get(title)})`);
    if (descs.has(desc)) bad(`${url}: duplicate description (also ${descs.get(desc)})`);
    titles.set(title, url); descs.set(desc, url);
    if (!/<link rel="canonical" href="/.test(html)) bad(`${url}: no canonical`);
    if (!/<html lang="en-GB"/.test(html)) bad(`${url}: missing lang`);
  }
  for (const m of html.matchAll(/<img [^>]*>/g)) if (!/ alt=/.test(m[0])) bad(`${url}: <img> without alt`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) { try { JSON.parse(m[1]); } catch { bad(`${url}: invalid JSON-LD`); } }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1] + '|' + url);

  // ---- Security ----
  for (const m of html.matchAll(/<script(?![^>]*type="application\/ld\+json")([^>]*)>/g)) {
    if (!/\ssrc=/.test(m[1])) bad(`${url}: inline <script> (breaks script-src 'self')`);
  }
  if (!adsOn && /<style[\s>]/.test(html)) bad(`${url}: inline <style> block`);
  if (/\son[a-z]+="/i.test(html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ''))) bad(`${url}: inline event handler attribute`);
  if (/javascript:/i.test(html)) bad(`${url}: javascript: URL`);
  if (!adsOn) {
    const own = process.env.SITE_URL || 'https://movingpal.co.uk';
    for (const m of html.matchAll(/<(script|img|iframe|source|video|audio|link)\b[^>]*?\s(?:src|href|srcset)="(https?:\/\/[^"]+)"[^>]*>/g)) {
      const [tag, name, target] = m;
      // <link> may carry absolute URLs only for canonical/alternate/sitemap metadata
      if (name === 'link' && /rel="(canonical|alternate|sitemap)"/.test(tag)) continue;
      if (!target.startsWith(own)) bad(`${url}: third-party resource <${name}> ${target}`);
    }
  }
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(m[0])) bad(`${url}: target=_blank without rel=noopener`);
}

for (const l of links) {
  const [href, from] = l.split('|');
  const p = join(root, href);
  const ok = existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
  if (!ok) bad(`broken link ${href} on ${from}`);
}

// ---- Deploy files ----
const headers = existsSync(`${root}/_headers`) ? readFileSync(`${root}/_headers`, 'utf8') : '';
for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
  if (!headers.includes(h)) bad(`_headers missing ${h}`);
}
if (!adsOn && /unsafe-inline'[^;]*;?\s*(?=.*script-src)|script-src[^;]*unsafe-(inline|eval)/.test(headers)) bad(`_headers: script-src is not strict`);
if (!existsSync(`${root}/.well-known/security.txt`)) bad('security.txt missing');
if (!existsSync(`${root}/sitemap-index.xml`)) bad('sitemap-index.xml missing');
if (!existsSync(`${root}/robots.txt`)) bad('robots.txt missing');

console.log(`${files.length} pages audited, ${problems} problem${problems === 1 ? '' : 's'}`);
process.exit(problems ? 1 : 0);
