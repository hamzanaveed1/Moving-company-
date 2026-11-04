# MovingPal: UK moving company website (movingpal.co.uk)

Fast, SEO-first lead-generation site for a UK removals company. Built with [Astro](https://astro.build) (static HTML, almost no JavaScript).

- Plan and strategy: [`docs/PLAN.md`](docs/PLAN.md)
- Content plan: [`docs/CONTENT-ROADMAP.md`](docs/CONTENT-ROADMAP.md)

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist (61 pages)
npm run preview
npm test           # form function tests
npm run audit:site # SEO + security audit of dist/ (after build)
npm run vercel:config # regenerate vercel.json headers (commit the result)
npm run a11y       # axe-core scan (needs preview running + Playwright)
npm run images     # regenerate illustrated images (blog covers, hero, social card, logo)
```

Needs Node 22+.

## What is on the site

| Section | Pages |
|---|---|
| Home | conversion hub: animated hero scene (a van drives from A to B, cycling through your real routes), quick-quote, services, scroll-driven "how it works" journey, interactive UK route map, guides, FAQ |
| Services | index + 8 service pages (house, flat, office, long-distance, local, packing, storage, man and van) |
| Locations | index + 12 city pages with local access/parking/property content |
| Routes | index + 14 city-to-city route pages (distance, drive time, plan) |
| Blog | index, category pages, 6 articles with cover images, table of contents, RSS |
| Tools | multi-step quote form, contact form (`/contact/`), interactive moving checklist |
| Other | about, contact, FAQ, privacy, terms, cookies, thank-you, 404, `sitemap-index.xml`, `robots.txt`, `rss.xml`, `llms.txt` |

## Before launch: edit these

1. **`src/data/site.ts`**: brand name, email (no public phone number), address, hours, company/VAT number, insurance/trade-body claims. Empty trust fields are hidden, not shown blank.
2. **Domain**: set `SITE_URL` in your host's environment variables (see `.env.example`). Canonicals, sitemap and social tags use it.
3. **Lead delivery**: on Vercel or Cloudflare Pages set `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`, `SITE_URL` (see `docs/DEPLOY.md`). Elsewhere set `PUBLIC_FORM_ENDPOINT`. With no endpoint the form falls back to the visitor's email app. **Test a real submission before you spend on ads.**
4. **Claims review**: service pages describe things like tail-lift vans, storage security, same-day delivery and quote turnaround. Check every operational statement is true for your business and edit `src/data/services.ts`, `locations.ts` and `routes.ts`. Remove cities and routes you do not serve.
5. **Prices**: the cost guide (`src/content/blog/how-much-does-moving-house-cost-uk.md`) uses indicative market ranges. Replace with figures that match your pricing.
6. **Legal pages**: privacy, terms and cookies are templates. Get them reviewed. Add a consent banner before adding GA4 or ad pixels.
7. **Reviews**: add real reviews to `src/data/reviews.ts`. Review sections and rating schema only appear when it has entries.
8. **Images**: the blog/hero images are original illustrations (no licensing issues). Swap in real photos by replacing files in `src/assets/blog/` and `src/assets/img/`.
9. **Logo**: the approved parcel-with-arrow mark. The original AI-generated image is kept in `docs/brand/logo-source.jpg`; the site uses a clean vector trace of it (`scripts/logo-mark.json`), which `npm run images` turns into `public/logo-mark.svg`, `public/logo-mark-light.svg` (for dark backgrounds), the favicon, app icons, schema logo, social card and the vans in the illustrations. The header and footer use `src/components/Logo.astro` (mark + "MovingPal" wordmark in Manrope). To replace the logo, re-trace the new artwork into `scripts/logo-mark.json` and run `npm run images`.

## Design system

Minimal and consistent by rule (documented at the top of `src/styles/global.css`): one cream page with a single white alternate, dark only for the closing call-to-action and footer, flat hairline cards, left-aligned headings, one section rhythm. Scrolling adds a soft header shadow and a gentle reveal that only starts once the visitor scrolls (so crawlers, accessibility tools and reduced-motion users always see the full page).

## Light and dark mode

- White light theme using the logo's navy; dark theme is a graphite ink (not navy) where amber becomes the main accent. A glass layer (frosted panels, amber-glass tags and selections, an ambient glow behind the page) is driven by tokens, subtle in light and richer in dark, with fallbacks for `prefers-reduced-transparency` and browsers without `backdrop-filter`. A sun/moon button in the header switches, remembers the choice, and (until chosen) follows the visitor's system setting live.
- `public/theme-init.js` applies the theme before first paint (no white flash); `src/scripts/theme.ts` powers the button. Components use semantic tokens (`--bg`, `--surface`, `--heading`, `--sel` ...) defined for both themes at the top of `src/styles/global.css`. To change a colour, edit the token, not the component. The dark token block appears twice on purpose (explicit choice, and system-preference fallback); keep them identical.
- The hero scene becomes a calm dusk (small soft moon, warm horizon, glowing street lamps, the van's headlight beam), the logo swaps to its cream version, and the map and journey recolour automatically.
- Verified with axe in both themes (0 contrast violations).

## Motion and interactivity (home page)

- **Hero scene** (`src/components/HeroScene.astro`, `src/styles/home.css`): an inline SVG on one shared 12-second timeline, so van, skyline, road, wheels and route line stay in step. Each loop shows the next real route from `src/data/routes.ts`.
- **Journey** (`Journey.astro`): a cinematic, pinned "how it works". The section sticks to the screen for about two screens of scrolling while a van glides (eased, with turning wheels, speed lines and headlight glow) along a road through the four stops to a "home" marker; phones get a vertical road and a top-down van. Not pinned with reduced motion, on short landscape screens, or without JavaScript.
- **Route map** (`RouteMap.astro`): generated from the cities and routes in `src/data`; hover or tap a city to highlight its routes.
- **Accessibility and battery**: a visible Pause button (WCAG 2.2.2), animation stops automatically when off-screen, and with "reduce motion" enabled everything is a still image. Scripts: `src/scripts/home.ts`.

## Security, speed and accessibility

- **Strict CSP and headers** (`dist/_headers`, generated by `scripts/postbuild.mjs`): `script-src 'self'`, no inline scripts, `frame-ancestors 'none'`, HSTS, nosniff, Permissions-Policy, COOP. No third-party scripts by default.
- **Server-side form handling** (`server/form-core.js`, used by `/api/quote` and `/api/contact` on Vercel and Cloudflare): origin check, size cap, validation, sanitising, plain-text email, throttle, honeypot. 17 unit tests (`npm test`).
- **Measured**: Lighthouse 100/100/100/100 (performance, accessibility, best practices, SEO) on home, service, blog and quote pages; axe-core reports 0 WCAG 2.2 AA violations across all page templates (`npm run a11y`); `npm audit` shows 0 vulnerabilities.
- **Audit**: `npm run audit:site` fails the build on SEO or security regressions. Runs in CI.
- See `SECURITY.md`, `docs/DEPLOY.md` and `docs/ADSENSE.md`.

## Deploy

Full steps in [`docs/DEPLOY.md`](docs/DEPLOY.md). Short version:

Vercel is the primary target and Cloudflare Pages is supported too. The quote form handler runs on both. Any static host works if you use an external form endpoint. Note that Vercel's free Hobby plan is for non-commercial use only.

## SEO built in

Static HTML, canonical URLs, unique titles and descriptions, one H1 per page, breadcrumbs, XML sitemap, `robots.txt`, RSS, Open Graph/Twitter cards, and JSON-LD for `MovingCompany`/`LocalBusiness`, `WebSite`, `Service`, `FAQPage`, `BreadcrumbList` and `BlogPosting`. Responsive WebP images with explicit dimensions, self-hosted fonts, no render-blocking third parties.

## Structure

```
src/data/        business info, services, locations, routes, FAQs, reviews
src/content/blog markdown articles (frontmatter validated in src/content.config.ts)
src/pages/       routes
src/components/  Header, Footer, QuoteForm, Icon, cards...
src/layouts/     BaseLayout (all SEO tags + JSON-LD)
src/styles/      global.css design system
scripts/         image generator
```

## Analytics (Vercel Web Analytics)

The site loads `@vercel/analytics` only on Vercel builds (`VERCEL=1`), from our own bundle, so the strict CSP is unchanged. It is cookieless and skips visitors who send Do Not Track. Turn it on once in the Vercel dashboard: Project > Analytics > Enable. Cookies and privacy pages already describe it.
