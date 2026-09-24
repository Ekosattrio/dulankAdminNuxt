import { readData, writeData } from '~/server/utils/data'
import type { MyIncentive } from '~/types/my-incentive'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<MyIncentive>('my-incentives.json')

  const updated = items.filter((item) => String(item.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Incentive not found'
    })
  }

  writeData('my-incentives.json', updated)

  return {
    success: true,
    data: { id }
  }
})

