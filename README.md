# Digital-Sippoy — DS-055

**Architecture note:** Monolith (single deployable unit with no internal service or module boundaries; a distinct label from the Full-stack, Microservices, and Event-driven notes used elsewhere in this matrix, though the underlying code is identical).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | bun |
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

Builds successfully with `bun` + Turbopack on Node.js 20.x.
