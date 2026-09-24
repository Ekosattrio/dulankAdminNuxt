import type { MyJob, MyJobFormData } from '~/types/my-job'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyJobFormData>(event)

  if (!body || !body.flowName || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Flow name and job title are required'
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])

  if (body.id) {
    // Update
    const idx = allJobs.findIndex(j => j.id === body.id)
    if (idx !== -1) {
      allJobs[idx] = {
        ...allJobs[idx],
        flowName: body.flowName,
        priority: body.priority || allJobs[idx].priority,
        product: body.product || allJobs[idx].product,
        title: body.title,
        description: body.description || allJobs[idx].description,
        status: body.status || allJobs[idx].status,
        assignedTo: body.assignedTo || allJobs[idx].assignedTo,
        dueDate: body.dueDate || allJobs[idx].dueDate
      }
      await writeJSON('my-jobs.json', allJobs)
      return createResponse(allJobs[idx], 'Job task updated successfully')
    }
  }

  // Create
  const newJob: MyJob = {
    id: String(Date.now()),
    flowName: body.flowName,
    priority: body.priority || 'normal',
    product: body.product || 'Custom Print',
    title: body.title,
    description: body.description || '',
    status: body.status || 'Waiting',
    assignedTo: body.assignedTo || 'Operator',
    dueDate: body.dueDate || new Date().toLocaleDateString('id-ID')
  }

  allJobs.unshift(newJob)
  await writeJSON('my-jobs.json', allJobs)

  return createResponse(newJob, 'Job task created successfully')
})

