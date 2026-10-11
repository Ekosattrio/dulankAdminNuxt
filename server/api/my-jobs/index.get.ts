import type { MyJobFilterParams } from '#server/types/my-job'
import { listMyJobs } from '#server/utils/myJobs'

export default defineEventHandler((event) => {
  return createResponse(listMyJobs(getQuery<MyJobFilterParams>(event)), 'My jobs fetched successfully')
})

