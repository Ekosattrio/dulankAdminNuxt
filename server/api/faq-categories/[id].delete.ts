import type { FaqCategory } from '#server/types/faq'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required',
    })
  }

  const allCategories = await readJSON<FaqCategory[]>('faq-categories.json', [])
  const newCategories = allCategories.filter(c => String(c.id) !== String(id))

  if (allCategories.length === newCategories.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    })
  }

  await writeJSON('faq-categories.json', newCategories)

  return createResponse({ id }, 'FAQ Category deleted successfully')
})
