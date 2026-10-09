import type { SubCategoryFormData } from '~/types/sub-category'
import { saveSubCategory } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const body = await readBody<SubCategoryFormData>(event)
  const { subCategory, isNew } = await saveSubCategory(body)

  return createResponse(
    subCategory,
    isNew ? 'Sub category created successfully' : 'Sub category updated successfully'
  )
})
