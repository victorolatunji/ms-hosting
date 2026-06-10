// Resend email side effects for inquiry submissions.
// Sends two mails: an owner notification (to M&S) and a branded auto-reply
// (to the enquirer). Called from app/api/inquiries/route.ts AFTER the row is
// saved, so an email failure never blocks a successful submission.

import { Resend } from "resend";

// Lazily created so a missing key doesn't crash the build / local dev.
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM ?? "M&S Hosting Solutions <onboarding@resend.dev>";
const NOTIFY_TO = process.env.INQUIRY_NOTIFY_TO ?? "info.mshostingsolutions@gmail.com";

// Brand palette
const C = {
  bone: "#F5EFE5", boneSoft: "#FBF8F2", moss: "#3D4A3D",
  clay: "#C4634A", amber: "#D4A574", ink: "#1F2521", inkSoft: "#6B6458", line: "#E4DBCB",
};

// Shape mirrors the validated Zod output in the route.
export type Inquiry = {
  type: "contact" | "property" | "host" | "cancellation";
  name: string;
  email: string;
  subject?: string;
  message: string;
  marketing_consent?: boolean;
  property_slug?: string;
  property_address?: string;
  booking_date?: string;
};

const TYPE_LABEL: Record<Inquiry["type"], string> = {
  contact: "enquiry",
  property: "property enquiry",
  host: "become-a-host enquiry",
  cancellation: "cancellation request",
};

// Escape user input before dropping it into HTML.
const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const nl2br = (s = "") => esc(s).replace(/\n/g, "<br/>");

// Shared shell so both emails look on-brand.
function shell(inner: string) {
  return `<div style="margin:0;padding:24px;background:${C.bone};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.ink}">
  <div style="max-width:560px;margin:0 auto;background:${C.boneSoft};border:1px solid ${C.line};border-radius:16px;overflow:hidden">
    <div style="background:${C.moss};padding:20px 28px">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${C.bone};letter-spacing:.5px">M&amp;S Hosting Solutions</span>
    </div>
    <div style="padding:28px">${inner}</div>
    <div style="padding:18px 28px;border-top:1px solid ${C.line};font-size:12px;color:${C.inkSoft};line-height:1.6">
      M&amp;S Hosting Solutions · Greater Toronto Area<br/>
      <a href="mailto:${NOTIFY_TO}" style="color:${C.clay};text-decoration:none">${NOTIFY_TO}</a> · (905) 922-6538
    </div>
  </div>
</div>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:${C.inkSoft};font-size:12px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 0;font-size:15px;color:${C.ink}">${value}</td>
  </tr>`;
}

// ---- Owner notification ----
function ownerHtml(d: Inquiry) {
  const rows = [
    row("Name", esc(d.name)),
    row("Email", `<a href="mailto:${esc(d.email)}" style="color:${C.clay};text-decoration:none">${esc(d.email)}</a>`),
    d.subject ? row("Subject", esc(d.subject)) : "",
    d.property_slug ? row("Property", esc(d.property_slug)) : "",
    d.property_address ? row("Address", esc(d.property_address)) : "",
    d.booking_date ? row("Booking date", esc(d.booking_date)) : "",
    row("Marketing", d.marketing_consent ? "Opted in" : "No"),
  ].join("");

  return shell(`
    <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:${C.clay}">New ${TYPE_LABEL[d.type]}</p>
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:${C.moss}">From ${esc(d.name)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>
    <div style="background:${C.bone};border:1px solid ${C.line};border-radius:12px;padding:16px 18px">
      <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${C.inkSoft}">Message</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${C.ink}">${nl2br(d.message)}</p>
    </div>
    <p style="margin:18px 0 0;font-size:13px;color:${C.inkSoft}">Reply to this email to respond to ${esc(d.name)} directly.</p>
  `);
}

// ---- Customer auto-reply ----
function customerHtml(d: Inquiry) {
  const first = d.name.split(" ")[0];
  return shell(`
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:26px;color:${C.moss}">Thanks, ${esc(first)}.</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:${C.ink}">
      We've received your ${TYPE_LABEL[d.type]} and it's landed with us personally. One of us, Madeline or Samuel, will be in touch soon with the details you asked about.
    </p>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.65;color:${C.ink}">
      We host every one of our stays in person, so you'll always be talking to the people who actually keep the keys.
    </p>
    <div style="background:${C.bone};border:1px solid ${C.line};border-radius:12px;padding:16px 18px;margin-bottom:22px">
      <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${C.inkSoft}">A copy of your note</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${C.ink}">${nl2br(d.message)}</p>
    </div>
    <p style="margin:0;font-size:16px;line-height:1.65;color:${C.ink}">
      Warmly,<br/><span style="font-family:Georgia,serif;font-size:18px;color:${C.moss}">Madeline &amp; Samuel</span>
    </p>
  `);
}

// Plain-text fallbacks (deliverability + non-HTML clients)
function ownerText(d: Inquiry) {
  return [
    `New ${TYPE_LABEL[d.type]} from ${d.name}`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.subject && `Subject: ${d.subject}`,
    d.property_slug && `Property: ${d.property_slug}`,
    d.property_address && `Address: ${d.property_address}`,
    d.booking_date && `Booking date: ${d.booking_date}`,
    `Marketing: ${d.marketing_consent ? "Opted in" : "No"}`,
    ``,
    `Message:`,
    d.message,
    ``,
    `Reply to this email to respond to ${d.name} directly.`,
  ].filter(Boolean).join("\n");
}
function customerText(d: Inquiry) {
  const first = d.name.split(" ")[0];
  return [
    `Thanks, ${first}.`,
    ``,
    `We've received your ${TYPE_LABEL[d.type]} and Madeline or Samuel will be in touch soon.`,
    `We host every stay in person, so you'll always reach the people who keep the keys.`,
    ``,
    `A copy of your note:`,
    d.message,
    ``,
    `Warmly,`,
    `Madeline & Samuel — M&S Hosting Solutions`,
    `${NOTIFY_TO} · (905) 922-6538`,
  ].join("\n");
}

// Fire both emails. Never throws — returns a small status for logging.
export async function sendInquiryEmails(d: Inquiry) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send.");
    return { sent: false, reason: "no_api_key" as const };
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: d.email, // owner can reply straight to the enquirer
      subject: `New ${TYPE_LABEL[d.type]}: ${d.name}`,
      html: ownerHtml(d),
      text: ownerText(d),
    }),
    resend.emails.send({
      from: FROM,
      to: d.email,
      replyTo: NOTIFY_TO, // their reply reaches M&S
      subject: "We've received your message · M&S Hosting Solutions",
      html: customerHtml(d),
      text: customerText(d),
    }),
  ]);

  results.forEach((r, i) => {
    const which = i === 0 ? "owner" : "customer";
    if (r.status === "rejected") console.error(`[email] ${which} send failed:`, r.reason);
    else if (r.value.error) console.error(`[email] ${which} send error:`, r.value.error);
  });

  return { sent: true };
}