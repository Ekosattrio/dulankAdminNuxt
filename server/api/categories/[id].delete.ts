import { deleteCategory } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteCategory(id || '')

  return createResponse(result, 'Category deleted successfully')
})
