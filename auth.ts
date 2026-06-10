// Auth.js v5 (NextAuth) config. Credentials login for the M&S admins,
// validated against a Supabase admin_users table with bcrypt-hashed passwords.
// JWT sessions (required for Credentials). Exports the helpers used elsewhere.

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // Service-role client → RLS bypassed, anon can never read this table.
        const { data: admin } = await supabaseAdmin
          .from("admin_users")
          .select("id, email, name, password_hash")
          .eq("email", email)
          .single();

        if (!admin) return null;

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return null;

        // What we return here becomes the session user.
        return { id: admin.id, email: admin.email, name: admin.name ?? null };
      },
    }),
  ],
  callbacks: {
    // Carry the admin id through the token onto the session.
    async jwt({ token, user }) {
      if (user) token.id = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = String(token.id);
      return session;
    },
  },
});