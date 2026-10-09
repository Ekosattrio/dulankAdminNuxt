import type { FaqFormData } from '#server/types/faq'
import { saveFaq } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const body = await readBody<FaqFormData>(event)

  const { faq, isNew } = await saveFaq(body)

  return {
    success: true,
    message: isNew ? 'FAQ created successfully' : 'FAQ updated successfully',
    data: faq,
  }
})
