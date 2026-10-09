import { deleteVariant } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteVariant(id || '')

  return createResponse(result, 'Variant deleted successfully')
})
