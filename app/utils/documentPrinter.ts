import { formatIDR } from './currency'

export interface PrintColumn {
  key: string
  label: string
  /** `start`/`end` are accepted as logical aliases for `left`/`right`. */
  align?: 'left' | 'center' | 'right' | 'start' | 'end'
  sortable?: boolean
  format?: (val: any, row: any) => string
}

export interface PrintDocumentConfig {
  title: string
  subtitle?: string
  period?: string
  columns: PrintColumn[]
  rows: Record<string, any>[]
  orientation?: 'portrait' | 'landscape'
  includeLetterhead?: boolean
  includeSignatures?: boolean
  includeTimestamp?: boolean
  company?: {
    name?: string
    tagline?: string
    address?: string
    contact?: string
    email?: string
    web?: string
  }
  signatures?: {
    leftTitle?: string
    leftName?: string
    leftRole?: string
    rightTitle?: string
    rightName?: string
    rightRole?: string
  }
  summaryRows?: {
    label: string
    value: string | number
  }[]
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatIndonesianDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return String(dateInput)
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

function formatIndonesianTimestamp(dateInput: Date = new Date()): string {
  const dateStr = formatIndonesianDate(dateInput)
  const hours = String(dateInput.getHours()).padStart(2, '0')
  const mins = String(dateInput.getMinutes()).padStart(2, '0')
  return `${dateStr}, ${hours}:${mins} WIB`
}

/**
 * Generate full HTML for printable document with clean letterhead, formatted table, and signature.
 */
export function buildDocumentPrintHtml(config: PrintDocumentConfig): string {
  const orientation = config.orientation || (config.columns.length > 6 ? 'landscape' : 'portrait')
  const includeLetterhead = config.includeLetterhead !== false
  const includeSignatures = config.includeSignatures !== false
  const includeTimestamp = config.includeTimestamp !== false

  const company = {
    name: config.company?.name || 'PT. DULANK SEMESTA CIDA',
    tagline: config.company?.tagline || 'Percetakan, Digital Printing & Packaging Solutions',
    address: config.company?.address || 'Jl. Arif Rahman Hakim / Niaga (depan stasiun), Kel. Nagasari, Kec. Karawang Barat, Kab. Karawang, Jawa Barat',
    contact: config.company?.contact || 'Telp: (0267) 845-xxxx | WA: 0877-8813-1400',
    email: config.company?.email || 'ptdulanksemestacida@gmail.com',
    web: config.company?.web || 'percetakan-dulank.netlify.app'
  }

  const signatures = {
    leftTitle: config.signatures?.leftTitle || 'Dibuat Oleh,',
    leftName: config.signatures?.leftName || 'Staff Administrasi',
    leftRole: config.signatures?.leftRole || 'Staf Admin & Operasional',
    rightTitle: config.signatures?.rightTitle || 'Mengetahui,',
    rightName: config.signatures?.rightName || 'Manager Operasional',
    rightRole: config.signatures?.rightRole || 'Kepala Cabang / Pimpinan'
  }

  // Filter out 'actions' or 'action' columns if any passed
  const printableColumns = config.columns.filter(col => col.key !== 'actions' && col.key !== 'action')

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(config.title)}</title>
  <style>
    @page {
      size: A4 ${orientation};
      margin: 10mm 12mm 15mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 0;
      font-size: 10.5px;
      line-height: 1.35;
    }

