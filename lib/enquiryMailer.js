// Email notification for enquiries sent from the Enquiry popup.
// It goes to the email set in the admin (Site content > Enquiry form > contact.notifyEmail),
// or to ENQUIRY_TO from the environment when that is empty.
// SMTP is configured with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM.
// The enquiry is always saved in the admin first, so a mail problem never loses it.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendEnquiryNotification({ to, replyTo, subject, text }) {
  const e = process.env;
  const recipient = EMAIL_RE.test(String(to || "")) ? to : e.ENQUIRY_TO;
  if (!e.SMTP_HOST || !e.SMTP_USER || !e.SMTP_PASS || !e.MAIL_FROM || !recipient) {
    return { sent: false, reason: "not configured" };
  }
  try {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(e.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: e.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: e.SMTP_USER, pass: e.SMTP_PASS },
    });
    await transport.sendMail({ from: e.MAIL_FROM, to: recipient, replyTo, subject, text });
    return { sent: true };
  } catch (error) {
    console.error("[enquiry] could not send email", error);
    return { sent: false, reason: "error" };
  }
}
