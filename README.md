# Digital-Sippoy — DS-035

**Architecture note:** Microservices — this app represents one service in a larger system, so the app itself is intentionally kept simple (a single "items" resource, no cross-service orchestration implemented in this fixture).

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | yarn |
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

Builds successfully with `yarn` + Webpack on Node.js 20.x.
