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
pnpm db:migrate:prod  # apply migrations to PROD_DATABASE_URL (from .env.prod = production DB)
```

The Husky pre-commit hook runs `pnpm typecheck` and `pnpm lint`; both must pass to commit.

## Databases

- `.env.local` holds `DATABASE_URL` for the **development** database: Neon project `cold-hill-93045329` (Vercel store `diariamente-dev`, aws eu-central-1, no real data). It is what `pnpm dev`, `db:migrate` and `db:push` use. Never point it at production, and keep database variables out of `.env` (Next.js falls back to `.env` when `.env.local` lacks a variable).
- `.env.prod` holds only `PROD_DATABASE_URL`, the **unpooled** production string. Next.js never loads that file; only `drizzle.production.config.ts` (`pnpm db:migrate:prod`) reads it. Never read, print or query production data with it.
- Production health data lives only in the production Neon project. Local development, `db:push` and experiments always run against the development DB.
- **Production migrations are explicit, never the default.** Order: `pnpm db:generate` → review the SQL in `drizzle/` → `pnpm db:migrate` (development) → test locally → `pnpm db:migrate:prod` → deploy the code that needs the new schema. When a migration drops or renames something the deployed code still uses, reverse the last two steps: deploy the code that stops using it first, then migrate. Destructive migrations (`DROP`, data-losing `ALTER`) need the user's explicit go-ahead right before running them in production.
- Do not run production migrations during the EU migration cutover window.

## Notes

- `vercel.json` schedules `/api/cron/reminders` daily at `0 19 * * *` (UTC), which is 21:00 Madrid in summer time; reminders are a single daily cron, not per-user schedules.
- `AGENTS.md` forbids running the dev server and using git unless the user explicitly asks.
