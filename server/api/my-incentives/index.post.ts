import { readData, writeData } from '~/server/utils/data'
import type { MyIncentive } from '~/types/my-incentive'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<MyIncentive>>(event)
  const items = readData<MyIncentive>('my-incentives.json')

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        qty: Number(body.qty ?? items[index].qty),
        amount: Number(body.amount ?? items[index].amount)
      } as MyIncentive
      writeData('my-incentives.json', items)
      return { success: true, data: items[index], message: 'Incentive updated successfully' }
    }
  }

  const nextCodeNum = items.length + 1
  const newIncentive: MyIncentive = {
    id: Date.now().toString(),
    code: body.code || `INC-${String(nextCodeNum).padStart(2, '0')}`,
    process: body.process || 'General',
    date: body.date || new Date().toISOString().split('T')[0],
    qty: Number(body.qty || 1),
    amount: Number(body.amount || 0),
    status: body.status || 'Pending'
  }

  items.unshift(newIncentive)
  writeData('my-incentives.json', items)

  return {
    success: true,
    data: newIncentive,
    message: 'Incentive created successfully'
  }
})

