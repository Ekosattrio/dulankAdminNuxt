import { defineEventHandler, getQuery } from 'h3'
import { getKomponenMinimumList } from '#server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined
  const status = typeof query.status === 'string' ? query.status : undefined

  const { items, stats } = getKomponenMinimumList({ search, status })

  return {
    success: true,
    data: items,
    meta: stats
  }
})

