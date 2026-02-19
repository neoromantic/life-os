"use client";

import {
  Activity,
  Bot,
  Calendar,
  Flag,
  Goal,
  LayoutDashboard,
  MemoryStick,
  MessageSquare,
  RefreshCcw,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const mainMenu = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Goals", icon: Goal },
  { title: "Posts", icon: SquarePen, active: true },
  { title: "Invoices", icon: Flag },
  { title: "Running", icon: Activity },
];

const agentsMenu = [
  { title: "Mission", icon: Flag },
  { title: "Agents", icon: Bot },
  { title: "Memory", icon: MemoryStick },
  { title: "Activity", icon: Activity },
  { title: "Chat", icon: MessageSquare },
];

const drafts = [
  "i don't know why gyms bros love peanut butter",
  "automating effortless backlinks with openclaw",
  "my new openclaw kanban",
  "my new openclaw dashboard",
  "finn my accountant",
  "tailscale is amazing",
];

export function AppShell() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">LifeOS</p>
            <Badge variant="secondary" className="text-xs">
              alpha
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel>Life</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Agents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {agentsMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border px-3 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="size-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <p className="text-sm font-semibold">Posts</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-900">
                <Search className="mr-1 size-4" /> Search
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-900">
                <RefreshCcw className="mr-1 size-4" /> Restart
              </Button>
            </div>
          </div>
        </header>

        <main className="flex min-h-[calc(100svh-56px)] flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Posts</h1>
              <p className="text-sm text-zinc-400">Manage and schedule social media posts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300">
                <SquarePen className="mr-1 size-4" /> Compose
              </Button>
              <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-900">
                <Calendar className="mr-1 size-4" /> Calendar
              </Button>
            </div>
          </div>

          <section className="flex-1 rounded-xl border border-zinc-800 bg-black/40 p-3">
            <div className="grid grid-cols-7 gap-2 text-xs text-zinc-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="rounded border border-zinc-900 px-2 py-1 text-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-3 grid h-[52vh] grid-cols-7 gap-2">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((column) => (
                <div key={column} className="rounded border border-zinc-900 bg-zinc-950/30" />
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs text-zinc-400">Drafts (drag to schedule)</p>
            <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
              {drafts.map((draft) => (
                <div
                  key={draft}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs"
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
