import { defineEventHandler, getQuery } from 'h3'
import { getProductProcessList } from '#server/utils/productProcessesData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined
  const processName = typeof query.processName === 'string' ? query.processName : undefined
  const status = typeof query.status === 'string' ? query.status : undefined

  const { items, stats } = getProductProcessList({ search, processName, status })

  return {
    success: true,
    data: items,
    stats
  }
})

