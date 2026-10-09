import type { BlogTag } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()

  const allTags = readJSON<BlogTag[]>('blog-tags.json', [])

  let filtered = allTags

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.slug.toLowerCase().includes(search) ||
      (item.description && item.description.toLowerCase().includes(search))
    )
  }

  return createResponse(filtered, 'Blog tags fetched successfully')
})
