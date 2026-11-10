# Vaaram

Weekly family meal planner with protein and fiber goals and a grocery list.

- `index.html` – the app (single page, offline service worker in `sw.js`).
- `login.html` + `api/login.js` / `api/logout.js` – sign-in page and a signed session cookie (90 days).
- `middleware.js` – every page and API except the login page needs a valid session.
- `api/state.js` – the family's shared plan, stored in Upstash Redis (key `vaaram:state`, last write wins). `api/health.js` reports whether storage is connected.

Environment variables (Vercel project settings):

| Name | Purpose |
| --- | --- |
| `VAARAM_USER` | Login username |
| `VAARAM_PASSWORD` | Login password |
| `VAARAM_SECRET` | Signs session cookies; changing it signs everyone out |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Added automatically when an Upstash Redis database is connected to the project |

Redeploy after changing any of them.
