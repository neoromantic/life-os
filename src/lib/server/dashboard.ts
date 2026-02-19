import { getAgentsData } from "@/lib/server/agents";

const TARGET_BOTS = ["baus", "kevin", "yoda", "collecio"];
const SLOT_MINUTES = 15;

export type DashboardAction = {
  botId: string;
  botName: string;
  jobId: string;
  jobName: string;
  atMs: number;
  slotIndex: number;
};

export type DashboardData = {
  wakeStartMs: number;
  endMs: number;
  slotMinutes: number;
  slots: number[];
  bots: string[];
  actions: DashboardAction[];
};

function getWakeStart(now = new Date(), wakeHour = 8): Date {
  const start = new Date(now);
  start.setHours(wakeHour, 0, 0, 0);
  if (now.getTime() < start.getTime()) {
    start.setDate(start.getDate() - 1);
  }
  return start;
}

export async function getDashboardData(): Promise<DashboardData> {
  const agents = await getAgentsData();
  const selected = agents.filter((agent) => TARGET_BOTS.includes(agent.id));

  const wakeStart = getWakeStart();
  const wakeStartMs = wakeStart.getTime();
  const endMs = wakeStartMs + 24 * 60 * 60 * 1000;

  const slotMs = SLOT_MINUTES * 60 * 1000;
  const slotCount = Math.floor((endMs - wakeStartMs) / slotMs);
  const slots = Array.from({ length: slotCount }, (_, i) => wakeStartMs + i * slotMs);

  const actions: DashboardAction[] = [];

  for (const agent of selected) {
    for (const job of agent.cronJobs) {
      const atMs = job.state?.nextRunAtMs;
      if (!atMs) continue;
      if (atMs < wakeStartMs || atMs >= endMs) continue;
      const slotIndex = Math.floor((atMs - wakeStartMs) / slotMs);
      actions.push({
        botId: agent.id,
        botName: agent.name,
        jobId: job.id,
        jobName: job.name ?? job.id,
        atMs,
        slotIndex,
      });
    }
  }

  return {
    wakeStartMs,
    endMs,
    slotMinutes: SLOT_MINUTES,
    slots,
    bots: selected.map((agent) => agent.id),
    actions,
  };
}
