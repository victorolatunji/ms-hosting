// WhatsApp alerts to Sam and Maddie via Meta's official WhatsApp Cloud API.
// Uses an approved message template (WhatsApp requires one for business-started messages).
//
// Env (Vercel, mark Sensitive):
//   WHATSAPP_TOKEN            permanent access token (System User token)
//   WHATSAPP_PHONE_NUMBER_ID  the sending number's ID from WhatsApp Manager
//   WHATSAPP_NOTIFY_TO        who gets alerts, comma-separated, country code, digits only: 19059226538,1647...
//   WHATSAPP_TEMPLATE         template name (default "new_enquiry"), language "en"
//
// Template body (create in WhatsApp Manager, category Utility):
//   New {{1}} from {{2}}: {{3}}. Open the inbox: {{4}}
// Never throws: a WhatsApp hiccup must not break a form or a booking.

const API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v21.0";

// WhatsApp template values can't contain new lines, tabs or long runs of spaces.
const clean = (s: string, max = 300) =>
  s.replace(/[\r\n\t]+/g, " ").replace(/ {4,}/g, "   ").trim().slice(0, max) || "-";

export async function sendWhatsAppAlert(kind: string, from: string, details: string, link: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = (process.env.WHATSAPP_NOTIFY_TO ?? "").split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
  if (!token || !phoneId || to.length === 0) return { sent: 0, skipped: true };

  const template = process.env.WHATSAPP_TEMPLATE ?? "new_enquiry";
  const params = [kind, from, details, link].map((t) => ({ type: "text", text: clean(t) }));

  const results = await Promise.allSettled(
    to.map(async (number) => {
      const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: number,
          type: "template",
          template: { name: template, language: { code: "en" }, components: [{ type: "body", parameters: params }] },
        }),
      });
      if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${(await res.text()).slice(0, 300)}`);
    })
  );
  results.forEach((r) => { if (r.status === "rejected") console.error("[whatsapp]", r.reason); });
  return { sent: results.filter((r) => r.status === "fulfilled").length, skipped: false };
}
