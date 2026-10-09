import type { MyIncentiveFormData } from '#server/types/my-incentive'
import { saveMyIncentive } from '~~/server/utils/jobsProductionDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyIncentiveFormData>(event)
  const { incentive, isNew } = await saveMyIncentive(body)
  return {
    success: true,
    data: incentive,
    message: isNew ? 'Incentive created successfully' : 'Incentive updated successfully',
  }
})
