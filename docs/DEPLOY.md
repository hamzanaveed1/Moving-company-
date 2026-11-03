# Deploying Loadby

Primary target: **Vercel**. Cloudflare Pages is supported as an alternative (see the end). Both use the same code: the build writes the right headers for each, and the quote form handler (`server/quote-handler.js`) is wrapped for each host (`api/quote.js` for Vercel, `functions/api/quote.js` for Cloudflare).

> **Plan warning (important).** Vercel's free **Hobby** plan is restricted to non-commercial, personal use under Vercel's terms. A business lead-generation site, and especially one that may show ads, belongs on a paid **Pro** plan. Check Vercel's current terms and pricing before launch. Cloudflare Pages' free plan has no such restriction if you want a free option.

## 1. Import the project (about 5 minutes)
1. vercel.com > **Add New > Project** > import the GitHub repo `hamzanaveed1/Moving-company-` (authorise the Vercel GitHub app when asked).
2. Framework preset: **Astro** (detected). Leave build and output settings on defaults. Node is pinned to 22.x by `package.json`.
3. **Settings > Git > Production Branch**: set to `ccr-c8e41046-yqojnb` for now, and change it to `main` once you merge.
4. Add the environment variables below *before* the first deploy, then deploy. You get `https://<project>.vercel.app` straight away.

## 2. Environment variables (Settings > Environment Variables, Production)
| Variable | Value |
|---|---|
| `SITE_URL` | `https://loadby.co.uk` |
| `SECURITY_CONTACT` | `mailto:security@loadby.co.uk` |
| `RESEND_API_KEY` | from resend.com (mark as **Sensitive**) |
| `TO_EMAIL` | where quote requests should arrive |
| `FROM_EMAIL` | `Loadby <quotes@loadby.co.uk>` (domain must be verified in Resend) |

The build detects Vercel and points the quote form at `/api/quote` automatically. After changing variables, **redeploy** so the build picks them up.

## 3. Make leads actually arrive
1. Create a Resend account, verify `loadby.co.uk` (it gives you DNS records to add), create an API key.
2. Redeploy, then **submit a real test quote** and confirm the email arrives. The handler is covered by unit tests and Vercel's own CLI built the function successfully, but it has not been exercised against live Vercel and Resend.

## 4. Domain (loadby.co.uk)
1. Register `loadby.co.uk` at any registrar.
2. Vercel > **Settings > Domains**: add `loadby.co.uk` and `www.loadby.co.uk`. Vercel shows the exact DNS records to create at your registrar (typically an A record for the apex and a CNAME for `www`). Use the values Vercel displays.
3. Set `www.loadby.co.uk` to **redirect to `loadby.co.uk`** (a Redirect option next to the domain) so only one version is indexed.
4. Email: `hello@loadby.co.uk` is shown on the site, so make it work (your registrar's email forwarding, Google Workspace, or Cloudflare Email Routing if DNS is on Cloudflare). Add `security@` too.
5. Google Search Console: add the domain property, submit `https://loadby.co.uk/sitemap-index.xml`. Claim your Google Business Profile using the exact name, address and phone from `src/data/site.ts`.

## 5. Lock it down
- Vercel > **Firewall**: add a rate-limit rule for `/api/quote` (for example 5 requests per 10 minutes per IP). Availability of rules depends on your plan. The handler also has a best-effort per-instance throttle as a backstop.
- Turn on 2FA for Vercel, GitHub, your registrar and your email.
- Preview deployments are served with `noindex` by Vercel, so test builds will not appear in Google.

## 6. Headers live in `vercel.json`
Vercel does not read the `_headers` file, so the security headers (CSP, HSTS and so on) are in the committed `vercel.json`, generated from the same source as `_headers` by `scripts/postbuild.mjs`.
- CI fails if it drifts: `npm run vercel:check`.
- If you enable **AdSense** or an **external form endpoint**, regenerate it with the same variables and commit:
  ```bash
  PUBLIC_ADSENSE_CLIENT=ca-pub-... npm run vercel:config
  git add vercel.json && git commit -m "Update CSP for AdSense"
  ```
  A Vercel build prints a loud warning if `vercel.json` does not match what that build needs.

## Local checks before every deploy
```bash
npm ci
npm audit
npm run check        # TypeScript / Astro diagnostics
npm test             # form handler tests
npm run build        # also writes _headers, security.txt
npm run audit:site   # SEO + security audit of dist/
npm run vercel:check # vercel.json in sync
```
CI (`.github/workflows/ci.yml`) runs the same on every push.

---

## Alternative: Cloudflare Pages
Free plan, global CDN, supports commercial use. Connect the repo (Workers & Pages > Create > Pages), framework Astro, build `npm run build`, output `dist`, env var `NODE_VERSION=22`. Add the same variables as above. The build detects Cloudflare, uses `dist/_headers` and routes the form to `functions/api/quote.js`. Add a WAF rate-limiting rule for `/api/quote`. Domain: add `loadby.co.uk` and `www` under Custom domains, with a redirect rule from `www` to the apex.
