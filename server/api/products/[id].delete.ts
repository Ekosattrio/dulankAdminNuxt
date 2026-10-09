import { createError, defineEventHandler, getRouterParam } from 'h3'
import { createResponse } from '../../utils/data'
import { archiveProduct } from '../../utils/products'

export default defineEventHandler((event) => {
  try { return createResponse(archiveProduct(getRouterParam(event, 'id') || ''), 'Product deleted successfully') }
  catch (error) { throw createError({ statusCode: 404, statusMessage: error instanceof Error ? error.message : 'Product tidak ditemukan' }) }
})
