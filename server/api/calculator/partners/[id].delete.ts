import { createError, defineEventHandler, getRouterParam } from 'h3'
import { archiveCalculatorPartner } from '../../../utils/calculatorMarketplace'
import { createResponse } from '../../../utils/data'

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, 'id') || ''
    return createResponse(archiveCalculatorPartner(id), 'Partner berhasil dihapus')
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: error instanceof Error ? error.message : 'Partner tidak ditemukan' })
  }
})
