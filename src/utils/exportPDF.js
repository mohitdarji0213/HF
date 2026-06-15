import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HOSPITAL = {
  name: " Bhartiya Hospital",
  tagline: "DBH · Centre of Medical Excellence",
  address: "Near Bus Stand, Churu – 331001, Rajasthan",
  phone: "+91 90990 97329",
  email: "info@dbhchuru.org",
};

// Brand colours (RGB)
const C = {
  primary: [13, 107, 200], // #0d6bc8
  dark: [10, 56, 107], // #0a386b
  accent: [22, 163, 74], // green accent
  white: [255, 255, 255],
  lightBlue: [224, 242, 254], // bg header
  gray: [107, 114, 128],
  darkText: [17, 24, 39],
  rowAlt: [240, 249, 255], // alternating row tint
};

/** Draw the letterhead header at the top of a page */
function drawHeader(doc, title) {
  const W = doc.internal.pageSize.getWidth();

  // Top gradient bar (dark navy)
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, W, 22, "F");

  // Accent strip
  doc.setFillColor(...C.primary);
  doc.rect(0, 22, W, 4, "F");

  // Hospital icon circle
  doc.setFillColor(...C.white);
  doc.circle(18, 11, 7, "F");
  doc.setFillColor(...C.primary);
  doc.circle(18, 11, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text("DBH", 18, 12.5, { align: "center" });

  // Hospital name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text(HOSPITAL.name, 30, 10);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 210, 240);
  doc.text(HOSPITAL.tagline, 30, 17);

  // Right: date
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(`Date: ${today}`, W - 10, 10, { align: "right" });
  doc.text("OFFICIAL DOCUMENT", W - 10, 16, { align: "right" });

  // Report title bar
  doc.setFillColor(...C.lightBlue);
  doc.rect(0, 26, W, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.dark);
  doc.text(title.toUpperCase(), W / 2, 34, { align: "center" });
}

/** Draw the footer with address + page number */
function drawFooter(doc, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Footer bar
  doc.setFillColor(...C.primary);
  doc.rect(0, H - 18, W, 4, "F");

  doc.setFillColor(...C.dark);
  doc.rect(0, H - 14, W, 14, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(HOSPITAL.name, 10, H - 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 210, 240);
  doc.text(
    `${HOSPITAL.address}  |  Ph: ${HOSPITAL.phone}  |  ${HOSPITAL.email}`,
    10,
    H - 3.5,
  );

  // Page number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text(`Page ${pageNum} / ${totalPages}`, W - 10, H - 5.5, {
    align: "right",
  });
}

/**
 * Export data to a professional PDF with hospital letterhead.
 * @param {Object[]} data     - Array of row objects
 * @param {string}   filename - Output file name (without extension)
 * @param {string}   title    - Report title shown in header
 * @param {string[]} [cols]   - Optional column keys to include (defaults to all)
 * @param {Object}   [colLabels] - Optional map of key → display label
 */
export function exportPDF(data, filename, title, cols, colLabels = {}) {
  if (!data || data.length === 0) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Resolve columns
  const keys = cols || Object.keys(data[0]);
  const headers = keys.map(
    (k) =>
      colLabels[k] || k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, " "),
  );
  const rows = data.map((row) => keys.map((k) => row[k] ?? ""));

  // Draw initial header
  drawHeader(doc, title);

  // Table
  autoTable(doc, {
    startY: 42,
    head: [headers],
    body: rows,
    margin: { left: 10, right: 10, bottom: 22 },
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
      lineColor: [220, 235, 250],
      lineWidth: 0.3,
      textColor: C.darkText,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: C.primary,
      textColor: C.white,
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
    },
    alternateRowStyles: {
      fillColor: C.rowAlt,
    },
    bodyStyles: {
      halign: "center",
    },
    columnStyles: {
      0: { halign: "left" },
    },
    didDrawPage: (hookData) => {
      // Re-draw header on every page after the first
      if (hookData.pageNumber > 1) drawHeader(doc, title);
      // Footer on every page
      drawFooter(doc, hookData.pageNumber, doc.internal.getNumberOfPages());
    },
  });

  // Fix footer on page 1 (didDrawPage fires before final page count is known)
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, i, total);
  }

  doc.save(
    `${filename}_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.pdf`,
  );
}
