import type { BlogCategory } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allCategories = readJSON<BlogCategory[]>('blog-categories.json', [])

  let filtered = allCategories

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.slug.toLowerCase().includes(search) ||
      (item.description && item.description.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return createResponse(filtered, 'Blog categories fetched successfully')
})
