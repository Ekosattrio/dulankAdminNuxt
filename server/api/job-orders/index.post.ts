import type { JobOrderFormData } from '#server/types/job-order'
import { saveJobOrder } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<JobOrderFormData>(event)
  const { order, isNew } = await saveJobOrder(body)
  return createResponse(order, isNew ? 'Job order created successfully' : 'Job order updated successfully')
})
