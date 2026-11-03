import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { services } from '../data/services';
import { locations } from '../data/locations';
import { routes } from '../data/routes';

export const GET: APIRoute = ({ site: base }) => {
  const u = (p: string) => new URL(p, base ?? site.url).toString();
  const body = `# ${site.name}

> ${site.tagline}. UK removals company for house, flat and office moves, local moves and long-distance city-to-city relocations.

## Services
${services.map((s) => `- [${s.name}](${u(`/services/${s.slug}/`)}): ${s.summary}`).join('\n')}

## Locations
${locations.map((l) => `- [Removals ${l.name}](${u(`/locations/removals-${l.slug}/`)})`).join('\n')}

## Routes
${routes.map((r) => `- [${r.from} to ${r.to}](${u(`/routes/${r.slug}/`)}): ~${r.miles} miles, ${r.drive}`).join('\n')}

## Key pages
- [Get a quote](${u('/get-a-quote/')})
- [Moving guides](${u('/blog/')})
- [FAQs](${u('/faq/')})
- [Contact](${u('/contact/')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
