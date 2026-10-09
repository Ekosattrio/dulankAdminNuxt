import type { SubCategory } from '~/types/sub-category'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sub category ID is required'
    })
  }

  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])
  const newSub = allSub.filter(s => s.id !== id)

  if (allSub.length === newSub.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sub category not found'
    })
  }

  await writeJSON('sub-categories.json', newSub)

  return createResponse({ id }, 'Sub category deleted successfully')
})

