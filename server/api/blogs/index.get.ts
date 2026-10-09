import type { Blog } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''
  const category = query.category as string || ''

  const allBlogs = readJSON<Blog[]>('blogs.json', [])

  let filtered = allBlogs

  if (search) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(search))) ||
      (item.author && item.author.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  return createResponse(filtered, 'Blogs fetched successfully')
})
