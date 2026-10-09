import { createError, defineEventHandler, readBody } from 'h3'
import type { ProductImportRow } from '../../types/product'
import { createResponse } from '../../utils/data'
import { importProducts } from '../../utils/products'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ rows: ProductImportRow[] }>(event)
    const records = importProducts(body.rows)
    return createResponse(records, `${records.length} products imported successfully`)
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: error instanceof Error ? error.message : 'Import product gagal' })
  }
})
