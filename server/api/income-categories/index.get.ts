import { defineEventHandler, getQuery } from 'h3'
import { getIncomeCategoryList } from '#server/utils/incomeCategoriesData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined
  const status = typeof query.status === 'string' ? query.status : undefined

  const { items, stats } = getIncomeCategoryList({ search, status })

  return {
    success: true,
    data: items,
    stats
  }
})

