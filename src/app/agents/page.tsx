import { Bot } from "lucide-react";

import { AgentsGrid } from "@/components/agents-grid";
import { Button } from "@/components/ui/button";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getAgentsData, getBotsNav } from "@/lib/server/agents";

export default async function AgentsPage() {
  const [agents, bots] = await Promise.all([getAgentsData(), getBotsNav()]);

  return (
    <WorkspaceShell
      active="agents"
      bots={bots}
      title="Agents"
      description="Status and cron overview for all bots"
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
