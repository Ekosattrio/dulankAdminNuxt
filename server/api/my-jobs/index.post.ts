import type { MyJobFormData } from '#server/types/my-job'
import { saveMyJob } from '#server/utils/myJobs'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyJobFormData>(event)

  return createResponse(saveMyJob(body), 'Job task saved successfully')
})

