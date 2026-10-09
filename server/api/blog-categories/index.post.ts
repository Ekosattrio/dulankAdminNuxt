import type { BlogCategoryFormData } from '#server/types/blog'
import { saveBlogCategory } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCategoryFormData>(event)
  const { category, isNew } = await saveBlogCategory(body)

  return createResponse(
    category,
    isNew ? 'Category created successfully' : 'Category updated successfully'
  )
})
