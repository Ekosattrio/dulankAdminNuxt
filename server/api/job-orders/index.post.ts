import type { JobOrderFormData } from '#server/types/job-order'
import { saveJobOrder } from '#server/utils/jobOrders'

export default defineEventHandler(async (event) => {
  const body = await readBody<JobOrderFormData>(event)

  return createResponse(saveJobOrder(body), 'Job order saved successfully')
})

