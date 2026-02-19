import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { unstable_cache } from "next/cache";

type CronJob = {
  id: string;
  name?: string;
  enabled: boolean;
  schedule?: { kind?: string; expr?: string; everyMs?: number; tz?: string };
  state?: { lastStatus?: string; nextRunAtMs?: number; lastRunAtMs?: number };
};

export type AgentCardData = {
  id: string;
  name: string;
  path: string;
  status: "online" | "offline";
  gatewayLatencyMs: number | null;
  cronJobs: CronJob[];
  lastInboundAt: number | null;
  lastInboundText: string;
  mdFiles: Array<{ name: string; path: string; content: string }>;
};

export type BotNavItem = {
  id: string;
  name: string;
};

type BotSource = {
  id: string;
  name: string;
  path: string;
};

const BOT_ROOTS = ["/root/bots", "/home/openclaw/bots"];
const CORE_MD_FILES = [
  "AGENTS.md",
  "SOUL.md",
  "USER.md",
  "MEMORY.md",
  "HEARTBEAT.md",
  "BOOTSTRAP.md",
];

function runJson<T>(cwd: string, args: string[]): T | null {
  try {
    const output = execFileSync("openclaw", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30_000,
    });
    return JSON.parse(output) as T;
  } catch {
    return null;
  }
}

function discoverBots(): BotSource[] {
  const map = new Map<string, BotSource>();

  for (const root of BOT_ROOTS) {
    if (!existsSync(root)) continue;
    const entries = readdirSync(root);
    for (const entry of entries) {
      const fullPath = join(root, entry);
      if (!statSync(fullPath).isDirectory()) continue;
      if (entry.includes(".")) continue;
      if (entry === "tmp") continue;

      if (!map.has(entry)) {
        map.set(entry, {
          id: entry,
          name: entry,
          path: fullPath,
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function readLastUserMessage(sessionFile: string): string {
  if (!existsSync(sessionFile)) return "No inbound message found";

  const lines = readFileSync(sessionFile, "utf8").trim().split("\n").filter(Boolean);

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      const row = JSON.parse(lines[i]) as {
        message?: { role?: string; content?: Array<{ type?: string; text?: string }> };
      };
      if (row.message?.role !== "user") continue;
      const text = row.message.content?.find((part) => part.type === "text")?.text;
      if (!text) continue;
      const cleaned =
        text.split("Conversation info (untrusted metadata):")[0]?.trim() ?? text.trim();
      return cleaned.slice(0, 220) || "(empty user message)";
    } catch {
      // ignore bad jsonl row
    }
  }

  return "No inbound message found";
}

function readCoreFiles(botPath: string) {
  return CORE_MD_FILES.map((fileName) => {
    const filePath = join(botPath, fileName);
    if (!existsSync(filePath)) return null;
    const content = readFileSync(filePath, "utf8");
    return {
      name: fileName,
      path: filePath,
      content: content.slice(0, 12_000),
    };
  }).filter((item): item is { name: string; path: string; content: string } => item !== null);
}

function getLatestSessionEntry(
  sessionStorePath: string,
): { updatedAt: number; sessionFile: string } | null {
  if (!existsSync(sessionStorePath)) return null;
  try {
    const store = JSON.parse(readFileSync(sessionStorePath, "utf8")) as Record<
      string,
      { updatedAt?: number; sessionFile?: string }
    >;

    let latest: { updatedAt: number; sessionFile: string } | null = null;
    for (const [key, value] of Object.entries(store)) {
      if (!key.includes(":telegram:")) continue;
      if (key.includes(":cron:")) continue;
      if (!value.updatedAt || !value.sessionFile) continue;
      if (!latest || value.updatedAt > latest.updatedAt) {
        latest = { updatedAt: value.updatedAt, sessionFile: value.sessionFile };
      }
    }
    return latest;
  } catch {
    return null;
  }
}

function collectAgent(bot: BotSource): AgentCardData {
  const status = runJson<{ gateway?: { reachable?: boolean; connectLatencyMs?: number } }>(
    bot.path,
    ["status", "--json"],
  );
  const cron = runJson<{ jobs?: CronJob[] }>(bot.path, ["cron", "list", "--json"]);
  const sessions = runJson<{ path?: string }>(bot.path, ["sessions", "--json"]);

  const latest = sessions?.path ? getLatestSessionEntry(sessions.path) : null;

  return {
    id: bot.id,
    name: bot.name,
    path: bot.path,
    status: status?.gateway?.reachable ? "online" : "offline",
    gatewayLatencyMs: status?.gateway?.connectLatencyMs ?? null,
    cronJobs: cron?.jobs ?? [],
    lastInboundAt: latest?.updatedAt ?? null,
    lastInboundText: latest?.sessionFile
      ? readLastUserMessage(latest.sessionFile)
      : "No inbound message found",
    mdFiles: readCoreFiles(bot.path),
  };
}

export const getBotsNav = unstable_cache(
  async (): Promise<BotNavItem[]> => discoverBots().map((bot) => ({ id: bot.id, name: bot.name })),
  ["bots-nav-v2"],
  { revalidate: 20 },
);

export const getAgentsData = unstable_cache(
  async (): Promise<AgentCardData[]> => discoverBots().map(collectAgent),
  ["agents-data-v2"],
  { revalidate: 20 },
);

export async function getAgentById(id: string): Promise<AgentCardData | null> {
  const all = await getAgentsData();
  return all.find((agent) => agent.id === id) ?? null;
}
