import { defineEventHandler, getQuery } from 'h3'
import { getJasaLainList } from '#server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined
  const status = typeof query.status === 'string' ? query.status : undefined
  const unit = typeof query.unit === 'string' ? query.unit : undefined

  const { items, stats } = getJasaLainList({ search, status, unit })

  return {
    success: true,
    data: items,
    meta: stats
  }
})

