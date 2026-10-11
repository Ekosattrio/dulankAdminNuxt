import { defineEventHandler, getQuery } from 'h3'
import { listSalesReports } from '~/server/utils/salesReports'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''
  return createResponse(listSalesReports({ search, startDate, endDate }), 'Sales reports fetched successfully')
})
