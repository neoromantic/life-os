import { notFound } from "next/navigation";

import { AgentDetails } from "@/components/agent-details";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getAgentById, getBotsNav } from "@/lib/server/agents";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentPage({ params }: PageProps) {
  const { id } = await params;
  const [agent, bots] = await Promise.all([getAgentById(id), getBotsNav()]);

  if (!agent) {
    notFound();
  }

  return (
    <WorkspaceShell
      active="agents"
      activeBotId={agent.id}
      bots={bots}
      title={`Agent: ${agent.name}`}
      description={agent.path}
    >
      <AgentDetails agent={agent} />
    </WorkspaceShell>
  );
}
