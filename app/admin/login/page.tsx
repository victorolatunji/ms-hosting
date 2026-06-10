// Admin sign-in. Lives OUTSIDE the (dashboard) group so it isn't gated.
// Client component: calls signIn with redirect:false to show inline errors.
//
// Place at: /app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[18px] border border-line bg-bone-soft p-8 shadow-[0_18px_50px_-30px_rgba(31,37,33,0.45)]"
      >
        <h1 className="font-display text-2xl text-moss">Admin sign in</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">M&amp;S Hosting Solutions</p>

        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="mb-4 w-full rounded-lg border border-line bg-bone px-3 py-2 text-ink outline-none focus:border-clay"
        />

        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mb-2 w-full rounded-lg border border-line bg-bone px-3 py-2 text-ink outline-none focus:border-clay"
        />

        {error && <p className="mb-2 text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-full bg-moss py-2.5 text-bone transition-opacity disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}