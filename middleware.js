// Everything except the login page needs a valid session cookie.
import { validSession } from './api/_auth.js';

export const config = { matcher: '/(.*)' };
const OPEN = new Set(['/login.html', '/api/login', '/api/health', '/icon.svg', '/manifest.webmanifest']);

export default async function middleware(request) {
  const path = new URL(request.url).pathname;
  if (OPEN.has(path) || await validSession(request)) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }
  if (path.startsWith('/api/')) {
    return Response.json({ error: 'signed_out' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  return new Response(null, { status: 302, headers: { Location: '/login.html', 'Cache-Control': 'no-store' } });
}
