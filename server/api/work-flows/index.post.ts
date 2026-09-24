import type { WorkFlow, WorkFlowFormData } from '~/types/work-flow'

export default defineEventHandler(async (event) => {
  const body = await readBody<WorkFlowFormData>(event)

  if (!body || !body.product || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category and product name are required'
    })
  }

  const allWorkFlows = await readJSON<WorkFlow[]>('work-flows.json', [])

  if (body.id) {
    // Update
    const idx = allWorkFlows.findIndex(w => w.id === body.id)
    if (idx !== -1) {
      allWorkFlows[idx] = {
        ...allWorkFlows[idx],
        category: body.category,
        product: body.product,
        workflowSteps: body.workflowSteps || allWorkFlows[idx].workflowSteps
      }
      await writeJSON('work-flows.json', allWorkFlows)
      return createResponse(allWorkFlows[idx], 'Workflow updated successfully')
    }
  }

  // Create
  const nextNum = String(allWorkFlows.length + 1).padStart(4, '0')
  const no = body.no || `JAP-${nextNum}`

  const newWorkFlow: WorkFlow = {
    id: String(Date.now()),
    no,
    category: body.category,
    product: body.product,
    workflowSteps: body.workflowSteps || 'Artwork, Cetak, Potong, Packing'
  }

  allWorkFlows.unshift(newWorkFlow)
  await writeJSON('work-flows.json', allWorkFlows)

  return createResponse(newWorkFlow, 'Workflow template created successfully')
})

