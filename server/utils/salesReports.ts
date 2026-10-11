import type { ReportFilterParams, SalesReportItem } from '../types/reports-sales'
import { isDateWithinRange } from './dateRange'

export function listSalesReports(filters: ReportFilterParams = {}) {
  const search = filters.search?.trim().toLowerCase() || ''
  let records = readJSON<SalesReportItem[]>('sales-reports.json', [])

  if (search) {
    records = records.filter((item) =>
      [item.category, item.channel, item.unit, ...(item.details?.map(detail => detail.product) || [])]
        .some(value => value?.toLowerCase().includes(search)),
    )
  }
  if (filters.startDate || filters.endDate) {
    records = records.filter(item => !item.date || isDateWithinRange(item.date, filters.startDate, filters.endDate))
  }
  return records
}
