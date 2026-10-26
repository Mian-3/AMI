// Builds the report as a PDF or a Word file. No database or Next.js code in here.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, HeadingLevel, ShadingType } from "docx";
import { fmtTime } from "@/lib/reportDates";

const NAVY = rgb(0.04, 0.145, 0.25);
const ORANGE = rgb(0.91, 0.45, 0.1);
const GREY = rgb(0.4, 0.4, 0.4);

function summaryOf(report) {
  const ok = report.logins.filter((l) => l.ok).length;
  return [
    ["Enquiries received", report.enquiries.length],
    ["Successful sign ins", ok],
    ["Failed sign ins", report.logins.length - ok],
    ["Changes made in the admin", report.activity.length],
  ];
}

const SECTIONS = (report) => [
  {
    title: "Enquiries",
    empty: "No enquiries in this period.",
    cols: ["When", "Name / Company", "Email / Phone", "Topic", "Message"],
    widths: [0.15, 0.2, 0.22, 0.14, 0.29],
    rows: report.enquiries.map((e) => [fmtTime(e.at), `${e.name}\n${e.company}`, `${e.email}\n${e.phone}`, e.topic || "-", e.message || "-"]),
  },
  {
    title: "Sign in attempts",
    empty: "No sign in attempts in this period.",
    cols: ["When", "Email", "Result", "Address"],
    widths: [0.22, 0.34, 0.26, 0.18],
    rows: report.logins.map((l) => [fmtTime(l.at), l.email || "-", l.ok ? "Signed in" : `Failed (${l.reason || "unknown"})`, l.ip || "-"]),
  },
  {
    title: "Changes in the admin",
    empty: "No changes in this period.",
    cols: ["When", "Who", "Area", "What"],
    widths: [0.2, 0.24, 0.14, 0.42],
    rows: report.activity.map((a) => [fmtTime(a.at), a.name || a.email || "-", a.area || "-", `${a.action}${a.detail ? ": " + a.detail : ""}`]),
  },
];

// ---------- PDF ----------
// The built in PDF fonts cover Latin text only; anything else is shown as "?" (the Word file keeps it).
const latin = (s) => String(s ?? "").replace(/[^\n\x20-\x7E -ÿ]/g, "?");

