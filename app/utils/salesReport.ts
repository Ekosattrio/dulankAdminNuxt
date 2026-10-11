import type { SalesReportItem } from '#server/types/reports-sales'

export function downloadSalesReportCsv(items: SalesReportItem[]) {
  const headers = ['Category', 'Sold Qty', 'Unit', 'Total Sales', 'Total Due', 'Total Amount', 'Percentage']
  const rows = items.map(item => [
    JSON.stringify(item.category), item.soldQty, JSON.stringify(item.unit), item.totalSales,
    item.totalDue, item.totalAmount, JSON.stringify(`${Number(item.percentage).toFixed(2)}%`),
  ])
  const content = [headers, ...rows].map(row => row.join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  link.download = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
