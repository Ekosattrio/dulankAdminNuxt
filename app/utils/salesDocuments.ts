export function salesErrorMessage(error: unknown): string {
  const value = error as { data?: { statusMessage?: string }; message?: string }
  return value?.data?.statusMessage || value?.message || 'Unable to save. Please try again.'
}

/** Print the selected data only. Browser print also provides Save as PDF. */
export function printSalesRows(title: string, headings: string[], rows: unknown[][]) {
  const frame = document.createElement('iframe')
  frame.setAttribute('title', title)
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;'
  document.body.append(frame)
  const doc = frame.contentDocument
  if (!doc) {
    frame.remove()
    return
  }
  const heading = doc.createElement('h1')
  heading.textContent = title
  const style = doc.createElement('style')
  style.textContent =
    'body{font:12px Arial;color:#111;padding:20px}h1{font-size:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f6f6}@page{size:landscape;margin:12mm}'
  const table = doc.createElement('table')
  for (const [index, values] of [headings, ...rows].entries()) {
    const tr = doc.createElement('tr')
    for (const value of values) {
      const cell = doc.createElement(index === 0 ? 'th' : 'td')
      cell.textContent = String(value ?? '')
      tr.append(cell)
    }
    table.append(tr)
  }
  doc.title = title
  doc.head.append(style)
  doc.body.append(heading, table)
  frame.contentWindow?.addEventListener('afterprint', () => frame.remove(), { once: true })
  frame.contentWindow?.focus()
  frame.contentWindow?.print()
  // Some browsers do not dispatch afterprint for iframes.
  setTimeout(() => frame.remove(), 60_000)
}
