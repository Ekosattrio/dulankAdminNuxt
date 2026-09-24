import type { MyJob } from '~/types/my-job'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const priority = (query.priority as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allJobs = await readJSON<MyJob[]>('my-jobs.json', [])

  let filtered = allJobs

  if (search) {
    filtered = filtered.filter(item =>
      item.flowName.toLowerCase().includes(search) ||
      item.product.toLowerCase().includes(search) ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    )
  }

  if (priority && priority !== 'all') {
    filtered = filtered.filter(item => item.priority.toLowerCase() === priority)
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'My jobs fetched successfully')
})

