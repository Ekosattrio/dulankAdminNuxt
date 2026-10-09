import type { FaqItem } from '#server/types/faq'

export default defineEventHandler(async () => {
  const allFaqs = await readJSON<FaqItem[]>('faqs.json', [])
  return createResponse(allFaqs, 'FAQs fetched successfully')
})
