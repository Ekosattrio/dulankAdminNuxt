import { readData, writeData } from '~/server/utils/data'
import type { IncentiveItem } from '~/types/incentive'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<IncentiveItem>>(event)
  const items = readData<IncentiveItem>('incentives.json')

  const qtyComplete = Number(body.qtyComplete || 0)
  const totalAmount = Number(body.totalAmount || 0)

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        qtyComplete,
        totalAmount
      } as IncentiveItem
      writeData('incentives.json', items)
      return { success: true, data: items[index], message: 'Incentive updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newIncentive: IncentiveItem = {
    id: Date.now().toString(),
    code: body.code || `INC-${String(nextNum).padStart(2, '0')}`,
    employee: body.employee || '',
    period: body.period || '2025-08',
    qtyComplete,
    totalAmount,
    status: body.status || 'Pending'
  }

  items.unshift(newIncentive)
  writeData('incentives.json', items)

  return {
    success: true,
    data: newIncentive,
    message: 'Incentive created successfully'
  }
})

