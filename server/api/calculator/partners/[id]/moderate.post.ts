import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { CalculatorModerationInput } from '../../../../types/calculator-marketplace'
import { moderateCalculatorPartner } from '../../../../utils/calculatorMarketplace'
import { createResponse } from '../../../../utils/data'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id') || ''
    const body = await readBody<CalculatorModerationInput>(event)
    return createResponse(moderateCalculatorPartner(id, body), 'Tindakan partner berhasil disimpan')
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: error instanceof Error ? error.message : 'Tindakan gagal disimpan' })
  }
})
