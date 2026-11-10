import { cookie } from './_auth.js';

const out = () => new Response(null, {
  status: 303,
  headers: { Location: '/login.html?out=1', 'Set-Cookie': cookie('', 0), 'Cache-Control': 'no-store' },
});
export const GET = out;
export const POST = out;
