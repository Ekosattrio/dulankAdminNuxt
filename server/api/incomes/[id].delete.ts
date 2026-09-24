import { readData, writeData } from '~/server/utils/data'
import type { IncomeRecord } from '~/types/income'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<IncomeRecord>('incomes.json')

  const updated = items.filter((item) => String(item.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Income record not found'
    })
  }

  writeData('incomes.json', updated)

  return {
    success: true,
    data: { id }
  }
})

