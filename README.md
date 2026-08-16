# Digital-Sippoy — DS-008

**Architecture note:** Microservices — this app represents one service in a larger system, so the app itself is intentionally kept simple (a single "items" resource, no cross-service orchestration implemented in this fixture).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | yarn |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

- `GET /api/items`, `POST /api/items` — `app/api/items/route.ts`
- List page — `app/page.tsx` (Server Component)
- Create form — `app/items-form.tsx` (Client Component)
- Store — `lib/db.ts` reading/writing `data/items.json`

## Build status

Builds successfully with `yarn` (Berry) + Turbopack on Node.js 20.x.

(Note: an earlier commit on this branch was mistakenly recorded as a failed build (`EPERM: operation not permitted, readlink ... node_modules\next\package.json`). That was caused by a local tooling collision during matrix generation — a concurrent process touching this branch's `node_modules` mid-build — not a genuine incompatibility. Re-run with a clean `yarn install` + `yarn build` succeeds.)
