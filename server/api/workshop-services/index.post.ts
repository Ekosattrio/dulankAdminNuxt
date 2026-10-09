import { createError, defineEventHandler, readBody } from 'h3'
import type { WorkshopServiceFormData } from '../../types/workshop-service'
import { createResponse } from '../../utils/data'
import { saveWorkshopService } from '../../utils/workshopServices'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<WorkshopServiceFormData>(event)
    return createResponse(saveWorkshopService(body), body.id ? 'Service updated successfully' : 'Service created successfully')
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: error instanceof Error ? error.message : 'Service gagal disimpan' })
  }
})
