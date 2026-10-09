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
      const current = allJobs[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Job task not found' })
      const updated: MyJob = {
        ...current,
        flowName: body.flowName,
        priority: body.priority || current.priority,
        product: body.product || current.product,
        title: body.title,
        description: body.description || current.description,
        status: body.status || current.status,
        assignedTo: body.assignedTo || current.assignedTo,
        dueDate: body.dueDate || current.dueDate
      }
      allJobs[idx] = updated
      await writeJSON('my-jobs.json', allJobs)
      return createResponse(updated, 'Job task updated successfully')
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

