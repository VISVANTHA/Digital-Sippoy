# Compliance mapping — DS-063

Short, honest mapping of this branch against **OWASP ASVS** (Application
Security Verification Standard), the natural fit for a web app. Scope is
this branch's small "items" CRUD fixture, not a production system — see
[README.md](README.md) for what the fixture actually does. This document
gets copied and re-verified per Monolith branch as this work rolls out,
the same way `eslint.config.mjs`, `.nycrc.json`, and the rest of the
tooling does.

Unlike the Microservices branches, this one deliberately stays a single
app — no `items-service` split. `lib/db.ts` reads/writes
`data/items.json` directly.

Target: **ASVS Level 1** (the baseline level, appropriate for a reference
fixture with no real user data). Status values: **Met**, **Accepted gap**
(deliberately not addressed, with a reason), **Open** (needs an owner
decision before it can be closed).

| ASVS area | Status | Notes |
|---|---|---|
| V5 — Validation, Sanitization | Met | `lib/validate.ts` (zod schema): required, non-empty after trim, 200-char max. Applied at the one entry point (`POST /api/items`). |
| V7 — Error Handling, Logging | Met | Errors return structured JSON with a specific status code; no stack traces or internals leak to the client. |
| V10 — Malicious/Dead Code | Met | `lib/db-clone.ts` and `lib/lint-fixtures.ts` are the intentional exceptions — clearly-labeled, unimported scanner fixtures, not reachable app code. |
| V14 — Configuration | Met | `.gitignore` keeps every generated report (lint, coverage, mutation, duplication) out of the repo; dependency versions are pinned in `package.json` + lockfile. |
| V1 — Architecture, Threat Modeling | Accepted gap | No formal threat model exists for a fixture this small; the attack surface is one API route over a JSON file, documented in the README instead of a separate model. |
| V4 — Access Control | Met | `GET`/`POST /api/items` require a valid session (`lib/require-session.ts`, checked via `next-auth/jwt`'s `getToken()`); unauthenticated requests get 401 and the store is never touched. Verified with real signed JWTs in tests. |
| V3 — Session Management | Met | NextAuth.js, JWT strategy, `httpOnly` session cookie. Single demo user (Credentials provider) — a real user store/sign-up flow is out of scope for a minimal CRUD fixture; see README.md's Auth section for how to override the demo credentials and secret. |
| Known-vulnerable dependencies | Met | `next@15.5.24` (repo-wide bump), fixing the 3 direct Next.js advisories (SSRF via rewrites, image-optimization DoS, internal Server Function disclosure) that affected the previously-pinned `15.5.12`. |

## Deliberately accepted, not tracked as gaps

A few mutation-testing survivors (file-encoding string literals with no
observable effect on ASCII JSON content, an exact-duplicate-timestamp
sort-stability case, and NextAuth's own declarative config labels) are
left deliberately undisturbed — same reasoning as documented on the
Microservices branches: chasing them further means testing framework
internals or fighting V8's sort algorithm for near-zero real value.

## Test-classification taxonomy coverage

Against the team's White-Box testing taxonomy (Structural Analysis, Code
Duplication, Lint, Security SAST/SCA, Control Flow, Mutation, Coverage
Delta, Data Flow, Code Churn), this branch now covers:

| L2 Testing Type | Tool | Status |
|---|---|---|
| Cyclomatic Complexity | ESLint `complexity` rule (`eslint.config.mjs`) | Met — `lib/lint-fixtures.ts`'s `highComplexityExample` trips it (warn, non-blocking) |
| Cognitive Complexity | `eslint-plugin-sonarjs`'s `sonarjs/cognitive-complexity` | Met — same fixture function, real finding |
| Code Duplication | jscpd | Met |
| Lint / Rule Violations | ESLint 9 flat config + `eslint-plugin-security` | Met |
| Static Vulnerabilities (SAST) | CodeQL, Semgrep | Met |
| Dependency Risk (SCA) | Dependabot, `npm audit` in CI | Met |
| Statement / Branch Coverage | nyc (`test:coverage:gate`) | Met |
| Mutation Score | StrykerJS | Met |
| Coverage Delta | `scripts/coverage-delta.mjs` (`npm run coverage:delta`) | Met — compares the current `nyc-mocha/coverage-summary.json` against a committed `coverage-baseline.json`, informational only |
| Code Churn | `scripts/code-churn.mjs` (`npm run churn`) | Met — aggregates real `git log --numstat` per tracked file into `churn-report.json` |

Two categories from the taxonomy are **accepted gaps**, not silently
skipped:

- **Path Coverage** (as a metric distinct from branch coverage) — no
  mainstream Istanbul/nyc-based tool computes true path coverage for
  TypeScript; branch coverage (already gated at ≥85%) is the closest
  practical proxy this stack supports. Treating nyc's branch % as "path
  coverage" would be a mislabeled number, not a real metric, so it isn't
  reported under that name.
- **Data Flow Testing — All-Defs / All-Uses coverage** — this is a
  1980s academic C-testing technique (Rapps–Weyuker); no maintained
  TypeScript/JavaScript tool computes def-use path coverage today. The
  data-flow-adjacent findings that *are* real and already tracked (dead
  code / unreachable branches via ESLint, `no-unused-vars`, and
  TypeScript's own unreachable-code checks) are the practical substitute
  in this ecosystem.

## How this file is used

CI (`.github/workflows/ci.yml`, `codeql.yml`, `semgrep.yml`) supplies the
automated half of V5/V7/V10/V14 verification on every push.
