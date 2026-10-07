import type { FaqItem, FaqFormData } from '#server/types/faq'

export default defineEventHandler(async (event) => {
  const body = await readBody<FaqFormData>(event)

  if (!body || !body.question || !body.answer || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question, answer, and category are required'
    })
  }

  const allFaqs = await readJSON<FaqItem[]>('faqs.json', [])

  if (body.id) {
    const idx = allFaqs.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      allFaqs[idx] = {
        ...allFaqs[idx],
        question: body.question,
        category: body.category,
        answer: body.answer,
        status: body.status || allFaqs[idx].status || 'Active',
        order: body.order !== undefined ? Number(body.order) : allFaqs[idx].order
      }
      await writeJSON('faqs.json', allFaqs)
      return createResponse(allFaqs[idx], 'FAQ updated successfully')
    }
  }

  const nextOrder = allFaqs.length > 0 ? Math.max(...allFaqs.map(f => f.order || 0)) + 1 : 1
  const newFaq: FaqItem = {
    id: `faq-${Date.now()}`,
    question: body.question,
    category: body.category,
    answer: body.answer,
    status: body.status || 'Active',
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    createdDate: new Date().toISOString().slice(0, 10)
  }

  allFaqs.push(newFaq)
  await writeJSON('faqs.json', allFaqs)

  return createResponse(newFaq, 'FAQ created successfully')
})
