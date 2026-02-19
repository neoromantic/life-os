"use client";

import { Calendar, Search, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const drafts = [
  "Automating effortless backlinks with OpenClaw",
  "My new OpenClaw Kanban",
  "My new OpenClaw dashboard",
  "Tailscale is amazing",
];

export function AppShell() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" isActive>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SquarePen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">LifeOS</span>
                  <span className="truncate text-xs">Posts</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Posts">
                    <SquarePen />
                    <span>Posts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="size-4" />
              Search
            </Button>
            <Button size="sm">
              <SquarePen className="size-4" />
              Compose
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h1 className="text-xl font-semibold">Posts</h1>
            <p className="text-muted-foreground text-sm">Manage and schedule social media posts</p>
          </div>

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
                <div
                  key={draft}
                  className="bg-card text-card-foreground rounded-lg border p-3 text-sm"
                >
                  {draft}
                </div>
              ))}
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
