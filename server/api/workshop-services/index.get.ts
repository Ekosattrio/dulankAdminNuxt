import { createError, defineEventHandler, getQuery } from 'h3'
import { createResponse } from '../../utils/data'
import { isWorkshopCategory, listWorkshopServices } from '../../utils/workshopServices'

export default defineEventHandler((event) => {
  const category = String(getQuery(event).category || '')
  if (!isWorkshopCategory(category)) throw createError({ statusCode: 400, statusMessage: 'Kategori layanan tidak valid' })
  const records = listWorkshopServices(category)
  return createResponse(records, { total: records.length })
})
