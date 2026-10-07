import type { BlogComment } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Comment ID is required',
    })
  }

  const allComments = readJSON<BlogComment[]>('blog-comments.json', [])
  const newComments = allComments.filter(c => String(c.id) !== String(id))

  if (allComments.length === newComments.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Comment not found',
    })
  }

  writeJSON('blog-comments.json', newComments)

  return createResponse({ id }, 'Comment deleted successfully')
})
