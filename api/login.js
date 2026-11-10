import { checkLogin, makeSession, cookie, SESSION_SECONDS } from './_auth.js';

export async function POST(request) {
  const form = await request.formData();
  if (!checkLogin(form.get('username'), form.get('password'))) {
    await new Promise(r => setTimeout(r, 600)); // slow down guessing
    return new Response(null, { status: 303, headers: { Location: '/login.html?e=1', 'Cache-Control': 'no-store' } });
  }
  return new Response(null, {
    status: 303,
    headers: { Location: '/', 'Set-Cookie': cookie(await makeSession(), SESSION_SECONDS), 'Cache-Control': 'no-store' },
  });
}
