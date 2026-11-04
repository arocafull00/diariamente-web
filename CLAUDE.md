# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Architecture, conventions, auth model, data layer and PWA rules live in `AGENTS.md` (imported below); product DNA (audience, tone, mission, red lines) in `PRODUCT.md`; technical spec and phases in `PROJECT.md`.

@AGENTS.md
@DESIGN.md

## Commands

Package manager is pnpm. There is no test suite.

```bash
pnpm dev            # next dev
pnpm build
pnpm lint           # eslint .
pnpm typecheck      # tsc --noEmit
pnpm db:generate    # drizzle-kit generate (schema: src/db/schema.ts -> drizzle/)
pnpm db:migrate     # apply migrations to DATABASE_URL (from .env.local = development DB)
pnpm db:push
```

The Husky pre-commit hook runs `pnpm typecheck` and `pnpm lint`; both must pass to commit.

## Databases

- `.env.local` points to the **development** database: Neon project `cold-hill-93045329` (Vercel store `diariamente-dev`, aws eu-central-1, no real data). Never put a production connection string in any `.env*` file, and never point `.env.local` at production.
- Production health data lives only in the production Neon project. Local development, `db:push` and experiments always run against the development DB.
- **Production migrations are explicit, never the default.** Order: `pnpm db:generate` → review the SQL in `drizzle/` → `pnpm db:migrate` (development) → test locally → migrate production → deploy the code that needs the new schema.
- To migrate production, set `DATABASE_URL` only in the current terminal (a shell variable overrides `.env.local` in `drizzle.config.ts`), using the **unpooled** production string from the Neon console, and clear it afterwards. Read it from a prompt so it does not end up in shell history:

  ```powershell
  $env:DATABASE_URL = Read-Host "Production DATABASE_URL (unpooled)"
  pnpm db:migrate
  Remove-Item Env:DATABASE_URL
  ```

  Do not run production migrations during the EU migration cutover window.

## Notes

- `vercel.json` schedules `/api/cron/reminders` daily at `0 19 * * *` (UTC), which is 21:00 Madrid in summer time; reminders are a single daily cron, not per-user schedules.
- `AGENTS.md` forbids running the dev server and using git unless the user explicitly asks.
