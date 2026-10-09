import type { Variant } from '~/types/variant'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variant ID is required'
    })
  }

  const allVariants = await readJSON<Variant[]>('variants.json', [])
  const newVariants = allVariants.filter(v => v.id !== id)

  if (allVariants.length === newVariants.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Variant not found'
    })
  }

  await writeJSON('variants.json', newVariants)

  return createResponse({ id }, 'Variant deleted successfully')
})

