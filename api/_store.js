// Family plan storage in Upstash Redis (Vercel Marketplace), over its REST API.
const URL_ = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const KEY = 'vaaram:state';
export const configured = () => !!(URL_() && TOKEN());

async function redis(cmd) {
  const r = await fetch(URL_(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`storage ${r.status}`);
  return (await r.json()).result;
}
export async function load() {
  const raw = await redis(['GET', KEY]);
  return raw ? JSON.parse(raw) : null;
}
export async function store(doc) {
  await redis(['SET', KEY, JSON.stringify(doc)]);
}
