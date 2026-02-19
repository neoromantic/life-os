import { AppShell } from "@/components/app-shell";
import { getBotsNav } from "@/lib/server/agents";

export default async function PostsPage() {
  const bots = await getBotsNav();
  return <AppShell bots={bots} />;
}
