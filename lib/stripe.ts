// Minimal Stripe client using the REST API directly (no SDK dependency).
// Uses Sam's Stripe account keys, set in Vercel:
//   STRIPE_SECRET_KEY      sk_live_... (or sk_test_... while testing)
//   STRIPE_WEBHOOK_SECRET  whsec_...   (from the webhook endpoint in Stripe)
// Server-only.

import crypto from "node:crypto";

type Params = Record<string, string | number | undefined>;

export async function stripePost<T>(path: string, params: Params): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) body.append(k, String(v));
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe HTTP ${res.status}`);
  return json as T;
}

// Verify the Stripe-Signature header on webhook calls.
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts.t;
  const sigs = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || sigs.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // 5 min tolerance
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
