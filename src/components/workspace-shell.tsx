"use client";

import { Bot, Search, SquarePen } from "lucide-react";
import Link from "next/link";

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

type WorkspaceShellProps = {
  active: "posts" | "agents";
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function WorkspaceShell({
  active,
  title,
  description,
  actions,
  children,
}: WorkspaceShellProps) {
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
                  <span className="truncate text-xs">Control Panel</span>
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
                  <SidebarMenuButton
                    render={<Link href="/" />}
                    isActive={active === "posts"}
                    tooltip="Posts"
                  >
                    <SquarePen />
                    <span>Posts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/agents" />}
                    isActive={active === "agents"}
                    tooltip="Agents"
                  >
                    <Bot />
                    <span>Agents</span>
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
            {actions}
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
