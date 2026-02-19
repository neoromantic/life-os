"use client";

import { Calendar, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceShell } from "@/components/workspace-shell";

const drafts = [
  "Automating effortless backlinks with OpenClaw",
  "My new OpenClaw Kanban",
  "My new OpenClaw dashboard",
  "Tailscale is amazing",
];

export function AppShell() {
  return (
    <WorkspaceShell
      active="posts"
      title="Posts"
      description="Manage and schedule social media posts"
      actions={
        <Button size="sm">
          <SquarePen className="size-4" />
          Compose
        </Button>
      }
    >
      <section className="rounded-xl border p-3">
        <div className="grid grid-cols-7 gap-2 text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-muted-foreground rounded-md border px-2 py-1 text-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mt-3 grid h-[52vh] grid-cols-7 gap-2">
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((column) => (
            <div key={column} className="bg-muted/40 rounded-md border" />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Calendar className="text-muted-foreground size-4" />
          Drafts (drag to schedule)
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {drafts.map((draft) => (
            <div key={draft} className="bg-card text-card-foreground rounded-lg border p-3 text-sm">
              {draft}
            </div>
          ))}
        </div>
      </section>
    </WorkspaceShell>
  );
}
