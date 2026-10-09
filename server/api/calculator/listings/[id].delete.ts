import { createError, defineEventHandler, getRouterParam } from 'h3'
import { archiveCalculatorListing } from '../../../utils/calculatorMarketplace'
import { createResponse } from '../../../utils/data'

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, 'id') || ''
    return createResponse(archiveCalculatorListing(id), 'Listing berhasil dihapus')
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: error instanceof Error ? error.message : 'Listing tidak ditemukan' })
  }
})
