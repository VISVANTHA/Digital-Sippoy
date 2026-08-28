# Digital-Sippoy — DS-050

**Architecture note:** Monolith — a single deployable unit with no internal service or module
boundaries. Unlike the Microservices-labelled branches (which now have a real
`items-service` + `web` gateway split), this branch deliberately stays one app: the whole
point of the Monolith label is that it *doesn't* split.

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | npm |
| Router | Pages Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.24 |

## Fixture

- `GET /api/items`, `POST /api/items` — `pages/api/items.ts`, session-protected (401 without a
  valid login)
- List page — `pages/index.tsx` (`getServerSideProps`, redirects to `/login` if unauthenticated)
- Create form — `components/items-form.tsx` (Client Component)
- Store — `lib/db.ts` reading/writing `data/items.json` directly (no separate service; this is the
  whole point of "Monolith")
- Validation — `lib/validate.ts` (zod: required, non-empty, 200-char max)

## Auth

Real session auth via NextAuth.js (Credentials provider, JWT sessions), added for consistency with
the Microservices branches even though no gap-analysis report specifically assessed this branch.

- Sign in at `/login`. Default demo credentials: `admin` / `changeme` (override via `DEMO_USERNAME`
  / `DEMO_PASSWORD` env vars).
- Set `NEXTAUTH_SECRET` in any real deployment — a documented, insecure-by-design default is used
  otherwise so the fixture keeps building and running out of the box, matching every other branch
  in this repo.

See [COMPLIANCE.md](COMPLIANCE.md) for the full security/compliance mapping.

## Quality tooling

- **Lint** — `npm run lint` (ESLint flat config, `eslint-plugin-security`, a project rule barring
  filesystem access outside `lib/db.ts`). `lib/lint-fixtures.ts` is a deliberate, labeled fixture
  (unused var, misnamed export, over-nesting, a style violation) so the lint metrics have a real,
  non-blocking finding to report.
- **Duplication** — `npm run dup` (jscpd, config loaded explicitly via `--config jscpd.json`).
  `lib/db-clone.ts` is the one deliberate exception — a clearly-labeled, unimported duplicate of
  `lib/db.ts` for the scanner to detect.
- **Tests** — `npm test` (mocha + ts-node) / `npm run test:coverage` (nyc,
  `nyc-mocha/coverage-summary.json`) / `npm run test:coverage:gate` (CI threshold gate)
- **Mutation testing** — `npm run mutation` (StrykerJS, nightly in CI — see
  `.github/workflows/mutation.yml`)
- **Cyclomatic / Cognitive Complexity** — ESLint's built-in `complexity` rule and
  `eslint-plugin-sonarjs`'s `sonarjs/cognitive-complexity` (both `npm run lint`, warn-only,
  thresholds 8 and 15). `lib/lint-fixtures.ts`'s `highComplexityExample` trips both.
- **CI** — `.github/workflows/ci.yml`, `codeql.yml`, `semgrep.yml`; `.github/dependabot.yml`
- **Coverage delta** — `npm run coverage:delta` (`scripts/coverage-delta.mjs`): compares the
  current coverage run against the committed `coverage-baseline.json`, informational only.
- **Code churn** — `npm run churn` (`scripts/code-churn.mjs`): aggregates real
  `git log --numstat` per tracked file into `churn-report.json`, for risk-based test prioritization.
- **Not tooled (accepted gaps)** — true Path Coverage (distinct from branch coverage) and
  Data Flow "All-Defs/All-Uses" coverage have no maintained TypeScript tool; see
  [COMPLIANCE.md](COMPLIANCE.md#test-classification-taxonomy-coverage) for why.

## Build status

Builds successfully with `npm` + Turbopack on Node.js 20.x.
