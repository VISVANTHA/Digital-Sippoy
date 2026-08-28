# Digital-Sippoy — DS-051

**Architecture note:** Monolith (single deployable unit with no internal service or module boundaries; a distinct label from the Full-stack, Microservices, and Event-driven notes used elsewhere in this matrix, though the underlying code is identical).

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

(Note: an earlier commit on this branch was mistakenly recorded as a failed install. That failure was caused by a local tooling collision during matrix generation — a concurrent process deleting files out from under this branch's Yarn cache extraction mid-install — not a genuine incompatibility. Re-run with a clean `yarn install` + `yarn build` succeeds.)
