import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in your host's env vars (or edit the fallback) before launch.
const site = process.env.SITE_URL || 'https://movingpal.co.uk';

// On Cloudflare Pages and Vercel the bundled /api/quote function handles the form, so wire it up automatically.
if ((process.env.CF_PAGES || process.env.VERCEL) && !process.env.PUBLIC_FORM_ENDPOINT) process.env.PUBLIC_FORM_ENDPOINT = '/api/quote';

/** Wrap markdown tables in a keyboard-focusable scroll container (WCAG 2.1.1). */
function rehypeScrollTables() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0, role: 'group', ariaLabel: 'Scrollable table' }, children: [child] };
      }
      walk(child);
      return child;
    });
  };
  return (tree) => walk(tree);
}

// Blog posts carry real dates; other pages omit lastmod rather than claim a false one.
const postDates = new Map();
try {
  const { readdirSync, readFileSync } = await import('node:fs');
  for (const f of readdirSync('./src/content/blog')) {
    const fm = readFileSync(`./src/content/blog/${f}`, 'utf8').split('---')[1] ?? '';
    const upd = fm.match(/updatedAt:\s*(\S+)/)?.[1] ?? fm.match(/publishedAt:\s*(\S+)/)?.[1];
    if (upd) postDates.set(`/blog/${f.replace(/\.md$/, '')}/`, new Date(upd).toISOString());
  }
} catch {}

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Never inline CSS: keeps the Content-Security-Policy strict (style-src 'self') and the CSS cacheable.
    inlineStylesheets: 'never',
  },
  compressHTML: true,
  markdown: { rehypePlugins: [rehypeScrollTables] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    // Never inline scripts into HTML: keeps script-src 'self' (no 'unsafe-inline').
    build: { assetsInlineLimit: () => false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/'),
      serialize(item) {
        const d = postDates.get(new URL(item.url).pathname);
        if (d) item.lastmod = d;
        return item;
      },
    }),
  ],
});
