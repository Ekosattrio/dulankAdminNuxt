import type { Category } from '~/types/category'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allCategories = await readJSON<Category[]>('categories.json', [])

  let filtered = allCategories

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Categories fetched successfully')
})

