import { readData, writeData } from '~/server/utils/data'
import type { IncentiveItem } from '~/types/incentive'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<IncentiveItem>('incentives.json')

  const updated = items.filter((i) => String(i.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Incentive not found'
    })
  }

  writeData('incentives.json', updated)

  return {
    success: true,
    data: { id }
  }
})

