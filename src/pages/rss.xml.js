import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
  return rss({
    title: `${site.name} moving guides`,
    description: 'Practical UK moving guides: costs, checklists, packing and long-distance moves.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishedAt,
      link: `/blog/${p.id}/`,
    })),
    customData: '<language>en-gb</language>',
  });
}
