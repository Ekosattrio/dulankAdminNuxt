import type { WorkFlow } from '~/types/work-flow'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const category = (query.category as string || '').trim()

  const allWorkFlows = await readJSON<WorkFlow[]>('work-flows.json', [])

  let filtered = allWorkFlows

  if (search) {
    filtered = filtered.filter(item =>
      item.no.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.product.toLowerCase().includes(search) ||
      item.workflowSteps.toLowerCase().includes(search)
    )
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category === category)
  }

  return createResponse(filtered, 'Workflows fetched successfully')
})

