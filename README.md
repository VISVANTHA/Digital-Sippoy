# Digital-Sippoy — DS-020

**Architecture note:** Microservices — a real split, not just a label. This branch is the `web`
gateway (UI, login, session auth); [`items-service/`](items-service/) is a separate Node/Express
service owning the actual `data/items.json` store, called over HTTP. See
[Microservices split](#microservices-split) below.

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | bun |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.24 |

## Fixture

- `GET /api/items`, `POST /api/items` — `app/api/items/route.ts`, session-protected (401 without a
  valid login), proxies to `items-service` over HTTP (502 if it's unreachable)
- List page — `app/page.tsx` (Server Component, redirects to `/login` if unauthenticated)
- Create form — `app/items-form.tsx` (Client Component)
- `lib/db.ts` — a thin HTTP client for `items-service` (`ITEMS_SERVICE_URL`, defaults to
  `http://localhost:4000`); it no longer touches the filesystem itself
- Validation — `lib/validate.ts` (zod: required, non-empty, 200-char max), also enforced
  independently by `items-service` itself (defense in depth across the service boundary)

## Microservices split

| | `web` (this branch) | `items-service/` |
|---|---|---|
| Owns | UI, login, session auth | `data/items.json`, the actual CRUD logic |
| Talks to | `items-service` over HTTP | nothing (leaf service) |
| Auth | Checks the user's session | None — trusts the gateway's network (see `COMPLIANCE.md`) |
| Built | Per-branch (bundler/pkg-manager/router vary) | Once, uniformly, on npm across all 16 MS branches |

Run both together: `docker-compose.yml` at the repo root, or locally —
`cd items-service && npm run dev` (port 4000), then `ITEMS_SERVICE_URL=http://localhost:4000 npm run dev`
here (port 3000). Verified end-to-end as two real running processes: unauthenticated `/` redirects
to `/login`, unauthenticated `/api/items` returns 401, a real login sets a session cookie, and an
authenticated POST here is confirmed to actually land in `items-service`'s own store by querying it
directly.

## Auth

Real session auth via NextAuth.js (Credentials provider, JWT sessions), added as Phase 6 of the
[quality remediation plan](https://github.com/Mohammed-shihaf/Digital-Sippoy) after this fixture's
API was flagged as intentionally open with no authentication.

- Sign in at `/login`. Default demo credentials: `admin` / `changeme` (override via `DEMO_USERNAME`
  / `DEMO_PASSWORD` env vars).
- Set `NEXTAUTH_SECRET` in any real deployment — a documented, insecure-by-design default is used
  otherwise so the fixture keeps building and running out of the box, matching every other branch
  in this repo.
- `lib/require-session.ts` checks the session via `next-auth/jwt`'s `getToken()` rather than
  `getServerSession()`, so the API route handlers stay directly callable from tests the same way
  Phase 3 already called them.

See [COMPLIANCE.md](COMPLIANCE.md) for the full security/compliance mapping.

## Quality tooling (remediation plan Phases 1–6)

- **Lint** — `npm run lint` (ESLint flat config, `eslint-plugin-security`, a project rule barring
  filesystem access outside `lib/db.ts`). `lib/lint-fixtures.ts` is a deliberate, labeled fixture
  (unused var, misnamed export, over-nesting, a style violation) so the lint metrics have a real,
  non-blocking finding to report — same spirit as the duplication fixture below.
- **Duplication** — `npm run dup` (jscpd, config loaded explicitly via `--config jscpd.json`).
  `items-service/` is excluded from this branch's scan (it has its own `npm run dup`); the
  intentional clone fixture (`items-service/src/db-clone.ts`) lives there now, alongside the file
  it's paired with.
- **Tests** — `npm test` (mocha + ts-node) / `npm run test:coverage` (nyc,
  `nyc-mocha/coverage-summary.json`) / `npm run test:coverage:gate` (CI threshold gate)
- **Mutation testing** — `npm run mutation` (StrykerJS, nightly in CI — see
  `.github/workflows/mutation.yml`)
- **CI** — `.github/workflows/ci.yml`, `codeql.yml`, `semgrep.yml`; `.github/dependabot.yml`

## Build status

Builds successfully with `npm` + Turbopack on Node.js 20.x. Docker/`docker-compose.yml` follow
standard patterns but weren't verified with an actual `docker compose up` in the session that added
them (Docker daemon unavailable); the `npm run build`/`npm run start` commands they invoke were
verified directly, and the full two-service flow was verified as two plain `node` processes.
