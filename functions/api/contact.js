// Cloudflare Pages Function: POST /api/contact. Logic lives in server/contact-handler.js (shared with Vercel).
import { handleContact, methodNotAllowed, clientIp } from '../../server/contact-handler.js';

export const onRequestPost = ({ request, env }) => handleContact(request, env, clientIp(request));
export const onRequest = () => methodNotAllowed();
