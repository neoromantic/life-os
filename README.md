# life-os

UI surface for Sergey + Baus collaboration.

## Current stack

- Next.js (App Router) + Bun runtime
- shadcn/ui preset: `base-lyra`
  - baseColor: `stone`
  - theme: `emerald`
  - icon library: `hugeicons`
  - font: `JetBrains Mono`
- Lint/format: Biome
- Typecheck: tsgo

## Local run

```bash
bun install
bun run dev
```

App is expected to be available via:
- local: `http://localhost:3000`
- server route: `https://os.baus.goodit.cloud`

## Product scope (current)

### 1) Posts (placeholder)
A lightweight layout to shape future scheduling UX.

### 2) Agents (active build)
Grid UI where each bot is shown as a compact card ("football-card" style), with details opened on click.

Per agent, we show:
- status (online/offline)
- gateway latency
- latest inbound message (best-effort extraction from session jsonl)
- cron jobs + schedule/next run/last status
- core markdown files (when present):
  - `AGENTS.md`
  - `SOUL.md`
  - `USER.md`
  - `MEMORY.md`
  - `HEARTBEAT.md`
  - `BOOTSTRAP.md`

## Data sources

Data is read directly from server runtime, as requested:

- bots list: `/root/bots/*`
- status: `openclaw status --json`
- cron: `openclaw cron list --json`
- sessions: `openclaw sessions --json`
- message transcript: session `.jsonl` files
- core docs: `<bot>/[core].md`

## Caching

Agents data is cached server-side with Next.js cache (`unstable_cache`) and revalidated every ~20s to avoid hammering CLI on each request.

## UI principles for this repo

- Use standard shadcn components.
- Keep UI compact and practical.
- Avoid heavy custom styling.
- Record architecture/product decisions in this README as we go.
