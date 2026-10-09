import { getFaqs } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = query.search ? String(query.search).trim() : undefined
  const category = query.category ? String(query.category).trim() : undefined
  const status = query.status ? String(query.status).trim() : undefined

  const data = await getFaqs({ search, category, status })

  return {
    success: true,
    data,
  }
})
