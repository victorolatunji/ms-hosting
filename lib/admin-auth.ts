// Server-side admin gate. Every admin page AND every server action calls this,
// because server actions are reachable by direct POST, not just from our UI.
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}
