import { createError, defineEventHandler, getQuery } from 'h3'
import type { CalculatorPartnerKind } from '../../../types/calculator-marketplace'
import { listCalculatorPartners } from '../../../utils/calculatorMarketplace'
import { createResponse } from '../../../utils/data'

export default defineEventHandler((event) => {
  const kind = String(getQuery(event).kind || '') as CalculatorPartnerKind
  if (!['printing_shop', 'paper_shop'].includes(kind)) {
    throw createError({ statusCode: 400, statusMessage: 'Jenis partner tidak valid' })
  }
  const rows = listCalculatorPartners(kind)
  return createResponse(rows, { total: rows.length })
})
