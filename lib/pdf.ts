import type { Procedure } from './types'

export interface PDFStrings {
  title: string
  generatedOnLabel: string
  payerLabel: string
  allPayersLabel: string
  colPatient: string
  colProcedure: string
  colLocation: string
  colFeeType: string
  colPayer: string
  colDate: string
  colStatus: string
  statusLabels: Record<string, string>
}

export async function generateProceduresPDF(
  procedures: Procedure[],
  payer: string | null,
  language: string,
  strings: PDFStrings,
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.width
  const margin = 14
  const dateStr = new Date().toLocaleDateString(language, {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(`Recall — ${strings.title}`, margin, 18)

  // Subtitle row
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const payerText = payer ? `${strings.payerLabel}: ${payer}` : strings.allPayersLabel
  doc.text(payerText, margin, 25)
  doc.text(`${strings.generatedOnLabel}: ${dateStr}`, pageW - margin, 25, { align: 'right' })

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, 28, pageW - margin, 28)

  autoTable(doc, {
    startY: 32,
    margin: { left: margin, right: margin },
    head: [[
      strings.colPatient,
      strings.colProcedure,
      strings.colLocation,
      strings.colFeeType,
      strings.colPayer,
      strings.colDate,
      strings.colStatus,
    ]],
    body: procedures.map(p => [
      p.patientName,
      p.name,
      p.location,
      p.honoraryType,
      p.payer,
      new Date(p.date.slice(0, 10) + 'T00:00:00').toLocaleDateString(language),
      strings.statusLabels[p.status] ?? p.status,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
      overflow: 'linebreak',
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    columnStyles: {
      0: { cellWidth: 38 },  // patient
      1: { cellWidth: 50 },  // procedure
      2: { cellWidth: 38 },  // location
      3: { cellWidth: 30 },  // fee type
      4: { cellWidth: 35 },  // payer
      5: { cellWidth: 22 },  // date
      6: { cellWidth: 28 },  // status
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages()
      const current = doc.getCurrentPageInfo().pageNumber
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `${current} / ${pageCount}`,
        pageW - margin,
        doc.internal.pageSize.height - 8,
        { align: 'right' },
      )
    },
  })

  const slug = strings.title.toLowerCase().replace(/\s+/g, '-')
  doc.save(`recall-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
