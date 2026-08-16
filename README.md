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

**Build did NOT succeed.** Command `yarn run build" exited non-zero.

Tail of log:
```
   ▲ Next.js 15.5.12 (Turbopack)     Creating an optimized production build ...  ✓ Finished writing to disk in 16ms  ✓ Compiled successfully in 2.5s    Linting and checking validity of types ...    Collecting page data ...    Generating static pages (0/4) ...    Generating static pages (1/4)     Generating static pages (2/4)     Generating static pages (3/4)   ✓ Generating static pages (4/4)    Finalizing page optimization ...    Collecting build traces ... [Error: EPERM: operation not permitted, readlink 'D:\Test_Data\Test_Data\Digital-Sippoy\node_modules\next\package.json'] {   errno: -4048,   code: 'EPERM',   syscall: 'readlink',   path: 'D:\\Test_Data\\Test_Data\\Digital-Sippoy\\node_modules\\next\\package.json' } 
```

This branch is committed as-is (attempted config, honest failure) per the DS-A* spec: a documented failure is preferred over a faked pass.
