// API route at POST /api/inquiries.
// Receives form submissions from anywhere on the site, validates them,
// inserts a row into the Supabase inquiries table, then fires the Resend
// emails (owner notification + customer auto-reply). One central pipeline.

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendInquiryEmails } from "@/lib/email";

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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  // 2. Validate against the Zod schema.
  const result = InquirySchema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Invalid submission" },
      { status: 400 }
    );
  }

  // 3. Insert into Supabase (service-role client, RLS bypassed).
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
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  // 4. Side effect: send emails. The row is already saved, so we never fail
  // the request on an email error — sendInquiryEmails swallows + logs its own.
  await sendInquiryEmails(result.data);

  // 5. Success.
  return NextResponse.json(
    { ok: true, message: "Thanks. We received your message and will reply soon." },
    { status: 200 }
  );
}