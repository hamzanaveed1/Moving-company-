import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString() ?? 'https://www.example.co.uk/';
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${new URL('sitemap-index.xml', base)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
