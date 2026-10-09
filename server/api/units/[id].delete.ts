import { deleteUnit } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteUnit(id || '')

  return createResponse(result, 'Unit deleted successfully')
})
