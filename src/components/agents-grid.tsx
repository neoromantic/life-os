"use client";

import { Bot, Clock3, FileText, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgentCardData } from "@/lib/server/agents";

type AgentsGridProps = {
  agents: AgentCardData[];
};

function fmtTime(timestamp: number | null) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleString("en-GB", { hour12: false });
}

export function AgentsGrid({ agents }: AgentsGridProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AgentCardData | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return agents;
    const q = query.toLowerCase();
    return agents.filter((agent) => agent.name.toLowerCase().includes(q));
  }, [agents, query]);

  return (
    <>
      <div className="space-y-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter bots..."
          className="border-input bg-background h-8 w-full rounded-none border px-2.5 text-sm"
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((agent) => (
            <button
              type="button"
              key={agent.name}
              onClick={() => setSelected(agent)}
              className="text-left"
            >
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
                  <p className="text-muted-foreground line-clamp-3 text-xs">
                    {agent.lastInboundText}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => (!open ? setSelected(null) : undefined)}
      >
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-4xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.path}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="status" className="w-full">
                <TabsList>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="cron">Cron</TabsTrigger>
                  <TabsTrigger value="files">Core .md</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={selected.status === "online" ? "default" : "destructive"}>
                          {selected.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Latency</span>
                        <span>
                          {selected.gatewayLatencyMs ? `${selected.gatewayLatencyMs} ms` : "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last inbound at</span>
                        <span>{fmtTime(selected.lastInboundAt)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Last inbound message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{selected.lastInboundText}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cron" className="space-y-3">
                  {selected.cronJobs.length === 0 ? (
                    <Card>
                      <CardContent className="text-muted-foreground py-4 text-sm">
                        No cron jobs found.
                      </CardContent>
                    </Card>
                  ) : (
                    selected.cronJobs.map((job) => (
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

                <TabsContent value="files" className="space-y-3">
                  {selected.mdFiles.length === 0 ? (
                    <Card>
                      <CardContent className="text-muted-foreground py-4 text-sm">
                        Core markdown files not found.
                      </CardContent>
                    </Card>
                  ) : (
                    selected.mdFiles.map((file) => (
                      <Card key={file.path}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="size-4" />
                            {file.name}
                          </CardTitle>
                          <CardDescription>{file.path}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-muted overflow-auto rounded-md p-3 text-xs">
                            {file.content}
                          </pre>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
