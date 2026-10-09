import type { FaqItem } from '#server/types/faq'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FAQ ID is required'
    })
  }

  const allFaqs = await readJSON<FaqItem[]>('faqs.json', [])
  const newFaqs = allFaqs.filter(item => item.id !== id)

  if (allFaqs.length === newFaqs.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ not found'
    })
  }

  await writeJSON('faqs.json', newFaqs)

  return createResponse({ id }, 'FAQ deleted successfully')
})
