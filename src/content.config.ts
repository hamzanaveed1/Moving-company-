import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70),
      description: z.string().max(165),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      category: z.enum(['Costs', 'Planning', 'Packing', 'Long distance', 'Guides']),
      image: image(),
      imageAlt: z.string(),
      readingTime: z.number(),
      related: z.array(z.string()).default([]),
      cta: z.object({ label: z.string(), href: z.string() }).optional(),
    }),
});

export const collections = { blog };
