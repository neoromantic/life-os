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

### 1) Dashboard
- `/dashboard` is the new landing page.
- Clicking the LifeOS logo in sidebar header opens `/dashboard`.
- Shows wake-up baseline to +24h timeline with planned bot actions.
- First version uses 15-minute slots, collapsed into hourly cells for readability.
- Initial tracked bots: `baus`, `kevin`, `yoda`, `collecio`.

### 2) Posts (placeholder)
A lightweight layout to shape future scheduling UX.

### 3) Agents (active build)
- `/agents` shows all bots as compact cards (grid).
- Each card links to a dedicated page: `/agents/:id`.
- Sidebar has Agents submenu with all discovered bots.

Per agent page:
- **Overview tab**: status + latest inbound + cron schedules
- **Markdown tab**: core `.md` files
  - `AGENTS.md`
  - `SOUL.md`
  - `USER.md`
  - `MEMORY.md`
  - `HEARTBEAT.md`
  - `BOOTSTRAP.md`

## Data sources

Data is read directly from server runtime, as requested:

- bots list: `/root/bots/*` + `/home/openclaw/bots/*`
- status: `openclaw status --json`
- cron: `openclaw cron list --json`
- sessions: `openclaw sessions --json`
- docker-hosted bots are queried from their own gateway containers via `docker exec openclaw-<bot>-gateway ...`
- message transcript: session `.jsonl` files
- core docs: `<bot>/[core].md`

## Caching

Agents data is cached server-side with Next.js cache (`unstable_cache`) and revalidated every ~60s.

Performance note:
- docker bots are now read mostly from local state files (`.openclaw-*/cron/jobs.json`, `sessions/sessions.json`) + one `docker ps` pass for liveness,
- so page load no longer runs multiple slow `openclaw` calls per docker bot.

## UI principles for this repo

- Use standard shadcn components.
- Keep UI compact and practical.
- Avoid heavy custom styling.
- Record architecture/product decisions in this README as we go.
