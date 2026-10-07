import type { Blog } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Blog ID is required',
    })
  }

  const allBlogs = readJSON<Blog[]>('blogs.json', [])
  const newBlogs = allBlogs.filter(b => String(b.id) !== String(id))

  if (allBlogs.length === newBlogs.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog not found',
    })
  }

  writeJSON('blogs.json', newBlogs)

  return createResponse({ id }, 'Blog deleted successfully')
})
