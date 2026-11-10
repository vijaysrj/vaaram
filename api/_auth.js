// Shared login helpers: a signed, expiring session cookie (no third-party packages).
export const COOKIE = 'vaaram_s';
const DAYS = 90;
const enc = new TextEncoder();

function secret() {
  return process.env.VAARAM_SECRET || (process.env.VAARAM_PASSWORD || '') + '|vaaram';
}
async function sign(text) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
export async function makeSession() {
  const exp = Date.now() + DAYS * 864e5;
  return `${exp}.${await sign(String(exp))}`;
}
export async function validSession(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m || !process.env.VAARAM_PASSWORD) return false;
  const [exp, sig] = decodeURIComponent(m[1]).split('.');
  if (!exp || !sig || !(+exp > Date.now())) return false;
  return same(sig, await sign(exp));
}
export function checkLogin(user, pass) {
  const u = process.env.VAARAM_USER || 'family', p = process.env.VAARAM_PASSWORD;
  return !!p && same(String(user || '').trim().toLowerCase(), u.toLowerCase()) && same(String(pass || ''), p);
}
export function cookie(value, maxAge) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export const SESSION_SECONDS = DAYS * 86400;
