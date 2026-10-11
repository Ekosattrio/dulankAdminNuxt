import type { MyIncentiveFormData } from '#server/types/my-incentive'
import { saveMyIncentive } from '#server/utils/myIncentives'

export default defineEventHandler(async (event) => {
  const body = await readBody<MyIncentiveFormData>(event)
  return createResponse(saveMyIncentive(body), 'Incentive saved successfully')
})
