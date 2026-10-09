import type { BlogTag } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tag ID is required',
    })
  }

  const allTags = readJSON<BlogTag[]>('blog-tags.json', [])
  const newTags = allTags.filter(t => String(t.id) !== String(id))

  if (allTags.length === newTags.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tag not found',
    })
  }

  writeJSON('blog-tags.json', newTags)

  return createResponse({ id }, 'Tag deleted successfully')
})
