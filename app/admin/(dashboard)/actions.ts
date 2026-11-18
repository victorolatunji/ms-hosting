"use server";
// Admin mutations. Each one re-checks the session first.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROPERTIES } from "@/lib/properties";

const ListingStatus = z.enum(["live", "unavailable", "hidden"]);
const InquiryStatus = z.enum(["new", "replied", "archived"]);
const slugs = new Set(PROPERTIES.map((p) => p.slug));

export async function setListingStatus(slug: string, status: string) {
  const session = await requireAdmin();
  const parsed = ListingStatus.safeParse(status);
  if (!slugs.has(slug) || !parsed.success) throw new Error("Invalid listing status");

  const { error } = await supabaseAdmin.from("listing_status").upsert({
    slug,
    status: parsed.data,
    updated_at: new Date().toISOString(),
    updated_by: session.user?.email ?? null,
  });
  if (error) throw new Error(`Could not save: ${error.message}`);

  revalidatePath("/", "layout"); // refresh the public site everywhere
}

export async function setInquiryStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = InquiryStatus.safeParse(status);
  if (!z.string().uuid().safeParse(id).success || !parsed.success) throw new Error("Invalid inquiry status");

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ status: parsed.data, handled_at: parsed.data === "new" ? null : new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Could not save: ${error.message}`);

  revalidatePath("/admin", "layout");
}
