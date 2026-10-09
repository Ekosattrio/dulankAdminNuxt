import type { MyIncentive, MyIncentiveFormData } from '~/types/my-incentive'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyIncentiveFormData>(event)
  const items = await readJSON<MyIncentive[]>('my-incentives.json', [])

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Incentive not found' })
      const incentiveRate = Number(body.incentive ?? current.incentive ?? 0)
      const qty = Number(body.qty ?? current.qty ?? 1)
      const amount = body.amount != null ? Number(body.amount) : (incentiveRate * qty)

      const updated: MyIncentive = {
        ...current,
        ...body,
        incentive: incentiveRate,
        qty,
        amount,
        status: body.status || current.status
      }
      items[index] = updated
      await writeJSON('my-incentives.json', items)
      return { success: true, data: updated, message: 'Incentive updated successfully' }
    }
  }

  const nextCodeNum = items.length + 1
  const incentiveRate = Number(body.incentive || 1000)
  const qty = Number(body.qty || 1)
  const amount = body.amount != null ? Number(body.amount) : (incentiveRate * qty)

  const newIncentive: MyIncentive = {
    id: Date.now().toString(),
    code: body.code || `INC-${String(nextCodeNum).padStart(2, '0')}`,
    date: body.date || new Date().toLocaleDateString('id-ID'),
    jobTitle: body.jobTitle || 'Job Cetak',
    flowName: body.flowName || 'Cetak Multilith',
    process: body.process || 'Printing',
    incentive: incentiveRate,
    unit: body.unit || 'Ream',
    qty,
    amount,
    status: body.status || 'Pending',
    employee: body.employee || 'Ahmad'
  }

  items.unshift(newIncentive)
  await writeJSON('my-incentives.json', items)

  return {
    success: true,
    data: newIncentive,
    message: 'Incentive created successfully'
  }
})
