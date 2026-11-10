// Password gate for the whole site (HTTP Basic Auth).
// Username and password come from the project's environment variables.
export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const user = process.env.VAARAM_USER || 'family';
  const pass = process.env.VAARAM_PASSWORD;
  const auth = request.headers.get('authorization') || '';
  if (pass && auth.startsWith('Basic ')) {
    try {
      const [u, ...rest] = atob(auth.slice(6)).split(':');
      if (u === user && rest.join(':') === pass) {
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
      }
    } catch (e) {}
  }
  return new Response('Please sign in to open Vaaram.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Vaaram", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
}
