import type { CategoryFormData } from '~/types/category'
import { saveCategory } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const body = await readBody<CategoryFormData>(event)
  const { category, isNew } = await saveCategory(body)

  return createResponse(
    category,
    isNew ? 'Category created successfully' : 'Category updated successfully'
  )
})
