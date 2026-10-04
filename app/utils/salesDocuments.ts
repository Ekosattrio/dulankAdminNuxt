export function salesErrorMessage(error: unknown): string {
  const value = error as { data?: { statusMessage?: string }; message?: string }
  return value?.data?.statusMessage || value?.message || 'Unable to save. Please try again.'
}

import { printDocument, type PrintColumn } from './documentPrinter'

/** Print the selected data with Kop Surat, clean formatted table, and TTD signatures. */
export function printSalesRows(
  title: string,
  headings: string[],
  rows: unknown[][],
  options?: {
    subtitle?: string
    period?: string
    orientation?: 'portrait' | 'landscape'
    includeLetterhead?: boolean
    includeSignatures?: boolean
  }
) {
  const columns: PrintColumn[] = headings.map((h) => {
    const isRight = /price|amount|total|fee|revenue|subtotal|incentive|qty|butuh/i.test(h)
    const isCenter = /no|id|status|date|sisi|plat/i.test(h)
    return {
      key: h,
      label: h,
      align: isRight ? 'right' : isCenter ? 'center' : 'left'
    }
  })

  const rowObjects = rows.map((r) => {
    const obj: Record<string, any> = {}
    headings.forEach((h, idx) => {
      obj[h] = r[idx]
    })
    return obj
  })

  printDocument({
    title,
    subtitle: options?.subtitle,
    period: options?.period,
    columns,
    rows: rowObjects,
    orientation: options?.orientation || (headings.length > 5 ? 'landscape' : 'portrait'),
    includeLetterhead: options?.includeLetterhead ?? true,
    includeSignatures: options?.includeSignatures ?? true,
  })
}

/** Print single job order ticket / work ticket (supporting Save as PDF) */
export function printJobDetailTicket(job: Record<string, any>) {
  const frame = document.createElement('iframe')
  frame.setAttribute('title', `Job Ticket - ${job.title || 'Work Order'}`)
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;'
  document.body.append(frame)
  const doc = frame.contentDocument
  if (!doc) {
    frame.remove()
    return
  }

  const style = doc.createElement('style')
  style.textContent = `
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #222; padding: 24px; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
    .header p { margin: 2px 0 0 0; color: #666; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase; background: #eee; border: 1px solid #ccc; }
    .badge-urgent { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
    .badge-high { background: #e0f2fe; color: #0284c7; border-color: #7dd3fc; }
    .badge-normal { background: #f3f4f6; color: #4b5563; border-color: #d1d5db; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: #fafafa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; }
    .info-row { display: flex; margin-bottom: 6px; }
    .info-label { width: 120px; color: #6b7280; font-weight: 500; }
    .info-val { flex: 1; font-weight: 600; color: #111827; }
    .section-title { font-size: 14px; font-weight: bold; margin: 20px 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 12px; }
    th { background: #f3f4f6; font-weight: 600; }
    .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; }
    .sig-box { width: 180px; border-top: 1px solid #333; padding-top: 6px; font-size: 11px; }
    @media print {
      body { padding: 0; }
      @page { size: A4; margin: 15mm; }
    }
  `

  const pBadgeClass = (job.priority || '').toLowerCase() === 'urgent' ? 'badge-urgent' : (job.priority || '').toLowerCase() === 'high' ? 'badge-high' : 'badge-normal'

  doc.title = `Job Order Ticket - ${job.title || ''}`
  doc.head.append(style)
  doc.body.innerHTML = `
    <div class="header">
      <div>
        <h1>SURAT PERINTAH KERJA (SPK)</h1>
        <p>No Sales: <strong>${job.noSales || '-'}</strong> | Tanggal: ${job.salesDate || job.dueDate || '-'}</p>
      </div>
      <div>
        <span class="badge ${pBadgeClass}">PRIORITY: ${job.priority || 'NORMAL'}</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="info-row"><span class="info-label">Customer:</span><span class="info-val">${job.customer || '-'}</span></div>
        <div class="info-row"><span class="info-label">Product:</span><span class="info-val">${job.product || '-'}</span></div>
        <div class="info-row"><span class="info-label">Job Title:</span><span class="info-val">${job.title || '-'}</span></div>
      </div>
      <div>
        <div class="info-row"><span class="info-label">Alur Kerja:</span><span class="info-val">${job.flowName || '-'}</span></div>
        <div class="info-row"><span class="info-label">Due Date:</span><span class="info-val">${job.dueDate || '-'}</span></div>
        <div class="info-row"><span class="info-label">Order Qty:</span><span class="info-val">${job.jumlahButuh || job.orderSummary || '-'}</span></div>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <span class="info-label" style="display:block; margin-bottom:4px;">Deskripsi Pekerjaan:</span>
      <div style="padding: 10px; background:#f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 12px;">
        ${job.description || '-'}
      </div>
    </div>

    <div class="section-title">SPESIFIKASI TEKNIS PRODUKSI</div>
    <table>
      <tbody>
        <tr><th style="width: 25%;">Kertas / Bahan</th><td style="width: 25%;">${job.kertas || 'Ap150 Gr'}</td><th style="width: 25%;">Jumlah Plat</th><td style="width: 25%;">${job.jumlahPlat || '4 pcs'}</td></tr>
        <tr><th>Sisi Cetak</th><td>${job.sisiCetak || '2 Sisi'}</td><th>Jumlah Bahan</th><td>${job.jumlahBahan || '5100'}</td></tr>
        <tr><th>Ukuran Kertas</th><td>${job.panjangKertas || '32.5 cm'} x ${job.lebarKertas || '45 cm'}</td><th>Insit / Rusak</th><td>${job.jumlahInsit || '100'}</td></tr>
        <tr><th>Kater / Model</th><td>${job.katerModel || '1 kater'}</td><th>Jumlah Butuh</th><td>${job.jumlahButuh || '5000'}</td></tr>
        <tr><th>Ada Contoh</th><td>${job.adaContoh || 'Tidak'}</td><th>Acc Warna</th><td>${job.accWarna || 'Tidak'}</td></tr>
        <tr><th>Catatan Khusus</th><td colspan="3">${job.keterangan || '-'}</td></tr>
      </tbody>
    </table>

    <div class="footer">
      <div>
        <div style="height: 50px;"></div>
        <div class="sig-box">Admin / Penanggung Jawab</div>
      </div>
      <div>
        <div style="height: 50px;"></div>
        <div class="sig-box">Operator Pelaksana (${job.assignedTo || 'Operator'})</div>
      </div>
    </div>
  `

  frame.contentWindow?.addEventListener('afterprint', () => frame.remove(), { once: true })
  frame.contentWindow?.focus()
  frame.contentWindow?.print()
  setTimeout(() => frame.remove(), 60_000)
}
