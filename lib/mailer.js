// Optional email notification for new enquiries.
// Active only when these environment variables are set (in .env.local and on Vercel):
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, ENQUIRY_TO
// Without them nothing is sent and the enquiry is still saved in the dashboard.

export function mailConfigured() {
  const e = process.env;
  return Boolean(e.SMTP_HOST && e.SMTP_USER && e.SMTP_PASS && e.MAIL_FROM && e.ENQUIRY_TO);
}

export async function sendEnquiryEmail(enquiry) {
  if (!mailConfigured()) return { sent: false, reason: "not configured" };
  try {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const lines = [
      `Name: ${enquiry.name || "-"}`,
      `Company: ${enquiry.company}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      `Topic: ${enquiry.topic || "-"}`,
      "",
      enquiry.message,
    ];

    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.ENQUIRY_TO,
      replyTo: enquiry.email,
      subject: `New website enquiry from ${enquiry.company}`,
      text: lines.join("\n"),
    });
    return { sent: true };
  } catch (error) {
    // Never fail the visitor's request because of email problems.
    console.error("[mailer] could not send enquiry email", error);
    return { sent: false, reason: "error" };
  }
}

// Invitation email for a new admin team member.
export async function sendInviteEmail({ to, name, link, sections, invitedBy }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.MAIL_FROM) {
    return { sent: false, reason: "not configured" };
  }
  try {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const labels = { insights: "Insights", content: "Site content", media: "Media and links", enquiries: "Enquiries", events: "Events" };
    const list = (sections || []).map((s) => labels[s] || s).join(", ");
    const text = [
      `Hello${name ? " " + name : ""},`,
      "",
      `${invitedBy || "An administrator"} invited you to manage the AM International website.`,
      `You will have access to: ${list}.`,
      "",
      "Open this link to set your password and sign in. It expires in 7 days:",
      link,
      "",
      "If you did not expect this email, you can ignore it.",
    ].join("\n");
    const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0a2540">
<p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#e8731a;font-weight:700">AM International</p>
<h2 style="margin:0 0 12px">You are invited to the website admin</h2>
<p>Hello${name ? " " + name : ""},</p>
<p>${invitedBy || "An administrator"} invited you to manage the AM International website.</p>
<p>You will have access to: <strong>${list}</strong>.</p>
<p><a href="${link}" style="display:inline-block;background:#e8731a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">Accept invitation</a></p>
<p style="font-size:13px;color:#555">This link expires in 7 days. If the button does not work, copy this address:<br>${link}</p>
<p style="font-size:13px;color:#555">If you did not expect this email, you can ignore it.</p></div>`;
    await transport.sendMail({ from: process.env.MAIL_FROM, to, subject: "You are invited to the AM International admin", text, html });
    return { sent: true };
  } catch (error) {
    console.error("[mailer] could not send invite email", error);
    return { sent: false, reason: "error" };
  }
}
