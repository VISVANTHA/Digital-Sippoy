# Digital-Sippoy — DS-006

**Architecture note:** Event-driven — this app represents one participant in a larger event-driven system (e.g. it would react to and emit domain events elsewhere in the platform); the app itself is intentionally kept simple.

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | npm |
| Router | Pages Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

- `GET /api/items`, `POST /api/items` — `pages/api/items.ts`
- List page — `pages/index.tsx` (`getServerSideProps`)
- Create form — `components/items-form.tsx` (Client Component, `useRouter`)
- Store — `lib/db.ts` reading/writing `data/items.json`

## Build status

Builds successfully with `npm` + Turbopack on Node.js 20.x.

(Note: an earlier commit on this branch was mistakenly recorded as a failed build. That failure was caused by a local tooling collision during matrix generation — a concurrent `rm -rf node_modules` mid-install from an unrelated process — not a genuine incompatibility. Re-run with a clean `npm install` + `npm run build` succeeds, confirming Turbopack + Pages Router works fine on Next.js 15.5.12.)
