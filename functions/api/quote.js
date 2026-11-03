// Cloudflare Pages Function: POST /api/quote. Logic lives in server/quote-handler.js (shared with Vercel).
import { handleQuote, methodNotAllowed, clientIp } from '../../server/quote-handler.js';

export const onRequestPost = ({ request, env }) => handleQuote(request, env, clientIp(request));
export const onRequest = () => methodNotAllowed();
