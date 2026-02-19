import { Bot, Clock3, Timer } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentCardData } from "@/lib/server/agents";

type AgentsGridProps = {
  agents: AgentCardData[];
};

function fmtTime(timestamp: number | null) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleString("en-GB", { hour12: false });
}

export function AgentsGrid({ agents }: AgentsGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <Link key={agent.id} href={`/agents/${agent.id}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Bot className="size-4" />
                  {agent.name}
                </span>
                <Badge variant={agent.status === "online" ? "default" : "destructive"}>
                  {agent.status}
                </Badge>
              </CardTitle>
              <CardDescription>{agent.path}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Timer className="size-4" />
                  Cron jobs
                </span>
                <span>{agent.cronJobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock3 className="size-4" />
                  Last inbound
                </span>
                <span>{fmtTime(agent.lastInboundAt)}</span>
              </div>
              <p className="text-muted-foreground line-clamp-3 text-xs">{agent.lastInboundText}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