    /* Letterhead (Kop Surat) */
    .letterhead {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 6px;
      padding-bottom: 4px;
    }
    .letterhead-logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .letterhead-info {
      flex: 1;
      text-align: center;
    }
    .letterhead-company {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .letterhead-tagline {
      font-size: 11px;
      font-weight: 600;
      color: #0284c7;
      margin: 0 0 3px 0;
    }
    .letterhead-address {
      font-size: 9.5px;
      color: #334155;
      margin: 0 0 2px 0;
      line-height: 1.3;
    }
    .letterhead-contact {
      font-size: 9px;
      color: #64748b;
      margin: 0;
    }
    .letterhead-divider {
      border-top: 2.5px solid #0f172a;
      border-bottom: 1px solid #0f172a;
      height: 3px;
      margin: 4px 0 12px 0;
    }

    /* Header Meta */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .doc-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .doc-subtitle {
      font-size: 10px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .doc-meta {
      font-size: 9.5px;
      color: #475569;
      text-align: right;
      line-height: 1.4;
    }

    /* Table */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .report-table th, .report-table td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      font-size: 9.5px;
    }
    .report-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.2px;
    }
    .report-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }

    /* Summary Rows */
    .summary-table {
      margin-left: auto;
      margin-bottom: 16px;
      border-collapse: collapse;
      font-size: 10px;
    }
    .summary-table td {
      padding: 3px 8px;
    }
    .summary-label {
      font-weight: 600;
      color: #475569;
      text-align: right;
    }
    .summary-value {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    /* Signatures Section */
    .signatures-wrap {
      page-break-inside: avoid;
      margin-top: 18px;
      padding-top: 4px;
    }
    .signatures-date {
      text-align: right;
      font-size: 10px;
      color: #334155;
      margin-bottom: 12px;
      padding-right: 20px;
    }
    .signatures-grid {
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
    }
    .sig-col {
      width: 220px;
      text-align: center;
      font-size: 10px;
    }
    .sig-title {
      font-weight: 500;
      color: #334155;
      margin: 0 0 52px 0;
    }
    .sig-name {
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #334155;
      display: inline-block;
      min-width: 170px;
      padding-bottom: 2px;
      margin: 0 0 3px 0;
    }
    .sig-role {
      font-size: 9px;
      color: #64748b;
      margin: 0;
    }

    /* Print Footer */
    .print-footer {
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      color: #94a3b8;
      border-top: 1px dashed #e2e8f0;
      padding-top: 4px;
    }
  </style>
</head>
<body>
  ${includeLetterhead ? `
  <div class="letterhead">
    <img src="/assets/img/logo.png" alt="Logo" class="letterhead-logo" onerror="this.style.display='none'" />
    <div class="letterhead-info">
      <h2 class="letterhead-company">${escapeHtml(company.name)}</h2>
      <p class="letterhead-tagline">${escapeHtml(company.tagline)}</p>
      <p class="letterhead-address">${escapeHtml(company.address)}</p>
      <p class="letterhead-contact">${escapeHtml(company.contact)} | Email: ${escapeHtml(company.email)} | ${escapeHtml(company.web)}</p>
    </div>
  </div>
  <div class="letterhead-divider"></div>
  ` : ''}

  <div class="doc-header">
    <div>
      <h1 class="doc-title">${escapeHtml(config.title)}</h1>
      ${config.subtitle ? `<p class="doc-subtitle">${escapeHtml(config.subtitle)}</p>` : ''}
    </div>
    <div class="doc-meta">
      <div><strong>Periode:</strong> ${escapeHtml(config.period || 'Semua Data')}</div>
      ${includeTimestamp ? `<div><strong>Dicetak:</strong> ${formatIndonesianTimestamp(new Date())}</div>` : ''}
      <div><strong>Jumlah Data:</strong> ${config.rows.length} Baris</div>
    </div>
  </div>

  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 32px; text-align: center;">No</th>
        ${printableColumns.map(col => {
          const isRight = col.align === 'right' || col.align === 'end'
          const alignClass = isRight ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
          return `<th class="${alignClass}">${escapeHtml(col.label)}</th>`
        }).join('')}
      </tr>
    </thead>
    <tbody>
      ${config.rows.length === 0 ? `
        <tr>
          <td colspan="${printableColumns.length + 1}" style="text-align: center; padding: 16px; color: #64748b;">
            Tidak ada data untuk dicetak.
          </td>
        </tr>
      ` : config.rows.map((row, idx) => {
        return `<tr>
          <td style="text-align: center;" class="font-mono">${idx + 1}</td>
          ${printableColumns.map(col => {
            const rawVal = row[col.key]
            let formattedVal = ''
            if (col.format) {
              formattedVal = col.format(rawVal, row)
            } else if (typeof rawVal === 'number' && (col.align === 'right' || col.align === 'end' || /price|amount|total|fee|revenue|subtotal/i.test(col.key))) {
              formattedVal = formatIDR(rawVal)
            } else {
              formattedVal = escapeHtml(rawVal ?? '-')
            }
            const alignClass = col.align === 'right' || col.align === 'end' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'
            return `<td class="${alignClass}">${formattedVal}</td>`
          }).join('')}
        </tr>`
      }).join('')}
    </tbody>
  </table>

  ${config.summaryRows && config.summaryRows.length > 0 ? `
  <table class="summary-table">
    ${config.summaryRows.map(s => `
      <tr>
        <td class="summary-label">${escapeHtml(s.label)}:</td>
        <td class="summary-value">${typeof s.value === 'number' ? formatIDR(s.value) : escapeHtml(s.value)}</td>
      </tr>
    `).join('')}
  </table>
  ` : ''}

  ${includeSignatures ? `
  <div class="signatures-wrap">
    <div class="signatures-date">Karawang, ${formatIndonesianDate(new Date())}</div>
    <div class="signatures-grid">
      <div class="sig-col">
        <p class="sig-title">${escapeHtml(signatures.leftTitle)}</p>
        <p class="sig-name">( ${escapeHtml(signatures.leftName)} )</p>
        <p class="sig-role">${escapeHtml(signatures.leftRole)}</p>
      </div>
      <div class="sig-col">
        <p class="sig-title">${escapeHtml(signatures.rightTitle)}</p>
        <p class="sig-name">( ${escapeHtml(signatures.rightName)} )</p>
        <p class="sig-role">${escapeHtml(signatures.rightRole)}</p>
      </div>
    </div>
  </div>
  ` : ''}

  <div class="print-footer">
    <span>Sistem Administrasi Dulank &bull; Dokumen Resmi Percetakan</span>
    <span>Halaman 1</span>
  </div>
</body>
</html>`
}

/**
 * Execute printing inside a clean, isolated iframe so it doesn't disturb the DOM or capture UI elements.
 */
export function printDocument(config: PrintDocumentConfig): void {
  if (typeof document === 'undefined') return

  const frame = document.createElement('iframe')
  frame.setAttribute('title', config.title || 'Print Document')
  frame.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0;opacity:0;pointer-events:none;z-index:-999;'
  document.body.append(frame)

  const doc = frame.contentDocument
  if (!doc) {
    frame.remove()
    return
  }

  const htmlContent = buildDocumentPrintHtml(config)
  doc.open()
  doc.write(htmlContent)
  doc.close()

  const win = frame.contentWindow
  if (!win) {
    frame.remove()
    return
  }

  // Allow images and fonts to render before triggering print
  win.addEventListener('afterprint', () => {
    setTimeout(() => frame.remove(), 100)
  }, { once: true })

  setTimeout(() => {
    win.focus()
    win.print()
    // Fallback cleanup if afterprint doesn't fire
    setTimeout(() => {
      if (document.body.contains(frame)) {
        frame.remove()
      }
    }, 60000)
  }, 250)
}
