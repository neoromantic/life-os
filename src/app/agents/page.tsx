import { Bot } from "lucide-react";

import { AgentsGrid } from "@/components/agents-grid";
import { Button } from "@/components/ui/button";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getAgentsData } from "@/lib/server/agents";

export default async function AgentsPage() {
  const agents = await getAgentsData();

  return (
    <WorkspaceShell
      active="agents"
      title="Agents"
      description="Status, latest inbound, cron schedules, and core markdown context"
      actions={
        <Button size="sm">
          <Bot className="size-4" />
          {agents.length} bots
        </Button>
      }
    >
      <AgentsGrid agents={agents} />
    </WorkspaceShell>
  );
}
