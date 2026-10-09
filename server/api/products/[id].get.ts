import { createError, defineEventHandler, getRouterParam } from 'h3'
import { createResponse } from '../../utils/data'
import { getProduct } from '../../utils/products'

export default defineEventHandler((event) => {
  const product = getProduct(getRouterParam(event, 'id') || '')
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Product tidak ditemukan' })
  return createResponse(product)
})
