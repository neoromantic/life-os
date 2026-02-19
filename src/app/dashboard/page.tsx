import { Clock3 } from "lucide-react";

import { DashboardGrid } from "@/components/dashboard-grid";
import { Badge } from "@/components/ui/badge";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getBotsNav } from "@/lib/server/agents";
import { getDashboardData } from "@/lib/server/dashboard";

export default async function DashboardPage() {
  const [bots, data] = await Promise.all([getBotsNav(), getDashboardData()]);

  return (
    <WorkspaceShell
      active="dashboard"
      bots={bots}
      title="Dashboard"
      description="Wake-up to +24h view with planned bot actions"
      actions={
        <Badge variant="outline">
          <Clock3 className="size-3" />
          {new Date(data.wakeStartMs).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" → "}
          {new Date(data.endMs).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </Badge>
      }
    >
      <DashboardGrid data={data} />
    </WorkspaceShell>
  );
}
