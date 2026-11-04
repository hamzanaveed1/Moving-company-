// Vercel Function: POST /api/contact. Logic lives in server/contact-handler.js (shared with Cloudflare).
// Reads RESEND_API_KEY, TO_EMAIL, FROM_EMAIL and SITE_URL from Vercel Environment Variables.
import { handleContact, methodNotAllowed, clientIp } from '../server/contact-handler.js';

export function POST(request) {
  return handleContact(request, process.env, clientIp(request));
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
