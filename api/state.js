// GET: the family's saved plan. PUT: replace it (last write wins).
import { configured, load, store } from './_store.js';

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  if (!configured()) return json({ error: 'no_storage' }, 503);
  try {
    const doc = await load();
    return json(doc || { rev: 0, data: null });
  } catch (e) {
    console.error(e);
    return json({ error: 'storage_failed' }, 502);
  }
}

export async function PUT(request) {
  if (!configured()) return json({ error: 'no_storage' }, 503);
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_json' }, 400); }
  if (!body || typeof body.data !== 'object' || body.data === null) return json({ error: 'bad_request' }, 400);
  const text = JSON.stringify(body.data);
  if (text.length > 900000) return json({ error: 'too_large' }, 413);
  try {
    const doc = { rev: Date.now(), by: String(body.by || '').slice(0, 40), data: body.data };
    await store(doc);
    return json({ rev: doc.rev });
  } catch (e) {
    console.error(e);
    return json({ error: 'storage_failed' }, 502);
  }
}
