import type { JobOrder, JobOrderFormData } from '~/types/job-order'

export default defineEventHandler(async (event) => {
  const body = await readBody<JobOrderFormData>(event)

  if (!body || !body.customer || !body.product) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer and product name are required'
    })
  }

  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])

  if (body.id) {
    // Update
    const idx = allOrders.findIndex(j => j.id === body.id)
    if (idx !== -1) {
      const current = allOrders[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
      const updated: JobOrder = {
        ...current,
        customer: body.customer,
        product: body.product,
        jobTitle: body.jobTitle || current.jobTitle,
        dueDate: body.dueDate || current.dueDate,
        priority: body.priority || current.priority,
        status: body.status || current.status,
        workflowCategory: body.workflowCategory || current.workflowCategory,
        workflowType: body.workflowType || current.workflowType
      }
      allOrders[idx] = updated
      await writeJSON('job-orders.json', allOrders)
      return createResponse(updated, 'Job order updated successfully')
    }
  }

  // Create
  const nextNum = String(allOrders.length + 1).padStart(4, '0')
  const no = body.no || `JO-${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newOrder: JobOrder = {
    id: String(Date.now()),
    no,
    dueDate: body.dueDate || dateStr,
    customer: body.customer,
    product: body.product,
    jobTitle: body.jobTitle || body.product,
    priority: body.priority || 'Medium',
    status: body.status || 'Waiting',
    workflowType: body.workflowType || 'sm52',
    workflowCategory: body.workflowCategory || 'Cetak',
    salesNo: body.salesNo || `SO-${Date.now().toString().slice(-6)}`,
    salesDate: dateStr,
    shipping: body.shipping || 'Pick Up',
    orderSummary: body.orderSummary || '1 Product',
    steps: [
      { name: 'Design / Preflight', status: 'done' },
      { name: 'Plate / CTP Setup', status: 'active' },
      { name: 'Production Run', status: 'pending' },
      { name: 'Finishing & QC', status: 'pending' }
    ]
  }

  allOrders.unshift(newOrder)
  await writeJSON('job-orders.json', allOrders)

  return createResponse(newOrder, 'Job order created successfully')
})

