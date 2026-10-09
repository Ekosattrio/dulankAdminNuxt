import { createError, defineEventHandler, readBody } from 'h3'
import type { ProductFormData } from '../../types/product'
import { createResponse } from '../../utils/data'
import { saveProduct } from '../../utils/products'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ProductFormData>(event)
    return createResponse(saveProduct(body), body.id ? 'Product updated successfully' : 'Product created successfully')
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: error instanceof Error ? error.message : 'Product gagal disimpan' })
  }
})
