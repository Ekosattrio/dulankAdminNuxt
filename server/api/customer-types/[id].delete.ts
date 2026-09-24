import type { CustomerType } from '~/types/customer-type'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer type ID is required'
    })
  }

  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])
  const newTypes = allTypes.filter(t => t.id !== id)

  if (allTypes.length === newTypes.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Customer type not found'
    })
  }

  await writeJSON('customer-types.json', newTypes)

  return createResponse({ id }, 'Customer type deleted successfully')
})

