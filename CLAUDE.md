# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Architecture, conventions, auth model, data layer and PWA rules live in `AGENTS.md` (imported below); product spec and phases in `PROJECT.md`.

@AGENTS.md

## Commands

Package manager is pnpm. There is no test suite.

```bash
pnpm dev            # next dev
pnpm build
pnpm lint           # eslint .
pnpm typecheck      # tsc --noEmit
pnpm db:generate    # drizzle-kit generate (schema: src/db/schema.ts -> drizzle/)
pnpm db:migrate     # apply migrations (needs DATABASE_URL)
pnpm db:push
```

The Husky pre-commit hook runs `pnpm typecheck` and `pnpm lint`; both must pass to commit.

## Notes

- `vercel.json` schedules `/api/cron/reminders` daily at `0 19 * * *` (UTC), which is 21:00 Madrid in summer time; reminders are a single daily cron, not per-user schedules.
- `AGENTS.md` forbids running the dev server and using git unless the user explicitly asks.
