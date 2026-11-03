# Deploying (Cloudflare Pages recommended)

Why Cloudflare Pages: free, global CDN with Brotli and HTTP/3 (fast), free TLS, DDoS protection, the `_headers` file is honoured, and the quote form function (`functions/api/quote.js`) runs there with no extra server. Netlify and Vercel also host the static site, but the bundled function is Cloudflare-specific. On other hosts use an external form endpoint instead (`PUBLIC_FORM_ENDPOINT`).

## 1. Connect the repo (about 5 minutes)
1. Cloudflare dashboard > **Workers & Pages** > **Create** > **Pages** > **Connect to Git** > choose this repository.
2. Production branch: `ccr-c8e41046-yqojnb` for now (change to `main` once you merge).
3. Framework preset: **Astro**. Build command `npm run build`. Output directory `dist`.
4. Environment variables (Production): `NODE_VERSION` = `22`, `SITE_URL` = `https://loadby.co.uk`, `SECURITY_CONTACT` = `mailto:security@loadby.co.uk`.
5. Save and Deploy. You get `https://<project>.pages.dev` immediately.

## 2. Make the quote form deliver leads
1. Create a free account at resend.com, verify your sending domain, create an API key.
2. In Pages > **Settings > Variables and Secrets** add (Production):
   - `RESEND_API_KEY` (Secret)
   - `TO_EMAIL` = where leads should arrive
   - `FROM_EMAIL` = `Website <quotes@loadby.co.uk>` (must be on the verified domain)
   - `SITE_URL` = your public URL (used for the Origin check)
3. Redeploy. The build detects Cloudflare and points the form at `/api/quote` automatically.
4. **Submit a real test quote** and confirm the email arrives. This path is covered by unit tests but has not been exercised against live Cloudflare/Resend.

## 3. Lock it down
- Cloudflare > Security > **WAF > Rate limiting rules**: `URI Path equals /api/quote`, 5 requests per 10 minutes per IP, action Block.
- Turn on **Always Use HTTPS**, and consider **Bot Fight Mode**.
- 2FA on Cloudflare, GitHub, your registrar and your email.
- Optional: once everything works for a few weeks, add your domain to the HSTS preload list (hstspreload.org). It is hard to reverse, so only do it when you are sure about HTTPS everywhere.

## 4. Custom domain (loadby.co.uk) + Google
1. Register `loadby.co.uk` (Cloudflare Registrar, Namecheap or any UK registrar). If it is not on Cloudflare yet, add the domain to Cloudflare and switch the nameservers at your registrar.
2. Pages > **Custom domains** > add `loadby.co.uk` (the canonical address used in the site) and also `www.loadby.co.uk`. Then add a Cloudflare **Redirect Rule** sending `www.loadby.co.uk/*` to `https://loadby.co.uk/$1` (301) so only one version is indexed.
3. Email: the site shows `hello@loadby.co.uk`. Create it before launch (Cloudflare **Email Routing** forwards it to your own inbox for free; add `security@` the same way). Then verify `loadby.co.uk` in Resend so `quotes@loadby.co.uk` can send.
4. Google Search Console: add the domain property, submit `https://loadby.co.uk/sitemap-index.xml`.
5. Claim your Google Business Profile using the exact name, address and phone in `src/data/site.ts`.
6. Run PageSpeed Insights on the live URL as a final check.

## Local checks before every deploy
```bash
npm ci
npm audit
npm run check      # TypeScript / Astro diagnostics
npm test           # form function tests
npm run build      # also writes _headers and security.txt
npm run audit:site # SEO + security audit of dist/
```
CI (`.github/workflows/ci.yml`) runs the same on every push.
