// Server-side Supabase client. Uses the service-role key.
// This file should ONLY be imported by server code (API routes, server components).
// Never import this from a "use client" component.
//
// The service-role key bypasses Row Level Security. That's exactly what we
// want here: API routes know what's safe to write and can write it directly,
// without needing to authenticate as a specific user.

import { createClient } from "@supabase/supabase-js";

// Read the env vars at module load time.
// If either is missing, throwing here makes the failure loud and obvious
// instead of producing mysterious null-deref errors later.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env var NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  throw new Error("Missing env var SUPABASE_SERVICE_ROLE_KEY");
}

// Create a single client instance, exported for reuse across API routes.
// auth.persistSession is false because server-side code never has a "user session"
// in the browser-cookie sense; each request authenticates with the service key.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});