/**
 * REAL customer reviews only. While this array is empty the site shows no review
 * section and outputs no review/rating schema. That is deliberate: fabricated or
 * unverifiable reviews break Google's structured-data policy and UK CMA rules.
 */
export interface Review {
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string; // YYYY-MM-DD
  source?: string; // e.g. "Google", "Trustpilot"
}

export const reviews: Review[] = [];
