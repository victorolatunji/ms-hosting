// Protected shell for every admin page. The auth check lives HERE (server-side),
// not in middleware/proxy — middleware-only auth is bypassable (CVE-2025-29927),
// so the real gate is this layout. Anything under (dashboard) is protected.
//
// Place at: /app/admin/(dashboard)/layout.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bone">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <Link href="/admin" className="font-display text-xl text-moss">
          M&amp;S Admin
        </Link>
        <div className="flex items-center gap-4 text-sm text-ink-soft">
          <span className="hidden sm:inline">{session.user?.email}</span>
          {/* Sign-out is a server action so the cookie is cleared server-side */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-line px-3 py-1.5 transition-colors hover:text-clay"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-10">{children}</main>
    </div>
  );
}