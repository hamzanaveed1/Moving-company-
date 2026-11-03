// Vercel Function: POST /api/quote. Logic lives in server/quote-handler.js (shared with Cloudflare).
// Reads RESEND_API_KEY, TO_EMAIL, FROM_EMAIL and SITE_URL from Vercel Environment Variables.
import { handleQuote, methodNotAllowed, clientIp } from '../server/quote-handler.js';

export function POST(request) {
  return handleQuote(request, process.env, clientIp(request));
}

// Any other method gets a clean 405 instead of a platform default.
export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
