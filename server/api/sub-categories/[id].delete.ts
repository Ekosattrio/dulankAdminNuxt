import { deleteSubCategory } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteSubCategory(id || '')

  return createResponse(result, 'Sub category deleted successfully')
})
