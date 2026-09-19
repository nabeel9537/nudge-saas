# Nudge

Nudge is a full-stack TypeScript foundation for a SaaS product that will turn important moments into timely, useful follow-through.

## Run & Operate

- `pnpm --filter @workspace/nudge run dev` — run the Next.js web app
- `pnpm --filter @workspace/api-server run dev` — run the shared API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: Next.js Pages Router, React, TypeScript, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nudge/` — Next.js web app and Nudge presentation foundation
- `artifacts/api-server/` — shared Express API service
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react/` and `lib/api-zod/` — generated API clients and schemas
- `lib/db/` — Drizzle/PostgreSQL package, currently without product tables

## Architecture decisions

- The initial build intentionally contains only the application shell and `/api/healthz`; domain entities, authentication, billing, and persistence are deferred.
- The web app uses Next.js Pages Router for a single, conventional routing model while keeping the shared Express API independently deployable.
- API contracts remain OpenAPI-first so future product endpoints can generate typed client hooks and Zod schemas consistently.

## Product

The first surface is a polished Nudge foundation screen with live API health status. Product workflows will be added in later iterations.

## User preferences

- Keep the initial project structure clean and GitHub-friendly.
- Do not add business functionality until it is explicitly defined.

## Gotchas

- Run `pnpm install` after changing workspace package dependencies.
- Regenerate API clients after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
