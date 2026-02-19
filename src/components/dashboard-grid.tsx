import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/server/dashboard";

type DashboardGridProps = {
  data: DashboardData;
};

function fmtTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function DashboardGrid({ data }: DashboardGridProps) {
  const byBot = new Map<string, typeof data.actions>();
  for (const bot of data.bots) byBot.set(bot, []);
  for (const action of data.actions) {
    byBot.get(action.botId)?.push(action);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot timeline</CardTitle>
        <CardDescription>
          From wake-up baseline {fmtTime(data.wakeStartMs)} for next 24h ({data.slotMinutes}-minute
          slots)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-[1400px] space-y-3">
            <div className="grid grid-cols-[120px_repeat(24,minmax(48px,1fr))] gap-1">
              <div className="text-muted-foreground text-xs">Bot</div>
              {Array.from({ length: 24 }).map((_, i) => {
                const hourMs = data.wakeStartMs + i * 60 * 60 * 1000;
                return (
                  <div key={i} className="text-muted-foreground text-center text-xs">
                    {fmtTime(hourMs)}
                  </div>
                );
              })}
            </div>

            {data.bots.map((bot) => {
              const actions = byBot.get(bot) ?? [];
              return (
                <div key={bot} className="grid grid-cols-[120px_repeat(24,minmax(48px,1fr))] gap-1">
                  <div className="truncate text-sm font-medium">{bot}</div>
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const hourStart = hour * 4;
                    const hourActions = actions.filter(
                      (a) => a.slotIndex >= hourStart && a.slotIndex < hourStart + 4,
                    );
                    return (
                      <div key={hour} className="bg-muted/40 min-h-12 rounded-none border p-1">
                        <div className="flex flex-wrap gap-1">
                          {hourActions.map((action) => (
                            <Badge
                              key={action.jobId + action.atMs}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {fmtTime(action.atMs)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
