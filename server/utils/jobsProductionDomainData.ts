import type { JobBranchHistoryItem } from '#server/types/job-branch'
import type { JobOrder, JobOrderFormData } from '#server/types/job-order'
import type { MyIncentive, MyIncentiveFormData } from '#server/types/my-incentive'
import type { MyJob, MyJobFormData } from '#server/types/my-job'
import { readJSON, writeJSON } from './data'
import { isDateWithinRange } from './dateRange'

// ----------------- Job Branches History -----------------

export async function getJobBranchesHistory(query?: {
  search?: string
  branch?: string
  startDate?: string
  endDate?: string
}): Promise<JobBranchHistoryItem[]> {
  const items = await readJSON<JobBranchHistoryItem[]>('job-branches-history.json', [])
  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(
      (i) =>
        i.customer.toLowerCase().includes(s) ||
        i.branch.toLowerCase().includes(s) ||
        i.flowName.toLowerCase().includes(s),
    )
  }

  if (query?.branch && query.branch !== 'Branch' && query.branch !== 'All') {
    filtered = filtered.filter((i) => i.branch.toLowerCase() === String(query.branch).toLowerCase())
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter((i) => isDateWithinRange(i.date, String(query.startDate), String(query.endDate)))
  }

  return filtered
}

// ----------------- Job Orders -----------------

export async function getJobOrders(query?: {
  search?: string
  status?: string
  priority?: string
  workflowCategory?: string
  workflowType?: string
}): Promise<JobOrder[]> {
  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])
  let filtered = allOrders

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const priority = query?.priority || ''
  const workflowCategory = query?.workflowCategory || ''
  const workflowType = query?.workflowType || ''

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.no.toLowerCase().includes(search) ||
        item.customer.toLowerCase().includes(search) ||
        item.product.toLowerCase().includes(search) ||
        item.jobTitle.toLowerCase().includes(search) ||
        item.salesNo.toLowerCase().includes(search),
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((item) => item.status === status)
  }

  if (priority && priority !== 'All') {
    filtered = filtered.filter((item) => item.priority.toLowerCase() === priority.toLowerCase())
  }

  if (workflowCategory && workflowCategory !== 'All') {
    filtered = filtered.filter((item) => item.workflowCategory === workflowCategory)
  }

  if (workflowType && workflowType !== 'all') {
    filtered = filtered.filter((item) => item.workflowType === workflowType)
  }

  return filtered
}

export async function saveJobOrder(body: JobOrderFormData): Promise<{ order: JobOrder; isNew: boolean }> {
  if (!body || !body.customer || !body.product) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer and product name are required',
    })
  }

  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])

  if (body.id) {
    const idx = allOrders.findIndex((j) => j.id === body.id)
    if (idx !== -1) {
      const current = allOrders[idx]!
      const updated: JobOrder = {
        ...current,
        customer: body.customer,
        product: body.product,
        jobTitle: body.jobTitle || current.jobTitle,
        dueDate: body.dueDate || current.dueDate,
        priority: body.priority || current.priority,
        status: body.status || current.status,
        workflowCategory: body.workflowCategory || current.workflowCategory,
        workflowType: body.workflowType || current.workflowType,
      }
      allOrders[idx] = updated
      await writeJSON('job-orders.json', allOrders)
      return { order: updated, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Job order not found' })
  }

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
      { name: 'Finishing & QC', status: 'pending' },
    ],
  }

  allOrders.unshift(newOrder)
  await writeJSON('job-orders.json', allOrders)
  return { order: newOrder, isNew: true }
}

export async function deleteJobOrder(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job Order ID is required',
    })
  }

  const allOrders = await readJSON<JobOrder[]>('job-orders.json', [])
  const newOrders = allOrders.filter((j) => j.id !== id && j.no !== id)

  if (allOrders.length === newOrders.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job order not found',
    })
  }

  await writeJSON('job-orders.json', newOrders)
  return { id }
}

// ----------------- My Incentives -----------------

