// Footer contact numbers and emails. Safe to import from server and client code.
// Edited in the admin (Footer contacts). Until something is saved, the single phone and email from the
// site text (Footer section) are used.

export const FOOTER_KEY = "footerContact";
export const MAX_ITEMS = 6;

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

function cleanPhones(list) {
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const v = typeof raw === "string" ? raw.trim().slice(0, 30) : "";
    if (!v || (v.match(/\d/g) || []).length < 5) continue;
    if (!/^[+\d\s()\-.]+$/.test(v)) continue;
    if (!out.includes(v)) out.push(v);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

function cleanEmails(list) {
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const v = typeof raw === "string" ? raw.trim().slice(0, 80) : "";
    if (!v || !EMAIL.test(v)) continue;
    if (!out.some((x) => x.toLowerCase() === v.toLowerCase())) out.push(v);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

export function sanitizeFooterContact(input) {
  return { phones: cleanPhones(input?.phones), emails: cleanEmails(input?.emails) };
}

export function telHref(phone) {
  return "tel:" + String(phone).replace(/[^\d+]/g, "");
}
