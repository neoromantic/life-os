import { AppShell } from "@/components/app-shell";
import { getBotsNav } from "@/lib/server/agents";

export default async function Page() {
  const bots = await getBotsNav();
  return <AppShell bots={bots} />;
}
