"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgentCardData } from "@/lib/server/agents";

type AgentDetailsProps = {
  agent: AgentCardData;
};

function fmtTime(timestamp: number | null) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleString("en-GB", { hour12: false });
}

export function AgentDetails({ agent }: AgentDetailsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="docs">Markdown</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gateway</span>
              <Badge variant={agent.status === "online" ? "default" : "destructive"}>
                {agent.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Latency</span>
              <span>{agent.gatewayLatencyMs ? `${agent.gatewayLatencyMs} ms` : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last inbound at</span>
              <span>{fmtTime(agent.lastInboundAt)}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Last inbound text</span>
              <p className="text-sm whitespace-pre-wrap">{agent.lastInboundText}</p>
            </div>
          </CardContent>
        </Card>

        {agent.cronJobs.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-4 text-sm">
              No cron jobs found.
            </CardContent>
          </Card>
        ) : (
          agent.cronJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-sm">{job.name ?? job.id}</CardTitle>
                <CardDescription>{job.id}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Enabled</span>
                  <Badge variant={job.enabled ? "default" : "outline"}>
                    {job.enabled ? "yes" : "no"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Schedule</span>
                  <span>{job.schedule?.expr ?? job.schedule?.kind ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next run</span>
                  <span>{fmtTime(job.state?.nextRunAtMs ?? null)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last status</span>
                  <span>{job.state?.lastStatus ?? "—"}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="docs" className="space-y-3">
        {agent.mdFiles.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-4 text-sm">
              Core markdown files not found.
            </CardContent>
          </Card>
        ) : (
          agent.mdFiles.map((file) => (
            <Card key={file.path}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="size-4" />
                  {file.name}
                </CardTitle>
                <CardDescription>{file.path}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted overflow-auto rounded-md p-3 text-xs">{file.content}</pre>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
