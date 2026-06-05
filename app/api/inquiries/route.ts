// API route at POST /api/inquiries.
// Receives form submissions from anywhere on the site, validates them,
// and inserts a row into the Supabase inquiries table.
//
// In Phase 3+ this is also where we'll fire off the Resend email and any
// other side effects (Slack notification, etc.). One central pipeline.

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Zod schema describing what a valid form submission looks like.
// Anything that doesn't match gets rejected with a 400 response.
//
// We validate server-side even though we also validate client-side.
// Client-side validation is for UX (instant feedback); server-side is for safety.
// Never trust the client to send well-formed data.
const InquirySchema = z.object({
  type: z.enum(["contact", "property", "host", "cancellation"]),

  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please provide a valid email").max(200),

  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),

  marketing_consent: z.boolean().optional().default(false),

  // Optional fields, only present for certain submission types.
  // All bounded so a bad actor can't dump megabytes of data.
  property_slug:    z.string().trim().max(200).optional(),
  property_address: z.string().trim().max(300).optional(),
  booking_date:     z.string().trim().max(120).optional(),
});

export async function POST(req: Request) {
  // 1. Parse the incoming JSON body.
  // If the body isn't valid JSON, return a friendly error.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }

  // 2. Validate against the Zod schema.
  // safeParse returns { success, data } or { success, error } without throwing.
  const result = InquirySchema.safeParse(body);
  if (!result.success) {
    // Pull the first error message for the response.
    // Treeified errors are also available if we want richer client display later.
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Invalid submission" },
      { status: 400 }
    );
  }

  // 3. Insert into Supabase.
  // We're using the service-role client, so RLS is bypassed and the insert
  // just happens. If something is wrong (table missing, schema mismatch),
  // Supabase returns an error object we handle.
  const { error } = await supabaseAdmin.from("inquiries").insert({
    type:              result.data.type,
    name:              result.data.name,
    email:             result.data.email,
    subject:           result.data.subject ?? null,
    message:           result.data.message,
    marketing_consent: result.data.marketing_consent ?? false,
    property_slug:     result.data.property_slug ?? null,
    property_address:  result.data.property_address ?? null,
    booking_date:      result.data.booking_date ?? null,
  });

  if (error) {
    // Log to the server console for debugging.
    // Don't leak the error details to the client, those can hint at schema.
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  // 4. Success. Return a small confirmation payload.
  // The client uses this to switch the form into "thank you" state.
  return NextResponse.json(
    { ok: true, message: "Thanks. We received your message and will reply soon." },
    { status: 200 }
  );
}