export async function getMyIncentives(query?: {
  search?: string
  process?: string
  status?: string
  startDate?: string
  endDate?: string
}): Promise<{ items: MyIncentive[]; stats: { totalCount: number; totalAmount: number } }> {
  const items = await readJSON<MyIncentive[]>('my-incentives.json', [])
  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(
      (item) =>
        (item.jobTitle && item.jobTitle.toLowerCase().includes(s)) ||
        (item.flowName && item.flowName.toLowerCase().includes(s)) ||
        (item.process && item.process.toLowerCase().includes(s)) ||
        (item.code && item.code.toLowerCase().includes(s)) ||
        (item.unit && item.unit.toLowerCase().includes(s)),
    )
  }

  if (query?.process && query.process !== 'All' && query.process !== 'All Process') {
    filtered = filtered.filter((item) => item.process.toLowerCase() === String(query.process).toLowerCase())
  }

  if (query?.status && query.status !== 'All') {
    filtered = filtered.filter((item) => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter((item) => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  const totalCount = filtered.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0)
  const totalAmount = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  return {
    items: filtered,
    stats: {
      totalCount,
      totalAmount,
    },
  }
}

export async function saveMyIncentive(body: MyIncentiveFormData): Promise<{ incentive: MyIncentive; isNew: boolean }> {
  const items = await readJSON<MyIncentive[]>('my-incentives.json', [])

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]!
      const incentiveRate = Number(body.incentive ?? current.incentive ?? 0)
      const qty = Number(body.qty ?? current.qty ?? 1)
      const amount = body.amount != null ? Number(body.amount) : incentiveRate * qty

      const updated: MyIncentive = {
        ...current,
        ...body,
        incentive: incentiveRate,
        qty,
        amount,
        status: body.status || current.status,
      }
      items[index] = updated
      await writeJSON('my-incentives.json', items)
      return { incentive: updated, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Incentive not found' })
  }

  const nextCodeNum = items.length + 1
  const incentiveRate = Number(body.incentive || 1000)
  const qty = Number(body.qty || 1)
  const amount = body.amount != null ? Number(body.amount) : incentiveRate * qty

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
    employee: body.employee || 'Ahmad',
  }

  items.unshift(newIncentive)
  await writeJSON('my-incentives.json', items)
  return { incentive: newIncentive, isNew: true }
}

export async function deleteMyIncentive(id: string): Promise<{ id: string }> {
  const items = await readJSON<MyIncentive[]>('my-incentives.json', [])
  const updated = items.filter((item) => String(item.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Incentive not found',
    })
  }

  await writeJSON('my-incentives.json', updated)
  return { id }
}

// ----------------- My Jobs -----------------

export async function getMyJobs(query?: {
  search?: string
  priority?: string
  status?: string
}): Promise<MyJob[]> {
  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])
  let filtered = allJobs

  const search = (query?.search || '').toLowerCase().trim()
  const priority = (query?.priority || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.flowName.toLowerCase().includes(search) ||
        item.product.toLowerCase().includes(search) ||
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search),
    )
  }

  if (priority && priority !== 'all') {
    filtered = filtered.filter((item) => item.priority.toLowerCase() === priority)
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((item) => item.status === status)
  }

  return filtered
}

export async function saveMyJob(body: MyJobFormData): Promise<{ job: MyJob; isNew: boolean }> {
  if (!body || !body.flowName || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Flow name and job title are required',
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])

  if (body.id) {
    const idx = allJobs.findIndex((j) => j.id === body.id)
    if (idx !== -1) {
      const current = allJobs[idx]!
      const updated: MyJob = {
        ...current,
        flowName: body.flowName,
        priority: body.priority || current.priority,
        product: body.product || current.product,
        title: body.title,
        description: body.description || current.description,
        status: body.status || current.status,
        assignedTo: body.assignedTo || current.assignedTo,
        dueDate: body.dueDate || current.dueDate,
      }
      allJobs[idx] = updated
      await writeJSON('my-jobs.json', allJobs)
      return { job: updated, isNew: false }
    }
    throw createError({ statusCode: 404, statusMessage: 'Job task not found' })
  }

  const newJob: MyJob = {
    id: String(Date.now()),
    flowName: body.flowName,
    priority: body.priority || 'normal',
    product: body.product || 'Custom Print',
    title: body.title,
    description: body.description || '',
    status: body.status || 'Waiting',
    assignedTo: body.assignedTo || 'Operator',
    dueDate: body.dueDate || new Date().toLocaleDateString('id-ID'),
  }

  allJobs.unshift(newJob)
  await writeJSON('my-jobs.json', allJobs)
  return { job: newJob, isNew: true }
}

export async function updateMyJob(id: string, body: Partial<MyJobFormData>): Promise<MyJob> {
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required',
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])
  const idx = allJobs.findIndex((j) => String(j.id) === String(id))

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found',
    })
  }

  const current = allJobs[idx]!
  const updated: MyJob = {
    ...current,
    ...body,
    id: current.id,
  }
  allJobs[idx] = updated

  await writeJSON('my-jobs.json', allJobs)
  return updated
}

export async function deleteMyJob(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Job ID is required',
    })
  }

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])
  const newJobs = allJobs.filter((j) => j.id !== id)

  if (allJobs.length === newJobs.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found',
    })
  }

  await writeJSON('my-jobs.json', newJobs)
  return { id }
}

