// Tells whether storage is set up, without revealing anything stored.
import { configured, load } from './_store.js';

export async function GET() {
  let storage = configured() ? 'configured' : 'missing';
  if (storage === 'configured') {
    try { await load(); storage = 'ok'; } catch (e) { storage = 'error'; }
  }
  return Response.json({ ok: true, storage, login: !!process.env.VAARAM_PASSWORD }, { headers: { 'Cache-Control': 'no-store' } });
}
