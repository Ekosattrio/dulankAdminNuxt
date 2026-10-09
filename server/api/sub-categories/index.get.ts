import type { SubCategory } from '~/types/sub-category'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const category = (query.category as string || '').trim()
  const status = query.status as string || ''

  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])

  let filtered = allSub

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.categoryCode.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    )
  }

  if (category) {
    filtered = filtered.filter(item => item.category === category)
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Sub-categories fetched successfully')
})

