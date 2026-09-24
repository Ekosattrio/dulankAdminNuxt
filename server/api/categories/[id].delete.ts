import type { Category } from '~/types/category'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  const allCategories = await readJSON<Category[]>('categories.json', [])
  const newCategories = allCategories.filter(c => c.id !== id)

  if (allCategories.length === newCategories.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found'
    })
  }

  await writeJSON('categories.json', newCategories)

  return createResponse({ id }, 'Category deleted successfully')
})

