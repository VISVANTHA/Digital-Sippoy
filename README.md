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

**Build did NOT succeed.** Command `npm run build" exited non-zero.

Tail of log:
```
> digital-sippoy-ds-006@1.0.0 build > next build --turbo     ▲ Next.js 15.5.12 (Turbopack)     Linting and checking validity of types ...    Creating an optimized production build ...  ✓ Finished writing to disk in 26ms  ✓ Compiled successfully in 1197ms    Collecting page data ...  > Build error occurred [Error: Cannot find module '@next/env' Require stack: - D:\Test_Data\Test_Data\Digital-Sippoy\node_modules\next\dist\export\index.js - D:\Test_Data\Test_Data\Digital-Sippoy\node_modules\next\dist\build\index.js - D:\Test_Data\Test_Data\Digital-Sippoy\node_modules\next\dist\cli\next-build.js] {   code: 'MODULE_NOT_FOUND',   requireStack: [Array] } 
```

This branch is committed as-is (attempted config, honest failure) per the DS-A* spec: a documented failure is preferred over a faked pass.
