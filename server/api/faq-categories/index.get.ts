import { defineEventHandler, getQuery } from 'h3'
import { getFaqCategories } from '~~/server/utils/faqData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = query.search ? String(query.search).trim() : undefined
  const status = query.status ? String(query.status).trim() : undefined

  const data = await getFaqCategories({ search, status })

  return {
    success: true,
    data,
  }
})
