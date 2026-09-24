import type { JobOrder } from '~/types/job-order'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''
  const priority = query.priority as string || ''
  const workflowCategory = query.workflowCategory as string || ''
  const workflowType = query.workflowType as string || ''

  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])

  let filtered = allOrders

  if (search) {
    filtered = filtered.filter(item =>
      item.no.toLowerCase().includes(search) ||
      item.customer.toLowerCase().includes(search) ||
      item.product.toLowerCase().includes(search) ||
      item.jobTitle.toLowerCase().includes(search) ||
      item.salesNo.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status === status)
  }

  if (priority && priority !== 'All') {
    filtered = filtered.filter(item => item.priority.toLowerCase() === priority.toLowerCase())
  }

  if (workflowCategory && workflowCategory !== 'All') {
    filtered = filtered.filter(item => item.workflowCategory === workflowCategory)
  }

  if (workflowType && workflowType !== 'all') {
    filtered = filtered.filter(item => item.workflowType === workflowType)
  }

  return createResponse(filtered, 'Job orders fetched successfully')
})

