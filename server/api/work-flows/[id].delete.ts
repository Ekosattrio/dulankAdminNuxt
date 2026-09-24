import type { WorkFlow } from '~/types/work-flow'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Workflow ID is required'
    })
  }

  const allWorkFlows = await readJSON<WorkFlow[]>('work-flows.json', [])
  const newWorkFlows = allWorkFlows.filter(w => w.id !== id && w.no !== id)

  if (allWorkFlows.length === newWorkFlows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Workflow not found'
    })
  }

  await writeJSON('work-flows.json', newWorkFlows)

  return createResponse({ id }, 'Workflow template deleted successfully')
})

