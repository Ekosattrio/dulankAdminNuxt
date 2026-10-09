import type { BlogCategory } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required',
    })
  }

  const allCategories = readJSON<BlogCategory[]>('blog-categories.json', [])
  const newCategories = allCategories.filter(c => String(c.id) !== String(id))

  if (allCategories.length === newCategories.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    })
  }

  writeJSON('blog-categories.json', newCategories)

  return createResponse({ id }, 'Category deleted successfully')
})
