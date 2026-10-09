import { createError, defineEventHandler, getQuery } from 'h3'
import type { CalculatorListingCategory } from '../../../types/calculator-marketplace'
import { listCalculatorListings } from '../../../utils/calculatorMarketplace'
import { createResponse } from '../../../utils/data'

const categories: CalculatorListingCategory[] = [
  'offset', 'laminate', 'die_cutting', 'hot_print',
  'paper_group', 'paper_size', 'paper_type', 'paper_price',
]

export default defineEventHandler((event) => {
  const category = String(getQuery(event).category || '') as CalculatorListingCategory
  if (!categories.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: 'Kategori listing tidak valid' })
  }
  const rows = listCalculatorListings(category)
  return createResponse(rows, { total: rows.length })
})
