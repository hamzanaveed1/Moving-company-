# Moving Company Website: Master Plan (UK)

> Brand: **Loadby** (loadby.co.uk). Brand name, contact details and claims live in one file: `src/data/site.ts`.

## 1. Goal

Turn Google traffic into **qualified quote requests**. The sales process is:

1. A visitor finds the site on Google (SEO is run by the owner; the site must make that easy).
2. They submit the quote form or call/WhatsApp.
3. The team qualifies the lead (size, date, access, distance, extras).
4. The lead is booked as a client; the move is delivered **city to city**, **city to other cities**, or **within a city**.

Everything on the site serves one of two actions: **Get a free quote** (primary) and **Call / WhatsApp** (secondary).

## 2. Audience and search intent

| Segment | Typical searches | Page that answers it |
|---|---|---|
| Home movers (largest) | "house removals manchester", "removal company near me" | Service + city pages |
| Flat and student movers | "flat removals london", "student moves" | Flat / student / man-and-van pages |
| Long-distance movers | "london to manchester removals" | Route pages + long-distance service |
| Office / SME | "office relocation birmingham" | Office removals page |
| Researchers (top of funnel) | "how much does moving house cost uk", "moving checklist" | Blog + checklist tool |

## 3. Information architecture

```
/                               Home (conversion hub)
/services/                      Service index
  /services/house-removals/
  /services/flat-removals/
  /services/office-removals/
  /services/long-distance-removals/
  /services/local-removals/
  /services/packing-service/
  /services/storage/
  /services/man-and-van/
/locations/                     Where we work
  /locations/removals-{city}/   12 city pages (unique local content, not templates with swapped names)
/routes/                        City-to-city moves
  /routes/{a}-to-{b}-removals/  14 route pages with real distance and drive-time data
/blog/                          Guides, with category pages via tags
  /blog/{slug}/
/moving-checklist/              Interactive checklist (link magnet and lead magnet)
/get-a-quote/                   Multi-step qualifying form
/contact/  /about/  /faq/
/privacy-policy/  /terms/  /cookies/
/404  /sitemap-index.xml  /robots.txt  /rss.xml  /llms.txt
```

**Internal linking:** every service links to relevant cities, routes and blog posts. Every city links to services and nearby routes. Every blog post links to a service and the quote page. Breadcrumbs sit on every inner page.

## 4. SEO plan (what the build handles)

**Technical**
- Static HTML (Astro). No client-side rendering for content, so crawlers see everything.
- Near-zero JavaScript by default. Only the quote form, nav toggle, FAQ (native `<details>`) and checklist use JS.
- Self-hosted fonts, responsive AVIF/WebP images with explicit width/height (no layout shift), lazy loading below the fold.
- One canonical URL per page, trailing-slash consistency, XML sitemap (with `lastmod`), `robots.txt`, RSS, `llms.txt`.
- Security and cache headers file for Cloudflare Pages / Netlify.

**Structured data (JSON-LD)**
- `MovingCompany` / `LocalBusiness` + `WebSite` (site-wide)
- `Service` on service pages, `FAQPage` where FAQs are visible on the page
- `BreadcrumbList` on every inner page
- `Article` / `BlogPosting` on blog posts, with author, dates and image
- Review / AggregateRating markup is **off** until you add real, verifiable reviews (fake or unverifiable reviews breach Google policy and UK CMA rules).

**On-page**
- One `<h1>` per page, with the primary keyword and a logical H2/H3 outline.
- Unique `<title>` (<= 60 chars) and meta description (<= 155 chars) per page, set in data files.
- Open Graph and Twitter cards with a generated 1200x630 image.
- Descriptive internal anchor text; alt text on all images.

**Local SEO**
- Each city page has genuinely local content (neighbourhoods, property types, parking and access issues, nearby routes). This avoids the "doorway page" penalty.
- Remove any city you do not actually serve. Do not publish pages for areas you cannot cover.
- NAP (name, address, phone) is held in one config and rendered consistently. Match it exactly in your Google Business Profile.

**Content**
- Six launch articles targeting high-intent informational queries, each with an image and internal links to money pages. See `docs/CONTENT-ROADMAP.md` for the next 12.

## 5. Conversion and lead-qualification design

- Sticky header with phone and "Get a quote" button; mobile sticky bottom bar (Call / WhatsApp / Quote).
- Quote form has 4 short steps and captures what is needed to qualify before a call:
  1. Move type (house, flat, office, student, storage only) and property size
  2. From and to postcode, floor and lift or parking access at each end
  3. Preferred date, flexibility, packing and storage needs
  4. Name, phone, email, consent
- Spam protection: honeypot field and time-to-submit check. No third-party tracker needed.
- Posts to a configurable endpoint (`PUBLIC_FORM_ENDPOINT`), with a mailto fallback so a lead is never silently lost.
- Trust blocks use only claims that are true. Insurance, trade-body membership and review numbers are **config values that default to hidden** until you fill them in.

## 6. Design system

- **Look:** confident and friendly. Deep navy, warm amber accent, soft off-white backgrounds, generous whitespace, large rounded cards.
- **Type:** Manrope (one family for headings and body), self-hosted, preloaded.
- **Accessibility:** WCAG 2.2 AA contrast, visible focus rings, skip link, semantic landmarks, reduced-motion support, 44px tap targets.
- **Mobile first.** Most moving searches happen on phones.

## 7. UK compliance

- Privacy policy and cookie notice (UK GDPR / PECR). No analytics cookies by default; add consent before enabling GA4.
- Company number, registered address and VAT number in the footer, driven by config.
- Terms page template. **Have a solicitor review the legal pages before launch.**

## 8. Launch checklist (owner)

1. Set `site.url`, brand name, phone, email, address in `src/data/site.ts`.
2. Set `PUBLIC_FORM_ENDPOINT` (see README) and test a submission.
3. Remove cities and routes you do not serve; edit prices and claims to match reality.
4. Replace illustrated images with your own van, crew and job photos when available.
5. Verify in Google Search Console and submit `sitemap-index.xml`; claim the Google Business Profile.
6. Add real reviews to `src/data/reviews.ts` (this enables review sections and schema).

## 9. Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation: stack, design system, layout, SEO components, schema | Done |
| 2 | Core pages: home, services (8), quote, contact, about, FAQ, legal | Done |
| 3 | Local SEO: 12 city pages, 14 route pages | Done |
| 4 | Content: 6 blog posts with images, RSS, checklist tool | Done |
| 4b | Hardening: strict CSP/headers, server-side form function, security.txt, CI, Dependabot, accessibility fixes, AVIF images, AdSense-ready layer (off by default) | Done |
| 5 | Next: real photos/reviews, GA4 + Search Console, more blog posts monthly, backlinks and GBP | Owner / next sprint |
