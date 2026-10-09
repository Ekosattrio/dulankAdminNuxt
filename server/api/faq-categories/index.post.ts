import { defineEventHandler, readBody } from 'h3'
import type { FaqCategoryFormData } from '~~/server/types/faq'
import { saveFaqCategory } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const body = await readBody<FaqCategoryFormData>(event)

  const { category, isNew } = await saveFaqCategory(body)

  return {
    success: true,
    message: isNew ? 'FAQ Category created successfully' : 'FAQ Category updated successfully',
    data: category,
  }
})
