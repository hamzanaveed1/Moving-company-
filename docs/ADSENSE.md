# Google AdSense: readiness and how to switch it on

**Status: built in, switched OFF.** Nothing from Google loads until you set `PUBLIC_ADSENSE_CLIENT`.

## Read this first: should you run ads at all?
This is a lead-generation site. One quote request is worth far more than the pennies an ad click earns, and ads can send a visitor to a competitor. That is why the integration:
- loads **only on blog articles**, never on the quote form, contact, service, city or route pages;
- reserves space (no layout shift) and labels every unit "Advertisement".

A sensible plan: build traffic and leads first, then enable ads on the blog if the numbers justify it. Neither approval nor earnings can be guaranteed. Google decides on approval, and ranking is up to Google as well.

## What AdSense reviewers look for, and where we stand
| Requirement | Status |
|---|---|
| Your own domain (AdSense does not approve free `*.pages.dev` / `*.netlify.app` subdomains) | **You:** buy a domain and attach it |
| HTTPS | Done (HSTS) |
| Original, useful content | 6 solid articles + 8 services + 12 cities + 14 routes. **Aim for 25+ articles** before applying; thin sites are the top rejection reason |
| About, Contact, Privacy, Terms pages | Done |
| Clear navigation, mobile-friendly, fast, accessible | Done (Lighthouse 100 / axe 0 violations) |
| No placeholder text or fake details | **You:** replace the placeholder phone `0800 000 0000`, `hello@loadby.co.uk` (create the mailbox) and the demo address in `src/data/site.ts` first |
| Privacy policy covers advertising/cookies | Done automatically when ads are enabled |
| Consent for UK/EEA visitors | **You:** create Google's free consent message (below). A Google-certified CMP is required there |
| `ads.txt` | Generated at build when `PUBLIC_ADSENSE_CLIENT` is set |

## Switch on, step by step
1. Apply at adsense.google.com with your live domain. Wait for approval.
2. In AdSense go to **Privacy & messaging** and publish a **European regulations (GDPR/UK) message**. Choose "Consent / reject" so visitors can decline personalised ads.
3. In your host's environment variables set:
   - `PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` (your publisher ID)
   - optional `PUBLIC_ADSENSE_SLOT=...` (a manual in-article ad unit ID). Without it, Google "auto ads" place ads and you control them in the AdSense console. Exclude any page you do not want ads on.
4. **On Vercel, regenerate `vercel.json`** with the same variable and commit it (`PUBLIC_ADSENSE_CLIENT=ca-pub-... npm run vercel:config`), because Vercel reads headers from that file. Then redeploy. The build then: adds the loader to blog articles, writes `/ads.txt`, and **relaxes the Content-Security-Policy for Google** (documented in `scripts/postbuild.mjs`).
5. Open an article in a browser with DevTools open and confirm there are no CSP errors. This relaxation was written to Google's published guidance but could not be tested against live ads from here.
6. Check `https://loadby.co.uk/ads.txt` shows `google.com, pub-..., DIRECT, f08c47fec0942fa0`.

## Rules to keep your account safe
- Never click your own ads or ask others to.
- Do not place ads near the quote form, or in a way that looks like site navigation.
- Keep content original and accurate. Do not publish scraped or AI-spun filler to hit a post count.

## Security trade-off
With ads on, the CSP must allow `'unsafe-inline'` and `'unsafe-eval'` scripts (Google ad code needs them). Because ads load only on blog articles and the rest of the site has no user-input reflection or accounts, the risk is contained, but it is weaker than the default strict policy. Turn ads off by clearing the variable and redeploying.
