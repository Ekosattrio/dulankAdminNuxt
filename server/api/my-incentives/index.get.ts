import type { MyIncentiveFilterParams } from '#server/types/my-incentive'
import { listMyIncentives } from '#server/utils/myIncentives'

export default defineEventHandler((event) => {
  const result = listMyIncentives(getQuery<MyIncentiveFilterParams>(event))
  return { success: true, data: result.items, stats: result.stats }
})