export async function makePdf(report, title = "Website activity report") {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28;
  const H = 841.89;
  const M = 40;
  let page = doc.addPage([W, H]);
  let y = H - M;

  const ensure = (need) => {
    if (y - need < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const wrap = (text, f, size, maxW) => {
    const out = [];
    for (const para of latin(text).split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const test = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(test, size) <= maxW) line = test;
        else {
          if (line) out.push(line);
          // a single very long word: cut it
          let w = word;
          while (f.widthOfTextAtSize(w, size) > maxW) {
            let n = w.length;
            while (n > 1 && f.widthOfTextAtSize(w.slice(0, n), size) > maxW) n--;
            out.push(w.slice(0, n));
            w = w.slice(n);
          }
          line = w;
        }
      }
      out.push(line);
    }
    return out;
  };

  page.drawText("A.M INTERNATIONAL", { x: M, y, size: 9, font: bold, color: ORANGE });
  y -= 24;
  page.drawText(latin(title), { x: M, y, size: 20, font: bold, color: NAVY });
  y -= 18;
  page.drawText(latin(report.label), { x: M, y, size: 11, font, color: GREY });
  y -= 26;

  // summary boxes
  const sum = summaryOf(report);
  const bw = (W - M * 2 - 3 * 10) / 4;
  sum.forEach(([label, n], i) => {
    const x = M + i * (bw + 10);
    page.drawRectangle({ x, y: y - 46, width: bw, height: 46, color: rgb(0.97, 0.95, 0.92) });
    page.drawText(String(n), { x: x + 10, y: y - 24, size: 18, font: bold, color: NAVY });
    page.drawText(latin(label), { x: x + 10, y: y - 39, size: 7.5, font, color: GREY });
  });
  y -= 66;
  if (report.truncated) {
    page.drawText("Very busy period: only the newest entries are listed.", { x: M, y, size: 8, font, color: ORANGE });
    y -= 14;
  }

  for (const sec of SECTIONS(report)) {
    ensure(60);
    page.drawText(sec.title, { x: M, y, size: 13, font: bold, color: NAVY });
    y -= 8;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: ORANGE });
    y -= 16;
    if (sec.rows.length === 0) {
      page.drawText(sec.empty, { x: M, y, size: 9, font, color: GREY });
      y -= 22;
      continue;
    }
    const tw = W - M * 2;
    const colW = sec.widths.map((w) => w * tw);
    const drawHeader = () => {
      ensure(24);
      page.drawRectangle({ x: M, y: y - 14, width: tw, height: 18, color: NAVY });
      let x = M;
      sec.cols.forEach((c, i) => {
        page.drawText(c, { x: x + 4, y: y - 9, size: 8, font: bold, color: rgb(1, 1, 1) });
        x += colW[i];
      });
      y -= 22;
    };
    drawHeader();
    sec.rows.forEach((row, ri) => {
      const cells = row.map((c, i) => wrap(c, font, 8, colW[i] - 8));
      const lines = Math.max(...cells.map((c) => c.length));
      const h = lines * 10 + 6;
      if (y - h < M) {
        page = doc.addPage([W, H]);
        y = H - M;
        drawHeader();
      }
      if (ri % 2 === 1) page.drawRectangle({ x: M, y: y - h + 8, width: tw, height: h, color: rgb(0.98, 0.98, 0.97) });
      let x = M;
      cells.forEach((c, i) => {
        c.forEach((ln, li) => page.drawText(ln, { x: x + 4, y: y - li * 10 - 2, size: 8, font, color: rgb(0.13, 0.13, 0.13) }));
        x += colW[i];
      });
      y -= h;
    });
    y -= 16;
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => p.drawText(`A.M International  |  Page ${i + 1} of ${pages.length}`, { x: M, y: 20, size: 7.5, font, color: GREY }));
  return Buffer.from(await doc.save());
}

// ---------- Word ----------
export async function makeDocx(report, title = "Website activity report") {
  const cell = (text, opts = {}) =>
    new TableCell({
      shading: opts.head ? { type: ShadingType.CLEAR, fill: "0A2540", color: "auto" } : undefined,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      children: String(text ?? "")
        .split("\n")
        .map((line) => new Paragraph({ children: [new TextRun({ text: line, size: 17, bold: Boolean(opts.head), color: opts.head ? "FFFFFF" : "222222" })] })),
    });

  const children = [
    new Paragraph({ children: [new TextRun({ text: "A.M INTERNATIONAL", bold: true, size: 18, color: "E8731A" })] }),
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: title, bold: true, color: "0A2540" })] }),
    new Paragraph({ children: [new TextRun({ text: report.label, color: "666666", size: 22 })], spacing: { after: 200 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: summaryOf(report).map(([l]) => cell(l, { head: true })) }),
        new TableRow({ children: summaryOf(report).map(([, n]) => cell(String(n))) }),
      ],
    }),
  ];
  if (report.truncated) children.push(new Paragraph({ children: [new TextRun({ text: "Very busy period: only the newest entries are listed.", color: "E8731A", size: 18 })] }));

  for (const sec of SECTIONS(report)) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 }, children: [new TextRun({ text: sec.title, bold: true, color: "0A2540" })] }));
    if (sec.rows.length === 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: sec.empty, color: "666666" })] }));
      continue;
    }
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: sec.widths.map((w) => Math.round(w * 9000)),
        rows: [
          new TableRow({ tableHeader: true, children: sec.cols.map((c) => cell(c, { head: true })) }),
          ...sec.rows.map((r) => new TableRow({ children: r.map((c) => cell(c)) })),
        ],
      })
    );
  }

  const doc = new Document({ sections: [{ children }] });
  return Buffer.from(await Packer.toBuffer(doc));
}
