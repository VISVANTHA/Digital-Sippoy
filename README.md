# Digital-Sippoy — DS-060

**Architecture note:** Monolith (single deployable unit with no internal service or module boundaries; a distinct label from the Full-stack, Microservices, and Event-driven notes used elsewhere in this matrix, though the underlying code is identical).

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
