import { createError, defineEventHandler, getRouterParam } from 'h3'
import { createResponse } from '../../utils/data'
import { archiveWorkshopService } from '../../utils/workshopServices'

export default defineEventHandler((event) => {
  try {
    return createResponse(archiveWorkshopService(getRouterParam(event, 'id') || ''), 'Service deleted successfully')
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: error instanceof Error ? error.message : 'Service tidak ditemukan' })
  }
})
